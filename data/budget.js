const mongoCollections = require("../config/mongoCollections");
const budget = mongoCollections.budget;
const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {

    getAllBudget() {
        return budget().then((budgetCollection) => {
            return budgetCollection.find({}).toArray();
        });
    },
    getRecent(userId){
         return budget().then((budgetCollection) => {
            let past=new Date();            
            past.setMonth(past.getMonth()-3);
            return budgetCollection
                .find({"userId": userId, "month": { $gt: past.getMonth()+1 },"year": { $gte: past.getFullYear() }})
                .toArray();
        });
    },
    getBudgetById(id) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .findOne({
                    _id: id
                })
                .then((budget) => {
                    if (!budget)
                        throw "Budget not found";
                    return budget;
                });
        });
    },

    getBudgetByUserId(id) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .find({
                    "userId": id
                })
                .toArray();
        });
    },

    getBudgetForMonth(user, month, year) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .find({
                    "month": month,
                    "year": year,
                    "userId": user
                }).toArray();
        });
    },

    getBudgetByCategory(user, month, year, category) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .findOne({
                    "month": month,
                    "year": year,
                    "userId": user,
                    "category": category
                });
        });
    },

    //category and date could get from select on webpage
    addBudget(category, amount, month, year, userID) {
        if (typeof amount !== "number")
            return Promise.reject("Must provide a number");

        return budget().then((budgetCollection) => {
            return users
                .getUserById(userID)
                .then((budgetOfUser) => {
                    return this.getBudgetByCategory(userID, month, year, category)
                    .then(b => {
                        if (!b) {
                            let newBudget = {
                                _id: uuid.v4(),
                                userId: userID,
                                category: category,
                                amount: amount,
                                month: month,
                                year: year
                            };
                            return budgetCollection
                                .insertOne(newBudget)
                                .then((newInsertInformation) => {
                                    return newInsertInformation.insertedId;
                                });
                        } else {
                            return this.updateBudget(b._id, {amount:amount});
                        }
                    });
                   
                });
        });
    },

    removeBudget(id) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .removeOne({
                    _id: id
                })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw (`Could not delete budget with id of ${id}`);
                    } else {}
                });
        });
    },

    updateBudget(id, updatedBudget) {
        return budget().then((budgetCollection) => {
            let updatedBudgetData = {};

            if (updatedBudget.category) {
                updatedBudgetData.category = updatedBudget.category;
            }

            if (updatedBudget.amount) {
                updatedBudgetData.amount = updatedBudget.amount;
            }

            if (updatedBudget.date) {
                updatedBudgetData.date = updatedBudget.date;
            }

            let updateCommand = {
                $set: updatedBudgetData
            };

            return budgetCollection.updateOne({
                _id: id
            }, updateCommand).then((result) => {
                return this.getBudgetById(id);
            });
        });
    }
};

module.exports = exportedMethods;