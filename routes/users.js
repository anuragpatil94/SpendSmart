let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let userdata = require('../data/users');

/* GET users listing. */
router.get('/', function (req, res) {
    res.render("index", {title: "users Page"})
});

//Register
router.get('/register', function (req, res) {
    res.render('users/register', {title: "Spend Smart"});
});

// Login
router.get('/login', function (req, res) {
    res.render('users/login', {title: "Spend Smart"});
});
module.exports = router;
