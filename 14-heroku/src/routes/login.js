const express = require("express");
const passport = require('passport');
const login = express.Router();

/*============================[Routes]============================*/
// LOGIN
login.get("/", (req, res) => {
    res.render("login");
});
login.post("/", passport.authenticate("login", { failureRedirect: "/login/error" }), (req, res) => {
    res.redirect("/home");
});
login.get("/error", (req, res) => {
    res.render("error-login");
});

module.exports = login;