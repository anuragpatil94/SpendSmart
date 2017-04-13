const connection = require("../config/mongoConnection");
const users = require("../data/users");
const bcrypt = require("bcrypt-nodejs");
const transactions = require("../data/bills");


transactions.getBillByUserId("psharm8")
    .then(b => {
        console.log(JSON.stringify(b, null, 4));
    }).then(() => {
    return transactions.getBillByCategory("psharm8", "food");
}).then(b => {
    console.log(JSON.stringify(b, null, 4));
}).then(() => {
    return transactions.getBillByMonth("psharm8", 2, 2017);
}).then(b => {
    console.log(JSON.stringify(b, null, 4));
});
// Test Transactions

//CREATE Transaction
//transactions.addTransaction(username,transactionDetails).then((res)=>{console.log("Transaction of user:"+username+"::"+JSON.stringify(res,null,4))})

//RETRIEVE transactions
//1. by id
//transactions.getTransactionById("58efac085042c63b50b8375e").then((res)=>{console.log("Transaction details by id are::" +JSON.stringify(res,null,4))})
//2. by username
//transactions.getTransactionByUserId(username).then((res)=>{console.log("Transaction details by username are::" +JSON.stringify(res,null,4))})
//3. by category name
//transactions.getTransactionByCategory(categoryName).then((res)=>{console.log("Transaction details by Category are::" +JSON.stringify(res,null,4))})
//4. by category month
//transactions.getTransactionByMonth("April").then((res)=>{console.log("Transaction details by Month are::" +JSON.stringify(res,null,4))})

//UPDATE transactions
//transactions.updateTransaction("58efac085042c63b50b8375e",updatedInfo).then((res)=>{console.log("Result of update request::" +JSON.stringify(res,null,4))})

//DELETE TRANSACTION
//transactions.removeTransaction("58efac085042c63b50b8375e").then((res)=>{console.log("Result of Delete request::" +JSON.stringify(res,null,4))})
