const users = require("../data/users");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");
const txRoutes = require("./transactions");
const budgetRoutes = require("./budget");
const profileRoutes = require("./profile");

let exportedMethods = {
    configRoutes(app) {
        app.get('/login', function (req, res) {
            if (req.isAuthenticated()) {
                res.redirect("/index");
                return;
            }
            res.render("users/login", {
                error: req.flash('error')
            });

        });
        app.get("/", (req, res, next)=>{
            if(req.isAuthenticated()){
                next();
            } else{
                res.redirect('/login');
            }
        });
 app.use("/profile",(req, res, next)=>{
            if(req.isAuthenticated()){
                next();
            } else{
                res.redirect('/login');
            }
        }, profileRoutes);
        app.use("/expenses",(req, res, next)=>{
            if(req.isAuthenticated()){
                next();
            } else{
                res.redirect('/login');
            }
        }, txRoutes);
        app.use("/budget",(req, res, next)=>{
            if(req.isAuthenticated()){
                next();
            } else{
                res.redirect('/login');
            }
        }, budgetRoutes);
        app.get("/index", (req, res) => {
            if (!req.isAuthenticated()) {
                res.redirect("/login");
                return;
            }
            res.render("layouts/index", {
                user: req.user
            });
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

            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();
            req.checkBody('username', 'Username is required').notEmpty();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

            let errors = req.validationErrors();

            if (errors) {
                let err="";
                for(let x=0;x<errors.length;x++){
                    err+=" * "+ errors[x].msg;
                }
                //err = err.substr(0, err.length-1);

                res.location("back")
                    .render("users/login", {
                        error: err,
                        register: true,
                        email: req.body.email,
                        username: req.body.username,
                        firstname:req.body.firstname,
                        lastname:req.body.lastname,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword
                    });
                    return;
            }
            users.addUser({
                id: req.body.username,
                hashedPassword: bcrypt.hashSync(req.body.password),
                email: req.body.email, 
                firstname:req.body.firstname,
                lastname:req.body.lastname
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
                                firstname:req.body.firstname,
                                lastname:req.body.lastname,
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