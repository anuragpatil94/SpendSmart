const express = require('express');
const router = express.Router();
const bills = require("../data").bills;
const Enumerable = require("linq");
const users = require("../data/users");
router.post("/", (req, res) => {
    bills.addBill(req.body.category, parseInt(req.body.amount), new Date(Date.parse(req.body.date)), req.body.note, req.user.username)
        .then(b => {
        res.status(201).redirect("/expenses/"+(b.date.full.getMonth()+1)+"/"+b.date.full.getFullYear());
    }, e => {
        res.status(500).json({error: e});
    });
});
router.get("/:month/:year", (req, res) => {
    bills.getBillByMonth(req.user.username, req.params.month-1, parseInt(req.params.year))
        .then(b => {
            let g = Enumerable.from(b)
                .groupBy(b=>b.date.full.toDateString())
                .select(a=>{
                    let d=new Date(a.key());
                    return {
                        date:d.getDate(),
                        month:d.toLocaleString("en-us", {month:"long"}),
                        year:d.getFullYear(),
                        bills:a.toArray(),
                        total:0
                    };
                }).toArray();
                return users.getUserCategories(req.user.username).then(c=>{
                    let thisMonth = new Date(parseInt(req.params.year), parseInt(req.params.month)-1);
                    let last = new Date(thisMonth);
                    last.setMonth(last.getMonth()-1);
                    let next = new Date(thisMonth);
                    next.setMonth(next.getMonth()+1);
                    res.render("expenses/expenses", {user:req.user,groups:g,categories:c,
                         previous:(last.getMonth()+1)+"/"+last.getFullYear(), next:(next.getMonth()+1)+"/"+next.getFullYear()});
                });
            
        }, e => {
            res.status(404).render("expenses/expenses", {error:e});
        });
});
router.get("/", (req, res) => {
    let date = new Date();
    res.redirect("/expenses/"+(date.getMonth()+1)+"/"+date.getFullYear());
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
        res.status(500).json({error: e});
    });
});
module.exports = router;