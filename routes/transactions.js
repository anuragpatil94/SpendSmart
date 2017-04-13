const express = require('express');
const router = express.Router();
const bills = require("../data/bills");

router.post("/", (req, res) => {
    let tx = {
        user: req.body.user,
        category: req.body.category,
        amount: req.body.amount,
        note: req.body.note,
        participants: req.body.participants
    };
    bills.addBill(tx).then(b => {
        res.sendStatus(201);
    }, e => {
        res.status(500).json({error: e})
    });
});

router.get("/", (req, res) => {
    bills.getBill(req.body.tx_id)
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
        note: req.body.note,
        participants: req.body.participants
    };
    bills.updateBill(req.body.tx_id, tx).then(b => {
        res.sendStatus(201);
    }, e => {
        res.status(500).json({error: e})
    });
});
module.exports = router;