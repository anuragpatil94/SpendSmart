const connection = require("../config/mongoConnection");
const users = require("../data/users");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("node-uuid");
let userDetails = {
    _id: uuid.v4(),
    username: "psharm8",
    email: "psharm8@gmail.com"
};
userDetails.hashedPassword = bcrypt.hashSync("1234");
users.getAllUsers().then(user => {
    user.forEach(u => {
        console.log(JSON.stringify(u, null, 4));
        // users.removeUser(u._id).then(()=>{
        //     console.log(`removed user ${u._id}`);
        // });
    })
});
//Create the user
// let getUser = users.addUser(userDetails);
// getUser.then((u) => {
//     console.log("Newly added user details :\n" + JSON.stringify(u,null,4));
//     return u;
// }).then(un=>{
//     return users.getUserById(un._id).then(u=>{
//         console.log(JSON.stringify(u,null,4));
//     })
// }).catch((e) => {
//     console.log("ERROR Cooured while adding a user:" + e);
// });
users.getUserById("58e775ad6a3c3744d8d11713").then(u => {
    console.log(JSON.stringify(u, null, 4));
});