const express = require('express');
const router = express.Router();
const budget = require("../data/budget");
const users = require("../data/users");


router.get('/:month/:year', function (req, res) {
    budget.getBudgetByUserId(req.user.username)
        .then(b => {
            return users.getUserCategories(req.user.username).then(cat => {
                res.render("budget/budget", { user: req.user, budget: b, categories: cat });
            });

        }, e => {
            res.sendStatus(404);
        });
});

router.get('/', function (req, res) {
    let date = new Date();
    res.redirect("/budget/" + (date.getMonth() + 1) + "/" + date.getFullYear());
});
router.post("/", (req, res) => {
    let my = req.body.monthYear.split("/");
    budget.addBudget(req.body.category, parseInt(req.body.amount), my[0], my[1], req.user.username)
        .then(b => {
            res.status(201).redirect(`/budget/${my[0]}/${my[1]}`);
        }, e => {
            res.sendStatus(500);
        });
});
module.exports = router;