const express = require('express');
const router = express.Router();
const users = require("../data/users");
const bcrypt = require("bcrypt-nodejs");

router.get('/', function (req, res) { 
    res.render("profile/profile", {user: req.user});
});
router.post("/", (req, res)=>{
    let updates={
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(req.body.password)
    };
    return users.updateUser(req.user.username, updates).then(u=>{
        res.render("profile/profile",{user:u, msg:"Details updated."});
    }, err=>{
        res.render("profile/profile",{user:req.user, error:err});
    });
});
module.exports = router;