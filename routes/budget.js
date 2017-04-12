const express = require('express');
const router = express.Router();
const budget = require("../data/budget");

router.get('/budget', function (req, res) {
    budget.getBudgetByUserId(req.username)
        .then(b => {
            res.json(b);
        }, e => {
            res.sendStatus(404);
        });
});
router.post("/budget", (req, res) => {
    budget.addBudget(req.category, req.amount, req.date, req.username)
        .then(b => {
            res.json(b);
        }, e => {
            res.sendStatus(500);
        });
});
module.exports = router;