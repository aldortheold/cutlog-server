const express = require('express');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const router = express.Router();
const { Users } = require('../models');

require('dotenv').config();

router.post("/register", async (req, res) => {
    try {
        const { username, password, timezone } = req.body;
        bcrypt.hash(password, 10).then(hash => {
            Users.create({
                username: username,
                password: hash,
                timezone: timezone
            });
            res.json("User registered successfully");
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register user" });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ where: { username: username } });
        if (!user) {
            res.json({ error: "User not found" });
            return;
        }
        bcrypt.compare(password, user.password).then(match => {
            if (!match) {
                res.json({ error: "Password is incorrect" });
                return;
            }
            const accessToken = sign({ username: user.username, id: user.id }, process.env.ACCESS_TOKEN);
            res.json(accessToken);
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to sign in" });
    }
})

module.exports = router;