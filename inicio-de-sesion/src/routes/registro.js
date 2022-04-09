const express = require("express");
const passport = require('passport');
const registro = express.Router();

/*============================[Routes]============================*/
registro.get("/", (req, res) => {
    res.render("registro");
});
registro.post("/", passport.authenticate("registro", { failureRedirect: "/login/error" }), (req, res) => {
    res.redirect("/home");
});
registro.get("/error", (req, res) => {
    res.render("error-registro");
});

module.exports = registro;