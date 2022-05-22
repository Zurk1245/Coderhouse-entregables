const express = require("express");
const { isLogged } = require("../controlador/middleware-functions");
const index = express.Router();

index.get("/", isLogged, (req, res) => {
    res.redirect("/home");
});

module.exports = index;