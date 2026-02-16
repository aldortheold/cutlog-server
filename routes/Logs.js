const express = require('express');
const router = express.Router();
const { Logs } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

const safeSum = async (field, date, userId) => {
    return (await Logs.sum(field, { where: { date, userId } })) ?? 0;
};

router.get("/totals", validateToken, async (req, res) => {
    try {
        const { date } = req.query;
        const userId = req.user.id;

        const totals = {
            calories: await safeSum("calories", date, userId),
            protein: await safeSum("protein", date, userId),
            fat: await safeSum("fat", date, userId),
            addedSugar: await safeSum("addedSugar", date, userId),
            water: await safeSum("water", date, userId)
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
        const entry = req.body;
        const userId = req.user.id;
        entry.userId = userId;

        const log = await Logs.create(entry);
        const date = log.date;
    
        const totals = {
            calories: await safeSum("calories", date, userId),
            protein: await safeSum("protein", date, userId),
            fat: await safeSum("fat", date, userId),
            addedSugar: await safeSum("addedSugar", date, userId),
            water: await safeSum("water", date, userId)
        };

        res.status(201).json({ log: log, totals: totals });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create log" });
    }
});

router.delete("/undo", validateToken, async (req, res) => {
    try {
        const lastLog = await Logs.findOne({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]]
        });

        if (!lastLog) {
            res.json({ error: "No logs to remove" });
            return;
        }

        const { date, userId } = lastLog;

        await lastLog.destroy();

        const totals = {
            calories: await safeSum("calories", date, userId),
            protein: await safeSum("protein", date, userId),
            fat: await safeSum("fat", date, userId),
            addedSugar: await safeSum("addedSugar", date, userId),
            water: await safeSum("water", date, userId)
        };

        res.status(200).json(totals);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

module.exports = router;