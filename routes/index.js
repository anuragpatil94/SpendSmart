const users = require("../data/users");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");
const txRoutes = require("./transactions");
const budgetRoutes = require("./budget");
const profileRoutes = require("./profile");
const dashboard = require("../data/index").getDashboardData;
const crypto = require("crypto");
const helper = require('sendgrid').mail;
const sg = require('sendgrid')('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');

let exportedMethods = {
    configRoutes(app) {
        app.get("/forgot", (req, res) => {
            let i = req.flash('info');
            let e = req.flash('error');
            res.render("users/forgot", {
                error: e,
                info: i
            });
        });
        app.get("/reset/:token", (req, res) => {
            let token = req.params.token;
            users.findByToken(token).then(u => {
                if (!u) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect("/forgot");
                }
                res.render("users/reset", {
                    user: u
                });
            });
        });
        app.get('/login', function (req, res) {
            if (req.isAuthenticated()) {
                res.redirect("/index");
                return;
            }
            res.render("users/login", {
                error: req.flash('error')
            });

        });
        app.get("/", (req, res, next) => {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect('/login');
            }
        });
        app.use("/profile", (req, res, next) => {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect('/login');
            }
        }, profileRoutes);
        app.use("/expenses", (req, res, next) => {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect('/login');
            }
        }, txRoutes);
        app.use("/budget", (req, res, next) => {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect('/login');
            }
        }, budgetRoutes);
        app.get("/index", (req, res) => {
            if (!req.isAuthenticated()) {
                res.redirect("/login");
                return;
            }
           
           dashboard(req.user._id).then(d=>{
               res.render("layouts/index", {
                user: req.user,
                data:d
            });
           });            
        });


        app.post('/login', passport.authenticate('local', {
            failureRedirect: "/login",
            successRedirect: '/index',
            failureFlash: true
        }));
        app.post("/logout", function (req, res) {
            req.logout();
            res.redirect('/login');
        });
        app.post("/register", function (req, res) {

            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();
            req.checkBody('username', 'Username is required').notEmpty();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

            let errors = req.validationErrors();

            if (errors) {
                let err = "";
                for (let x = 0; x < errors.length; x++) {
                    err += " * " + errors[x].msg;
                }

                res.location("back")
                    .render("users/login", {
                        error: err,
                        register: true,
                        email: req.body.email,
                        username: req.body.username,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword
                    });
                return;
            }
            users.addUser({
                id: req.body.username,
                hashedPassword: bcrypt.hashSync(req.body.password),
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }).then(u => {
                req.login(u, (err) => {
                    if (!err) {
                        res.redirect("/index");
                    } else {
                        res.location("back")
                            .render("users/login", {
                                error: err,
                                register: true,
                                email: req.body.email,
                                username: req.body.username,
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                password: req.body.password,
                                confirmPassword: req.body.confirmPassword
                            });
                    }
                });
            }, err => {
                res.location("back")
                    .render("users/login", {
                        error: err,
                        register: true,
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword
                    });
            });
        });

        app.post("/reset/:token", (req, res) => {
            let token = req.params.token;
            users.findByToken(token).then(u => {
                if (!u) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect("back");
                }
                u.hashedPassword = bcrypt.hashSync(req.body.password);
                u.resetPasswordToken = undefined;
                u.resetPasswordExpires = undefined;
                users.updateUser(u._id, u).then(u => {
                    req.login(u, err => {
                        if (!err) {
                            res.redirect("/index");
                            return;
                        }
                        req.flash('error', 'Failed to login. Please try again.');
                        res.redirect("/login");
                    });
                });
            });
        });
        app.post("/forgot", (req, res) => {
            let buf = crypto.randomBytes(20);
            let token = buf.toString("hex");
            return users.getUserByEmail(req.body.email)
                .then(u => {
                    if (!u) {
                        req.flash("error", "No account with that email address exists.");
                        return res.redirect("/forgot");
                    }
                    let resetInfo = {
                        resetPasswordToken: token,
                        resetPasswordExpires: Date.now() + 3600000
                    };

                    return users.updatePasswordResetInfo(u._id, resetInfo)
                        .then(u => {
                            let fromEmail = new helper.Email('passwordreset@spendsmart.com');
                            let toEmail = new helper.Email(u.email);
                            let subject = 'SpendSmart Password Reset';
                            let content = new helper.Content('text/plain', 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                'http://' + req.headers.host + '/reset/' + u.resetPasswordToken + '\n\n' +
                                'If you did not request this, please ignore this email and your password will remain unchanged.\n');
                            let mail = new helper.Mail(fromEmail, subject, toEmail, content);

                            var request = sg.emptyRequest({
                                method: 'POST',
                                path: '/v3/mail/send',
                                body: mail.toJSON()
                            });
                            sg.API(request, function (error, response) {
                                if (error) {
                                    req.flash('error', 'Failed to send email.');
                                }
                               else{
                                    req.flash('info', 'An e-mail has been sent to ' + u.email + ' with further instructions.');
                               }
                                res.redirect("/forgot");
                            });

                           
                        });
                });
        });

        app.use("*",
            (req, res) => {
                res.redirect("/index");
            });
    },
    configPassport(passport) {
        passport.use(new LocalStrategy(
            function (username, password, cb) {
                return users.getUserById(username)
                    .then(user => {
                        if (!user) {
                            return cb(null, false, {
                                message: 'Incorrect username or password.'
                            });
                        }
                        if (!bcrypt.compareSync(password, user.hashedPassword)) {
                            return cb(null, false, {
                                message: 'Incorrect username or password.'
                            });
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