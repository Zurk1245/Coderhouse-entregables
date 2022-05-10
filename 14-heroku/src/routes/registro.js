const express = require("express");
const passport = require('passport');
const registro = express.Router();

/*============================[Routes]============================*/
registro.get("/", (req, res) => {
    let url;
    if (req.headers.host.includes("localhost")) {
        url = "http://localhost:8080";
    } else {
        url = "http://entregable-coder.herokuapp.com";
    }
    res.render("registro", { url });
});
registro.post("/", passport.authenticate("registro", { failureRedirect: "/registro/error" }), (req, res) => {
    res.redirect("/home");
});
registro.get("/error", (req, res) => {
    res.render("error-registro");
});

module.exports = registro;