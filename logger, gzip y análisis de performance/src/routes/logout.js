const express = require("express");
const logout = express.Router();

/*============================[Routes]============================*/
// LOGOUT
logout.post("/", async (req, res) => {
    res.render("logout", { username: req.user.username });
    req.logOut();
});

module.exports = logout;