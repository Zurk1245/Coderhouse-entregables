const express = require("express");
const logout = express.Router();

/*============================[Routes]============================*/
// LOGOUT
logout.post("/", (req, res) => {
    res.render("logout", { username: req.body.username });
    req.logOut();
});

module.exports = logout;