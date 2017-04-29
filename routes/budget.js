const express = require('express');
const router = express.Router();
const budget = require("../data/budget");
const users = require("../data/users");
router.get('/', function (req, res) {
    budget.getBudgetByUserId(req.user.username)
        .then(b => {
            return users.getUserCategories(req.user.username).then(cat => {
                res.render("budget/budget", { user: req.user, budget: b, categories: cat });
            });

        }, e => {
            res.sendStatus(404);
        });
});
router.post("/", (req, res) => {
    budget.addBudget(req.body.category, parseInt(req.body.amount), req.body.monthYear, req.user.username)
        .then(b => {
            res.redirect("/", 201);
        }, e => {
            res.sendStatus(500);
        });
});
module.exports = router;