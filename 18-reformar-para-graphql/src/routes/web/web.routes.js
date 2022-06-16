const express = require("express");
const router = express.Router();

const { isLogged } = require("../../middlewares/middleware-functions");
const compression = require("compression");

const webController = require('../../controllers/web.controller')


router.get("/", isLogged, webController.index);
router.get("/home", isLogged, webController.home);
router.get("/info", compression, webController.info);
router.get("/info/debug", compression, webController.infoDebug)
router.get("/productos-test", webController.productTest);


module.exports = router;
