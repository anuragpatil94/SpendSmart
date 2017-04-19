const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {

    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getUserById(id) {
        if (typeof id === "string") {
            id = ObjectId(id);
        }
        return users().then((userCollection) => {
            return userCollection.findOne({_id: id}).then((user) => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },
    getUserByUsername(username) {
        return users().then((userCollection) => {
            return userCollection.findOne({username: username})
                .then((user) => {
                    if (!user) throw "User not found";
                    return user;
                });
        });
    },
    getUserByEmail(email) {
        console.log('insideuser: ' + email);
        return users().then((userCollection) => {
            return userCollection.findOne({email: email})
                .then((user) => {
                    if (!user) throw "User not found";
                    return user;
                });
        });
    },
    getUserByToken(resetPasswordToken, resetPasswordExpires) {
        console.log('inside getToken: ' + resetPasswordToken);
        console.log('inside getToken: ' + resetPasswordExpires);
        return users().then((userCollection) => {
            return userCollection.findOne({
                resetPasswordToken: resetPasswordToken,
                resetPasswordExpires: {$gt: resetPasswordExpires}
            })
                .then((user) => {
                    if (!user) throw "User not found";
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
            let newUser = {
                _id: UserDetails.id,
                firstName: UserDetails.firstName,
                lastName: UserDetails.lastName,
                username: UserDetails.username,
                email: UserDetails.email,
                hashedPassword: UserDetails.hashedPassword,
                resetPasswordToken,
                resetPasswordExpires
                //UserDetails.hashedPassword
            };

            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
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

                let updatedUser = {};
                if (UpdatedInfo.firstName) {
                    updatedUser.firstName = UpdatedInfo.firstName;
                }
                if (UpdatedInfo.lastName) {
                    updatedUser.lastName = UpdatedInfo.lastName;
                }
                if (UpdatedInfo.email) {
                    updatedUser.email = UpdatedInfo.email;
                }
                if (UpdatedInfo.hashedPassword) {
                    updatedUser.hashedPassword = UpdatedInfo.hashedPassword;
                }
                if (UpdatedInfo.resetPasswordExpires) {
                    updatedUser.resetPasswordExpires = UpdatedInfo.resetPasswordExpires;
                }
                if (UpdatedInfo.resetPasswordToken) {
                    updatedUser.resetPasswordToken = UpdatedInfo.resetPasswordToken;
                }

                let updateCommand = {
                    $set: updatedUser
                };

                return userCollection.updateOne({_id: id}, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });
        });
    },
};

module.exports = exportedMethods;