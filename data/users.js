const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;


let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";
                
                return user;
            });
        });
    },
    getAllUsers(){

        var item;
        let myCursor;
        return users().then((userCollection) => {


            return userCollection.find({}).toArray();


        } ,(err)=>{
            return Promise.reject("Error occurred while fetching all the users");
        })


    },
    addUser(UserDetails) {
        return users().then((userCollection) => {
            let newUser = {
                _id: UserDetails.id,
                email: UserDetails.email,
                password:UserDetails.password

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
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0)
                    throw (`Could not delete user with id of ${id}`)
                else
                    return (`Deleted user ${id} successfully`)

            });
        });
    },
    updateUser(id, UpdatedInfo) {
        return users().then((userCollection)=>{
            return this.getUserById(id).then((currentUser) => {
                let updatedUser = {
                    email: UpdatedInfo.email,
                    password:UpdatedInfo.password
                };

                let updateCommand = {
                    $set: updatedUser
                };

                return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });

        })
           },
  }

module.exports = exportedMethods;