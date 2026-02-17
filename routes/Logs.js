const express = require('express');
const router = express.Router();
const { Logs } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

const safeSum = async (field, date, UserId) => {
    return (await Logs.sum(field, { where: { date, UserId } })) ?? 0;
};

router.get("/totals", validateToken, async (req, res) => {
    try {
        const { date } = req.query;
        const UserId = req.user.id;

        const totals = {
            calories: await safeSum("calories", date, UserId),
            protein: await safeSum("protein", date, UserId),
            fat: await safeSum("fat", date, UserId),
            addedSugar: await safeSum("addedSugar", date, UserId),
            water: await safeSum("water", date, UserId)
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
        const UserId = req.user.id;
        entry.UserId = UserId;

        const log = await Logs.create(entry);
        const date = log.date;
    
        const totals = {
            calories: await safeSum("calories", date, UserId),
            protein: await safeSum("protein", date, UserId),
            fat: await safeSum("fat", date, UserId),
            addedSugar: await safeSum("addedSugar", date, UserId),
            water: await safeSum("water", date, UserId)
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
            where: { UserId: req.user.id },
            order: [["createdAt", "DESC"]]
        });

        if (!lastLog) {
            res.json({ error: "No logs to remove" });
            return;
        }

        const { date, UserId } = lastLog;

        await lastLog.destroy();

        const totals = {
            calories: await safeSum("calories", date, UserId),
            protein: await safeSum("protein", date, UserId),
            fat: await safeSum("fat", date, UserId),
            addedSugar: await safeSum("addedSugar", date, UserId),
            water: await safeSum("water", date, UserId)
        };

        res.status(200).json(totals);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

module.exports = router;