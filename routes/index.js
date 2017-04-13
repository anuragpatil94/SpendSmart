const users = require("../data/users");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");
const txRoutes = require("./transactions");
let exportedMethods = {
    configRoutes(app){
        app.use("*", (req, res, next) => {
            if (!req.isAuthenticated()) {
                res.redirect("/login");
                return;
            }
            next();
        });
        app.use("/bill", txRoutes);
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
                return users.getUserByUsername(username)
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
