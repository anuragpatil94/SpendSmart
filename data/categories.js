const mongoCollections = require("../config/mongoCollections");
const categories = mongoCollections.categories;
const transactions= mongoCollections.transactions;
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
       getcategoriesByUserId(id) {
           return users().then((userCollection) => {
               return userCollection.findOne({ _id: id }).then((user) => {
                   if (!user) throw "User not found";

                   return user.categories;
               });
           });
    },

    addcategoriesToUser(username, CategoryDetails) {
        return users().then((userCollection)=> {
            let newCategory = {
                _id: username+"_"+CategoryDetails.name,
                category: CategoryDetails.name,
               subCategory: CategoryDetails.subCategory
            };

            let updateCommand = {
                $addToSet: {'categories': newCategory}
            };

            return userCollection.update({_id: username}, updateCommand).then((result) => {
              //  console.log("Result::" + result);
                if(result.nModified===0)
                    throw (`Could not append category ${CategoryDetails.name} to user of ${username}`)
                else {
                    return (`Added category ${CategoryDetails.name} successfully`)
                }
            }, (err) => {
                return Promise.reject("Error occurred in adding the category to the user");
            });
        });
    },

    removecategoriesFromUser(id) {
        return users().then((userCollection)=> {
            return userCollection.update({'categories._id':id},{$pull : {'categories':{'_id':id}}}).then((res) => {
              //  console.log(res)
                return "Deleted Successfully";
            },(err)=>{
                return Promise.reject("Error occurred");
            })
        });
    },

//Here if category is changed then we need to change id as well. That pat is not done.
    updatecategories(Username, UpdatedInfo,CategoryId) {
        return users().then((userCollection)=> {
                    //   let NewCategory = UpdatedInfo.name;
                return userCollection.update({_id: Username, categories : {$elemMatch : { _id: CategoryId}} },{$set : { 'categories.$.category' : UpdatedInfo}}).then((result) => {
                    return this.getUserById(Username);
                },(err)=>{
                    return Promise.reject("Error occurred while updating the entry");
                })

        })
    },
}

module.exports = exportedMethods;