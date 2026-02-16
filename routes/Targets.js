const express = require('express');
const router = express.Router();
const { Targets } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/fetch", validateToken, async (req, res) => {
    const target = await Targets.findOne({
        where: { UserId: req.user.id }
    });

    if (!target) {
        res.json({ calories: "", protein: "", fat: "", addedSugar: "", water: "" });
        return;
    }

    res.json(target);
});

router.post("/update", validateToken, async (req, res) => {

    const { calories, protein, fat, addedSugar, water } = req.body;

    let target = await Targets.findOne({ where: { UserId: req.user.id } });

    if (target) {
        await target.update({ calories, protein, fat, addedSugar, water });
    }
    else {
        target = await Targets.create({ calories, protein, fat, addedSugar, water, UserId: req.user.id });
    }

    res.json(target);
});

module.exports = router;