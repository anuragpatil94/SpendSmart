const usersRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/users", usersRoutes);

    app.use("/", (req, res) => {
        res.render("layouts/index", {title: "Spend Smart"});
    });

    app.use("*",
        (req, res) => {
            res.redirect("/");
        });
};

module.exports = constructorMethod;
