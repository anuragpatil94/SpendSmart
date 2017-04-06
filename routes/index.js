const usersRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/users", usersRoutes);

    app.use("/index", (req, res) => {
        res.render("layouts/index", {title: "Spend Smart"})
    });
    app.use("/", (req, res) => {
        res.redirect("users/login");
    });

    app.use("*",
        (req, res) => {
            res.redirect("users/login");
        });
};

module.exports = constructorMethod;
