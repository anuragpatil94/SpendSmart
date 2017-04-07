const mongoCollections = require("../config/mongoCollections");
const budget = mongoCollections.budget;
const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {

    getBudgetById(id) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .findOne({_id: id})
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
                .find({"userId":  id})
                .toArray();
        });
    },

    getBudgetByDate(date) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .find({"date":  date});
        });
    },

     getBudgetByCategory(category) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .find({"category":  category})
                .toArray();
        });
    },

    //category and date could get from select on webpage
    addBudget(category, amount, date, userID ) {
        if (typeof amount !== "number") 
            return Promise.reject("Must provide a number");
        
        return budget().then((budgetCollection) => {
            return users
                .getUserById(userID)
                .then((budgetOfUser) => {
                    let newBudget = {
                        _id: uuid.v4(),
                        user: {
                            userId: userID,
                            userName: budgetOfUser.email
                        },
                        category: category,
                        amount: amount,
                        date: date
                    };

                    return budgetCollection
                        .insertOne(newBudget)
                        .then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        })
                        .then((newId) => {
                            return this.getBudgetById(newId);
                        });
                });
        });
    },

    removeBudget(id) {
        return budget().then((budgetCollection) => {
            return budgetCollection
                .removeOne({_id: id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete budget with id of ${id}`)
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
}

module.exports = exportedMethods;