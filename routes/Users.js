const express = require('express');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const router = express.Router();
const { Users, Targets, sequelize } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/register", async (req, res) => {

    const transaction = await sequelize.transaction();

    try {
        const { username, password } = req.body;

        const usernameTaken = await Users.findOne({ where: { username } });

        if (usernameTaken) {
            await transaction.rollback();
            res.json({ error: "Username is taken!" });
            return;
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await Users.create(
            { username, password: hash },
            { transaction: transaction }
        );

        await Targets.create(
            { UserId: newUser.id },
            { transaction: transaction }
        );

        await transaction.commit();

        res.json("User registered successfully");
    }
    catch (err) {
        await transaction.rollback();
        console.error(err);
        res.status(500).json({ error: "Failed to register" });
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
            res.json({ token: accessToken, username: user.username, id: user.id });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to sign in" });
    }
});

router.get("/auth", validateToken, (req, res) => res.json(req.user));

module.exports = router;