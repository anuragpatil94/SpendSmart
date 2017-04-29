const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let exportedMethods = {

    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({_id: id}).then((user) => {
                //if (!user) throw "User not found";

                return user;
            });
        });
    },
    getAllUsers(){
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        }, (err) => {
            return Promise.reject("Error occurred while fetching all the users");
        });
    },
    addUser(UserDetails) {
        return users().then((userCollection) => {
            return userCollection.findOne({_id: UserDetails.id}).then(u=>{
                if(!u){
                    let newUser = {
                        _id: UserDetails.id,
                        username: UserDetails.id,
                        email: UserDetails.email,
                        hashedPassword: UserDetails.hashedPassword,
                        categories: [],
                    };

                    return userCollection.insertOne(newUser).then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return this.getUserById(newId);
                    });
                } else{
                    throw "User with same Username already exists.";
                }
            });
        });
    },
    removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({_id: id}).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0)
                    throw (`Could not delete user with id of ${id}`);
                else
                    return (`Deleted user ${id} successfully`);
            });
        });
    },

    updateUser(id, UpdatedInfo) {
        return users().then((userCollection) => {
            return this.getUserById(id).then((currentUser) => {
                let updatedUser = {
                    username: UpdatedInfo.username,
                    email: UpdatedInfo.email,
                    hashedPassword: UpdatedInfo.hashedPassword,
                    categories: UpdatedInfo.categories
                };

                let updateCommand = {
                    $set: updatedUser
                };

                return userCollection.updateOne({_id: id}, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });
        });
    }
};

module.exports = exportedMethods;