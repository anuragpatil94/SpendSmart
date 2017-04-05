

const connection = require("../config/mongoConnection");
const users = require("../data/users");
//const comments= require("../data/comments")

let userDetails= {
    id :"yesha111",
    email : "yesha11@gmail.com",
   password : "webProgrammin"
}
///*
//Create the user
let getUser = users.addUser(userDetails);
getUser.then((tasks)=> {

    console.log("Newly added user details ::\n" + JSON.stringify(tasks));
}).catch((e)=>{
        console.log("ERROR Cooured while adding a user:"+e);
});
 //*/
// MOdiy User
let updatedUser= {};
updatedUser.email="abc@gmail.com";
updatedUser.password= "xyzaaa"

let getUpdateUser= users.updateUser("yesha123",updatedUser);
getUpdateUser.then((tasks)=> {

    console.log("Updated the user ::\n" + JSON.stringify(tasks));
}).catch((e)=>{
    console.log("ERROR Cooured while updating a user:"+e);
});


//Remove a User
let removedUser= users.removeUser("yesha123");
removedUser.then((result)=> {

    console.log("Remove result ::\n" + JSON.stringify(result));
}).catch((e)=>{
    console.log("ERROR Cooured while updating a user:"+e);
});

//get user
let getUserDetails= users.getUserById("yesha123");
getUserDetails.then((user)=>{

    console.log("User Info::\n" + JSON.stringify(user));
}).catch((e)=>{
    console.log("ERROR Cooured while retrieving a user:"+e);
});

//get all the users
let getAllUsers=users.getAllUsers();
getAllUsers.then((userList)=>{

    console.log("UserList::\n" + JSON.stringify(userList));
}).catch((e)=>{
    console.log("ERROR Cooured while retrieving Users:"+e);
});
