const connection = require("../config/mongoConnection");
const users = require("../data/users");
const bcrypt = require("bcrypt-nodejs");
const transactions = require("../data/bills");
const Enumerable = require("linq");
const budget=require("../data/budget");
const mongoCollections = require("../config/mongoCollections");

// budget.getBudgetForMonth("test", 5, 2017).then(b=>{
//     b.forEach(x=>console.log(JSON.stringify(x,null,4)));
// });

// transactions.getAllBills().then(b=>{
//    b.forEach(x=>console.log(JSON.stringify(x.date.full.toDateString(),null,4)));
// });
let d = new Date(2017,4);
console.log(d.toDateString());
// users.getAllUsers().then(u=>{
//     u.forEach(x=>users.removeUser(x._id));
// });


// transactions.addBill("Transportation", 15, new Date(), "Bus Tickets", "test");
// transactions.getBillByUserId("test")
//     .then(b => {
//         let g = Enumerable.from(b)
//             .groupBy(b=>b.date.full.toDateString())
//             .select(a=>{
//                 let d=new Date(a.key());
//                 return {
//                     date:d.getDate(),
//                     month:d.toLocaleString("en-us", {month:"long"}),
//                     year:d.getFullYear(),
//                     bills:a.toArray()
//                 };
//             })
//             .toArray();
//         console.log(JSON.stringify(g, null, 4));
//     });

// transactions.getBillByUserId("psharm8")
//     .then(b => {
//         console.log(JSON.stringify(b, null, 4));
//     }).then(() => {
//     return transactions.getBillByCategory("psharm8", "food");
// }).then(b => {
//     console.log(JSON.stringify(b, null, 4));
// }).then(() => {
//     return transactions.getBillByMonth("psharm8", 2, 2017);
// }).then(b => {
//     console.log(JSON.stringify(b, null, 4));
// });
