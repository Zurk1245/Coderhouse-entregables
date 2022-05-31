const express = require("express");
const homeRouter = express.Router();
const mongoose = require("mongoose");
const { isLogged } = require("../middlewares/middleware-functions");
const config = require("../config/config");
const MONGO_URL = config.mongodbRemote.cnxStr;

homeRouter.use(express.static("public"));

homeRouter.get("/", isLogged, async (req, res) => {
    try {
        await mongoose.connect(MONGO_URL);
        res.render("main", { username: req.user.username});   
    } catch (error) {
        console.log(`Error en home: ${error}`);
    }
});

module.exports = homeRouter;