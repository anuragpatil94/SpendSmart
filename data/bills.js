const mongoCollections = require("../config/mongoCollections");
const bill = mongoCollections.transactions;
const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {

    getAllBills() {
        return bill().then((billCollection) => {
            return billCollection.find({}).toArray();
        });
    },

    getBillById(id) {
        return bill().then((billCollection) => {
            return billCollection
                .findOne({_id: id})
                .then((bill) => {
                    if (!bill)
                        throw "Bill not found";
                    return bill;
                });
        });
    },
   
    getBillByMonth(userId, month, year) {
        return bill().then((billCollection) => {
            return billCollection
                .find({"user.userId": userId, "date.month": month, "date.year": year})
                .toArray();
        });
    },

    getBillByCategory(userId, category) {
        return bill().then((billCollection) => {
            return billCollection
                .find({
                    "user.userId": userId,
                    "category": category
                })
                .toArray();
        });
    },

    getRecent(userId){
         return bill().then((billCollection) => {
            let past=new Date();            
            past.setMonth(past.getMonth()-3);
            return billCollection
                .find({"user.userId": userId, "date.full": { $gt: past }})
                .toArray();
        });
    },

    addBill(category, amount, date, note, userID) {
        if (typeof amount !== "number")
            return Promise.reject("Must provide a number");

        return bill().then((billCollection) => {
            return users
                .getUserById(userID)
                .then((billOfUser) => {
                    let newBill = {
                        _id: uuid.v4(),
                        user: {
                            userId: userID,
                            userName: billOfUser.email
                        },
                        category: category,
                        amount: amount,
                        note: note,
                        date: {
                            date: date.getDate(),
                            month: date.getMonth(),
                            fullMonth: date.toLocaleString("en-US", {month:"long"}),
                            year: date.getFullYear(),
                            full:date
                        }
                    };

                    return billCollection
                        .insertOne(newBill)
                        .then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        })
                        .then((newId) => {
                            return this.getBillById(newId);
                        });
                });
        });
    },

    removeBill(id) {
        return bill().then((billCollection) => {
            return billCollection
                .removeOne({_id: id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete bill with id of ${id}`);
                    } else {
                    }
                });
        });
    },

    updateBill(id, updatedBill) {
        return bill().then((billCollection) => {
            let updatedBillData = {};

            if (updatedBill.category) {
                updatedBillData.category = updatedBill.category;
            }

            if (updatedBill.amount) {
                updatedBillData.amount = updatedBill.amount;
            }

            if (updatedBill.date) {
                updatedBillData.date = updatedBill.date;
            }

            if (updatedBill.note) {
                updatedBillData.note = updatedBill.note;
            }

            let updateCommand = {
                $set: updatedBillData
            };

            return billCollection.updateOne({
                _id: id
            }, updateCommand).then((result) => {
                return this.getBillById(id);
            });
        });
    }
};

module.exports = exportedMethods;
