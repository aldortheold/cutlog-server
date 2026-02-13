const { verify } = require("jsonwebtoken");

function validateToken(req, res, next) {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        res.json({ error: "You are not signed in!" });
        return;
    }
    
    try {
        const validToken = verify(accessToken, process.env.ACCESS_TOKEN);
        req.user = validToken;
        if (validToken) return next();
    }
    catch (error) {
        console.error(err);
        res.status(500).json({ error: error });
    }
}

module.exports = { validateToken }