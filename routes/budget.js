const express = require('express');
const router = express.Router();
const budget = require("../data/budget");
const users = require("../data/users");


router.get('/:month/:year', function (req, res) {
    if(isNaN(req.params.month) || isNaN(req.params.year)){
        return res.redirect("/budget");
    }
    budget.getBudgetForMonth(req.user.username,parseInt(req.params.month)-1, parseInt(req.params.year))
        .then(b => {
            return users.getUserCategories(req.user.username).then(cat => {
                let thisMonth = new Date(parseInt(req.params.year), parseInt(req.params.month) - 1);
                let last = new Date(thisMonth);
                last.setMonth(last.getMonth() - 1);
                let next = new Date(thisMonth);
                next.setMonth(next.getMonth() + 1);
                res.render("layouts/budget", {
                    user: req.user,
                    budget: b,
                    categories: cat,
                    previous: (last.getMonth() + 1) + "/" + last.getFullYear(),
                    next: (next.getMonth() + 1) + "/" + next.getFullYear()
                });
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
    budget.addBudget(req.body.category, parseInt(req.body.amount), parseInt(my[0])-1, parseInt(my[1]), req.user.username)
        .then(b => {
            res.status(201).redirect(`/budget/${my[0]}/${my[1]}`);
        }, e => {
            res.sendStatus(500);
        });
});
module.exports = router;