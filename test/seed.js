const connection = require("../config/mongoConnection");
const users = require("../data/users");
const bcrypt = require("bcrypt-nodejs");
const categories=require("../data/categories")
const transactions= require("../data/transaction");
let username="yesha2";
let categoryDetails={
    name: "myfood1"
}
let categoryName=categoryDetails.name;
let transactionDetails ={
    category: "myfood1",
    amount : "30",
    date :"4/12/2017",
    note: "tea",
    month : "April"
}
let userDetails= {};
    userDetails.id =username,
    userDetails.username =username,
    userDetails.email = "yesha11@gmail.com",
    userDetails.hashedPassword = bcrypt.hashSync("1234");
let updatedInfo= {
    categoty : "myfood1",
    amount: "50",
    note: "frappe",
    date: "5/12/2017",
    month: "May"
}
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
