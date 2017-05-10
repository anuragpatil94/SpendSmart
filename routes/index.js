const users = require("../data/users");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");
const txRoutes = require("./transactions");
const budgetRoutes=require("./budget");

let exportedMethods = {
    configRoutes(app){

        app.use("/expenses", txRoutes);
        app.use("/budget", budgetRoutes);
        app.get("/index", (req, res) => {
            if (!req.isAuthenticated()) {
                res.redirect("/login");
                return;
            }
            res.render("layouts/index", {user: req.user});
        });

        app.get('/login', function (req, res) {
            if (req.isAuthenticated()) {
                res.redirect("/index");
                return;
            }
            res.render("users/login", {error: req.flash('error')});

        });
        app.post('/login', passport.authenticate('local', {
            failureRedirect: "/login",
            successRedirect: '/index',
            failureFlash: true
        }));
        app.post("/logout", function (req, res) {
            req.logout();
            res.redirect('/');
        });
        app.post("/register", function (req, res) {
            users.addUser({
                id: req.body.username,
                hashedPassword: bcrypt.hashSync(req.body.password),
                email: req.body.email
            }).then(u => {
                req.login(u, (err) => {
                    if (!err) {
                        res.redirect("/index");
                    }
                    else {
                        res.location("back")
                            .render("users/login", {
                            error: err,
                            register: true,
                            email: req.body.email,
                            username: req.body.username,
                            password: req.body.password,
                            confirmPassword:req.body.confirmPassword
                        });
                    }
                });
            }, err => {
                res.render("users/login", {
                    error: err,
                    register: true,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    confirmPassword:req.body.confirmPassword
                });
            });
        });
        app.use("/", (req, res) => {
            res.redirect("/index");
        });
        app.use("*",
            (req, res) => {
                res.redirect("/");
            });
    },
    configPassport(passport) {
        passport.use(new LocalStrategy(
            function (username, password, cb) {
                return users.getUserById(username)
                    .then(user => {
                        if (!user) {
                            return cb(null, false, {message: 'Incorrect username.'});
                        }
                        if (!bcrypt.compareSync(password, user.hashedPassword)) {
                            return cb(null, false, {message: 'Incorrect password.'});
                        }
                        return cb(null, user);
                    }).catch(err => {
                        return cb(err);
                    });
            }));

        passport.serializeUser(function (user, cb) {
            cb(null, user._id);
        });

        passport.deserializeUser(function (id, cb) {
            users.getUserById(id)
                .then(user => {
                    cb(null, user);
                }, err => {
                    cb(err);
                });
        });
    }
};

module.exports = exportedMethods;
