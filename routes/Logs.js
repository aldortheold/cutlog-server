const express = require('express');
const router = express.Router();
const { Logs } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

const safeSum = async (field, date) => {
    return (await Logs.sum(field, { where: { date } })) ?? 0;
};

router.get("/totals", validateToken, async (req, res) => {
    try {
        const { date } = req.query;

        const totals = {
            calories: await safeSum("calories", date),
            protein: await safeSum("protein", date),
            fat: await safeSum("fat", date),
            addedSugar: await safeSum("addedSugar", date),
            water: await safeSum("water", date)
        };

        res.json(totals);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch totals" });
    }
});

router.post("/create", validateToken, async (req, res) => {
    try {
        const log = await Logs.create(req.body);
        const date = log.date;
        const totals = {
            calories: await Logs.sum("calories", { where: { date: date } }),
            protein: await Logs.sum("protein", { where: { date: date } }),
            fat: await Logs.sum("fat", { where: { date: date } }),
            addedSugar: await Logs.sum("addedSugar", { where: { date: date } }),
            water: parseFloat(await Logs.sum("water", { where: { date: date } }))
        };
        res.status(201).json({ log: log, totals: totals });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create log" });
    }
});

module.exports = router;