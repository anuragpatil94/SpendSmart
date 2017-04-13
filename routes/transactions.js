const express = require('express');
const router = express.Router();
const bills = require("../data").bills;

router.post("/", (req, res) => {
    bills.addBill(req.body.category, req.body.amount, req.body.date, req.body.note, req.body.user.username)
        .then(b => {
        res.sendStatus(201);
    }, e => {
        res.status(500).json({error: e})
    });
});

router.get("/", (req, res) => {
    bills.getBillByUserId(req.body.user.username)
        .then(b => {
            res.json(b);
        }, e => {
            res.status(404).json({error: e})
        });
});
router.post("/update", (req, res) => {
    let tx = {
        user: req.body.user,
        category: req.body.category,
        amount: req.body.amount,
        note: req.body.note
    };
    bills.updateBill(req.body.tx_id, tx).then(b => {
        res.sendStatus(201);
    }, e => {
        res.status(500).json({error: e})
    });
});
module.exports = router;