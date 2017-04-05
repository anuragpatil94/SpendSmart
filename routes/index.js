const usersRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/users", usersRoutes);

    app.use("/", (req, res) => {
        res.render("users/login", {title: "Spend Smart"});
    });

    app.use("*",
        (req, res) => {
            res.redirect("users/login");
        });
};

module.exports = constructorMethod;
