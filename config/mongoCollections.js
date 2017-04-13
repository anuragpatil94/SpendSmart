const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
let getCollectionFn = (collection) => {
    let col = undefined;

    return () => {
        if (!col) {
            col = dbConnection().then(db => {
                return db.collection(collection);
            });
        }

        return col;
    }
};

/* Now, you can list your collections here: */
module.exports = {
    users: getCollectionFn("users"),
    transactions: getCollectionFn("transactions"),
    budget:getCollectionFn("budget"),

};

