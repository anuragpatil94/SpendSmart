const userData = require("./users");
const billsData = require("./bills");
const budgetData = require("./budget");
const Enumerable = require("linq");
module.exports = {
    users: userData,
    bills: billsData,
    budget: budgetData,
    getDashboardData(userId) {
        return billsData.getRecent(userId)
            .then(b => {
                let byDate = Enumerable.from(b)
                    .groupBy(b => b.date.full.toDateString())
                    .select(a => {
                        let d = new Date(a.key());
                        return {
                            date: d,
                            amount: a.sum(q => q.amount)
                        };
                    }).orderBy(x => x.date).toArray();

                let byMonth = Enumerable.from(b)
                    .groupBy(b => new Date(b.date.year, b.date.month).toDateString())
                    .select(a => {
                        return {
                            date: new Date(a.key()),
                            amount: a.sum(q => q.amount)
                        };
                    }).orderBy(x => x.date).toArray();
                let recent = {
                    billsByMonth: byMonth,
                    billsByDate: byDate
                };
                return recent;
            }).then(r => {
                r.budget = [
                    ['Category', 'Budget', 'Spent']
                ];
                let date = new Date();
                return budgetData.getBudgetForMonth(userId, date.getMonth(), date.getFullYear())
                    .then(b => {
                        let byCategory = {};
                        for (let i = 0; i < b.length; i++) {
                            let cat = b[i];
                            byCategory[cat.category] = [cat.amount, 0];
                        }
                        return billsData.getBillByMonth(userId, date.getMonth(), date.getFullYear())
                            .then(bills => {
                                for (let i = 0; i < bills.length; i++) {
                                    let bill = bills[i];
                                    if (byCategory[bill.category]) {
                                        byCategory[bill.category][1] = bill.amount;
                                    } else {
                                        byCategory[bill.category] = [0, bill.amount];
                                    }
                                }
                                for (let k in byCategory) {
                                    r.budget.push([k, byCategory[k][0], byCategory[k][1]]);
                                }
                                r.hasCurrent = r.budget.length > 1;
                                return r;
                            });
                    });
            });
    }
};