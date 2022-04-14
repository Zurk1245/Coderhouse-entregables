const express = require("express");
const { fork } = require("child_process");
const apiRandoms = express.Router();

apiRandoms.get("/", (req, res) => {
    let cantidadNumerosAleatorios = req.query.cant;
    if (!cantidadNumerosAleatorios) {
        cantidadNumerosAleatorios = 100000000;
    }
    const randoms = fork("api/randoms.js");
    randoms.send({cantidad: cantidadNumerosAleatorios});
    randoms.on("message", randomNumbers => {
        res.render("apiRandoms", { randomNumbers: randomNumbers });
    });
});

apiRandoms.post("/", (req, res) => {
    res.send("No se bloqueó! :D");
});

module.exports = apiRandoms;