const express = require('express');
const router = express.Router();
const budget = require("../data/budget");

router.get('/', function (req, res) {
    budget.getBudgetByUserId(req.user.username)
        .then(b => {
            res.render("budget/budget",{user:req.user,budget:b});
        }, e => {
            res.sendStatus(404);
        });
});
router.post("/", (req, res) => {
    budget.addBudget(req.body.category, parseInt(req.body.amount), req.body.monthYear, req.user.username)
        .then(b => {
            res.redirect("/",201);
        }, e => {
            res.sendStatus(500);
        });
});
module.exports = router;