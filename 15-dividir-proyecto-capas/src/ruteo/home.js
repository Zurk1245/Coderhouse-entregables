const express = require("express");
const homeRouter = express.Router();
const mongoose = require("mongoose");
const { isLogged } = require("../controlador/middleware-functions");
const config = require("../logica-negocio/config");
const MONGO_URL = config.mongodbRemote.cnxStr;

homeRouter.use(express.static("C:/Users/maria/OneDrive/Escritorio/Coderhouse-entregables/inicio-de-sesion/public"));

homeRouter.get("/", isLogged, async (req, res) => {
    try {
        await mongoose.connect(MONGO_URL);
        res.render("main", { username: req.user.username});   
    } catch (error) {
        console.log(`Error en home: ${error}`);
    }
});

module.exports = homeRouter;