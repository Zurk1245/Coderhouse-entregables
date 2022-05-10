const express = require("express");
const passport = require('passport');
const login = express.Router();

/*============================[Routes]============================*/
// LOGIN
login.get("/", (req, res) => {
    let url;
    if (req.headers.host.includes("localhost")) {
        url = "http://localhost:8080";
    } else {
        url = "http://entregable-coder.herokuapp.com";
    }
    res.render("login", { url });
});
login.post("/", passport.authenticate("login", { failureRedirect: "/login/error" }), (req, res) => {
    res.redirect(`/home?username=${req.body.username}`);
});
login.get("/error", (req, res) => {
    res.render("error-login");
});

module.exports = login;