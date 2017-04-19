const users = require("../data/users");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const async = require('async');
const flash = require('express-flash');
let exportedMethods = {
        configRoutes(app){
            app.use("/index", (req, res) => {
                if (!req.isAuthenticated()) {
                    res.redirect("/login");
                    return;
                }
                res.render("layouts/index", {user: req.user});
            });
            //LOGIN
            app.get('/login', function (req, res) {
                if (req.isAuthenticated()) {
                    res.redirect("/index");
                    return;
                }
                res.render("users/login", {error: req.flash('error'), register: true});
            });
            app.post('/login', passport.authenticate('local', {
                failureRedirect: "/login",
                successRedirect: '/index',
                failureFlash: true
            }));
            //REGISTER
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
                    }
                }
            );
            //FORGOT PASSWORD
            app.get('/forgot', function (req, res) {
                res.render('users/forgot', {
                    user: req.user
                });
            });
            app.post('/forgot', function (req, res, next) {
                async.waterfall([
                    function (done) {
                        crypto.randomBytes(20, function (err, buf) {
                            let token = buf.toString('hex');
                            done(err, token);
                        });
                    },
                    function (token, done) {

                        users.getUserByEmail(req.body.email).then((user, err) => {

                            if (!user) {
                                req.flash('error', 'No account with that email address exists.');
                                return res.redirect('/forgot');
                            }

                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                            users.updateUser(user._id, user).then(() => {

                                done(err, token, user);

                            });
                        });
                    },
                    function (token, user, done) {

                        let smtpTransport = nodemailer.createTransport({

                            service: 'Gmail',
                            auth: {
                                user: '',//ENTER EMAIL ID
                                pass: '' //ENTER PASSWORD
                            }
                        });
                        let mailOptions = {
                            to: user.email,
                            from: 'admin@spendsmart.com',
                            subject: 'Node.js Password Reset',
                            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                            done(err, 'done');
                        });
                    }
                ], function (err) {
                    if (err) return next("The error is: " + err);
                    res.redirect('/forgot');
                });
            });
            //RESET PASSWORD
            app.get('/reset/:token', function (req, res) {
                users.getUserByToken(
                    req.params.token,
                    Date.now()
                ).then((user) => {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('/forgot');
                    }
                    res.render('users/reset', {
                        user: req.user
                    });
                });
            });
            app.post('/reset/:token', function (req, res) {


                async.waterfall([
                    function (done) {

                        users.getUserByToken(
                            req.params.token,
                            Date.now()
                        ).then((user, err) => {

                            if (!user) {
                                req.flash('error', 'Password reset token is invalid or has expired.');
                                return res.redirect('back');
                            }

                            user.hashedPassword = bcrypt.hashSync(req.body.password);
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            users.updateUser(user._id, user).then(() => {

                                done(err, user);

                            });
                        });
                    },
                    function (user, done) {
                        let smtpTransport = nodemailer.createTransport({

                            service: 'Gmail',
                            auth: {
                                user: '',//ENTER EMAIL ID
                                pass: '' //ENTER PASSWORD
                            }
                        });
                        let mailOptions = {
                            to: user.email,
                            from: 'admin@spendsmart.com',
                            subject: 'Your password has been changed',
                            text: 'Hello,\n\n' +
                            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            req.flash('success', 'Success! Your password has been changed.');
                            done(err);
                        });
                    }
                ], function () {
                    res.redirect('/');
                });

            });
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
