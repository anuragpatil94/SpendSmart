const usersRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/users", usersRoutes);
    app.use("*", (req, res) => {
        if (!res)  res.sendStatus(404);
        else{
            res.render("index",{title:"Index Page"})
        }
    });
};

module.exports = constructorMethod;
