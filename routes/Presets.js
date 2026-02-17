const express = require('express');
const router = express.Router();
const { Presets } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/all", async (req, res) => {
    const presetList = await Presets.findAll();
    res.json(presetList);
});

router.get("/byUser/:id", async (req, res) => {
    const presetList = await Presets.findAll(
        { where: { UserId: req.params.id } }
    );
    res.json(presetList);
})

router.post("/create", validateToken, async (req, res) => {
    try {
        const preset = req.body;
        const UserId = req.user.id;
        preset.UserId = UserId;
    
        const found = await Presets.findOne({
            where: { name: preset.name, UserId: UserId }
        });
    
        if (!found) {
            await Presets.create(preset);
            res.json(preset);
        }
        else {
            res.json({ error: "Name already in use" });
        }
    }
    catch (err) {
        console.error(err);
        res.json({ error: "Failed to create a preset" });
    }
});

router.put("/rename", validateToken, async (req, res) => {
    try {
        const { name, id } = req.body;
        await Presets.update({ name: name }, { where: { id: id } });
        res.json(name);
    }
    catch (err) {
        console.error(err);
        res.json({ error: "Failed to rename preset" });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    try {
        await Presets.destroy({ where: { id: req.params.id } });
        res.json(req.params.id);
    }
    catch (err) {
        console.error(err);
        res.json({ error: "Failed to delete preset" });
    }
});

module.exports = router;