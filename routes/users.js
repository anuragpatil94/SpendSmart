const express = require('express');
const router = express.Router();
const users = require("../data/users");
const passport = require("passport");

router.get('/login', function (req, res) {
    res.render("users/login", {title: "Spend Smart", error: req.flash('error')});
});
router.post('/login', passport.authenticate('local', {
    failureRedirect: "/login",
    successRedirect: '/index',
    failureFlash: true
}));
module.exports = router;
