const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const categories = mongoCollections.categories;
let exportedMethods = {

    defaultCategories() {
        return ["Bills and Utilities", "Education", "Entertainment", "Family", "Fees and Charges", "Food and Beverage", "Gifts and Donations", "Health and Fitness", "Insurances", "Investment", "Shopping", "Transportation", "Travels", "General"];
    },
    getUserByEmail(email) {
        return users().then((userCollection) => {
            return userCollection.findOne({
                email: email
            }).then((user) => {
                //if (!user) throw "User not found";
                if (!user.fullname) {
                    user.fullname = user.firstname + " " + user.lastname;
                }

                return user;
            });
        });
    },
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({
                _id: id
            }).then((user) => {
                //if (!user) throw "User not found";
                if (!user.fullname) {
                    user.fullname = user.firstname + " " + user.lastname;
                }

                return user;
            });
        });
    },
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        }, (err) => {
            return Promise.reject("Error occurred while fetching all the users");
        });
    },
    getUserCategories(userId) {
        return categories().then(catCol => {
            return catCol.findOne({
                _id: userId
            }).then(c => {
                if (!c) {
                    return this.defaultCategories();
                }
                return c.categories;
            });
        });

    },
    addUser(UserDetails) {
        return users().then((userCollection) => {
            return userCollection.findOne({
                _id: UserDetails.id
            }).then(u => {
                if (!u) {
                    let newUser = {
                        _id: UserDetails.id,
                        firstname: UserDetails.firstname,
                        lastname: UserDetails.lastname,
                        username: UserDetails.id,
                        email: UserDetails.email,
                        hashedPassword: UserDetails.hashedPassword
                    };

                    return userCollection.insertOne(newUser).then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return categories().then(catCol => {
                            let cat = this.defaultCategories();
                            let userCat = {
                                _id: newId,
                                categories: cat
                            };
                            return catCol.insertOne(userCat).then((newInsertInformation) => {
                                return newInsertInformation.insertedId;
                            });
                        });
                    }).then((newId) => {
                        return this.getUserById(newId);
                    });
                } else {
                    throw "User with same Username already exists.";
                }
            });
        });
    },
    removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({
                _id: id
            }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0)
                    throw (`Could not delete user with id of ${id}`);
                else
                    return (`Deleted user ${id} successfully`);
            });
        });
    },
    updatePasswordResetInfo(id, resetInfo) {
        return users().then((userCollection) => {
            return this.getUserById(id).then((currentUser) => {
                let updatedUser = {
                    resetPasswordToken: resetInfo.resetPasswordToken,
                    resetPasswordExpires: resetInfo.resetPasswordExpires
                };

                let updateCommand = {
                    $set: updatedUser
                };

                return userCollection.updateOne({
                    _id: id
                }, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });
        });
    },
    findByToken(token) {
        return users().then((userCollection) => {
            return userCollection.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            });
        });
    },
    updateUser(id, UpdatedInfo) {
        return users().then((userCollection) => {
            return this.getUserById(id).then((currentUser) => {
                let updatedUser = {
                    firstname: UpdatedInfo.firstname,
                    lastname: UpdatedInfo.lastname,
                    email: UpdatedInfo.email,
                    hashedPassword: UpdatedInfo.hashedPassword,
                    resetPasswordToken: UpdatedInfo.resetPasswordToken,
                    resetPasswordExpires: UpdatedInfo.resetPasswordExpires
                };

                let updateCommand = {
                    $set: updatedUser
                };

                return userCollection.updateOne({
                    _id: id
                }, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });
        });
    }
};

module.exports = exportedMethods;