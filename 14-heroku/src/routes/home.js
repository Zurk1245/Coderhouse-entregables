const express = require("express");
const homeRouter = express.Router();
const mongoose = require("mongoose");
const { isLogged } = require("../middleware-functions");
const config = require("../config");
const MONGO_URL = config.mongodbRemote.cnxStr;

homeRouter.use(express.static("C:/Users/maria/OneDrive/Escritorio/Coderhouse-entregables/inicio-de-sesion/public"));

homeRouter.get("/", isLogged, async (req, res) => {
    try {
        await mongoose.connect(MONGO_URL);
        let url;
        if (req.headers.host.includes("localhost")) {
            url = "http://localhost:8080";
        } else {
            url = "http://entregable-coder.herokuapp.com";
        }
        res.render("main", { username: req.query.username, url});   
    } catch (error) {
        console.log(`Error en home: ${error}`);
    }
});

module.exports = homeRouter;