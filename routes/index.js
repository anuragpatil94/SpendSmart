const users = require("../data/users");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");

let exportedMethods = {
        configRoutes(app){
            app.use("/index", (req, res) => {
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

                res.render("users/login", {error: req.flash('error'), register: true});

            });
            app.post('/register', function (req, res) {

                    let firstName = req.body.first_name;
                    let lastName = req.body.last_name;
                    let username = req.body.username;
                    let password = req.body.password;
                    let email = req.body.email;
                    let confirm_password = req.body.confirm_password;
                    firstName = firstName.toLowerCase();
                    lastName = lastName.toLowerCase();
                    username = username.toLowerCase();
                    email = email.toLowerCase();
                    req.sanitize('username').trim();
                    req.checkBody('email', 'Email is required').notEmpty();
                    req.checkBody('email', 'Email is not valid').isEmail();
                    req.checkBody('username', 'Username is required').notEmpty();
                    req.checkBody('password', 'Password is required').notEmpty();
                    req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);

                    let errors = req.validationErrors();

                    if (errors) {
                        res.render('users/login', {error: errors, register: true});

                    }
                    else {
                        let newUser = {
                            firstName: firstName,
                            lastName: lastName,
                            username: username,
                            hashedPassword: bcrypt.hashSync(password),
                            email: email

                        };
                        users.addUser(newUser).then(() => {

                            res.redirect('/users/login');
                        }).catch(() => {
                            res.status(500).json({error: "User Not Stored"});
                        });
                        //}
                    }

                }
            );

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
        configPassport(passport)
        {
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
    }
;

module.exports = exportedMethods;
