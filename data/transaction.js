const mongoCollections = require("../config/mongoCollections");
const categories = mongoCollections.categories;
const transactions= mongoCollections.transactions;
const users = mongoCollections.users;
const uuid = require('node-uuid');
var ObjectId = require('mongodb').ObjectID;
let exportedMethods = {
    getTransactionByUserId(id) {
        return transactions().then((transactionCollection) => {
            return transactionCollection.find({ username: id }).toArray();
        } ,(err)=>{
            return Promise.reject("Error occurred while fetching all the transactions");
        })

    }
    ,
    getTransactionByMonth(Month) {
        return transactions().then((transactionCollection) => {
            return transactionCollection.find({ month: Month }).toArray();
        } ,(err)=>{
            return Promise.reject("Error occurred while fetching all the transactions");
        })

    }
    ,
    getTransactionById(id){
        id=ObjectId(id);
    return transactions().then((transactionCollection) => {
        return transactionCollection.findOne({ _id: id }).then((transaction) => {
            if (!transaction) throw "Transaction not found";
            return transaction;
        });

    } );
},
    getAllTransactions(){
        return transactions().then((transactionCollection) => {
            return transactionCollection.find({}).toArray();
        } ,(err)=>{
            return Promise.reject("Error occurred while fetching all the transactions");
        })
    },
    getTransactionByCategory(CategoryName){
        return transactions().then((transactionCollection) => {
            return transactionCollection.find({ category : CategoryName }).toArray();
        } ,(err)=>{
            return Promise.reject(`Error occurred while fetching all the transactions for category : ${CategoryName}`);
        })
    },

    addTransaction(username, TransactionDetails) {
        return transactions().then((transactionCollection)=>{

        let newTransaction = {
                    CategoryId:username+"_"+TransactionDetails.category, //not really sure if we need it .I can remove it if not needed
                    category : TransactionDetails.category,
                    username :username,
                   _id: ObjectId(),
                    amount: TransactionDetails.amount,
                    date: TransactionDetails.date,
                    note: TransactionDetails.note,
                    month : TransactionDetails.month
                }
            return transactionCollection.insertOne(newTransaction).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getTransactionByUserId(username);
        });



           });
    },

    removeTransaction(id) {
        return transactions().then((transactionCollection) => {
            let ObId= ObjectId(id);
            return transactionCollection.removeOne({_id: ObId }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0)
                    throw (`Could not delete transaction with id of ${id}`)
                else
                    return (`Deleted transaction ${id} successfully`)

            });
        });

    },


    updateTransaction(id, UpdatedInfo) {
      let  Obid=ObjectId(id);
        return transactions().then((transactionCollection)=>{
            return this.getTransactionById(id).then((currentTransaction) => {

                let updatedTransaction = {
                    amount: UpdatedInfo.amount,
                    date: UpdatedInfo.date,
                    note: UpdatedInfo.note,
                    month : UpdatedInfo.month
                };

                let updateCommand = {
                    $set: updatedTransaction
                };

                return transactionCollection.updateOne({ _id: Obid }, updateCommand).then((res) => {

                    return this.getTransactionById(id);
                });
            });

        })
    }
}

module.exports = exportedMethods;