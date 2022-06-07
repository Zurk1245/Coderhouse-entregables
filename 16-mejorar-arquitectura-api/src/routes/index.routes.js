const express = require('express')
const router = express.Router()

const webRouter = require("./web/web.routes");
const authRouter = require("./web/auth.routes");
const productsRouter = require("./api/productos.routes");

router.use("/", webRouter);
router.use("/auth", authRouter);
router.use("/api/productos", productsRouter);

module.exports = router;