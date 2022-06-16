const { getRandomProduct } = require("../utils/productosRandom");
const config = require('../config/config')

const index = (req, res, next) => {
    try {
        res.redirect("/home");
    } catch (error) {
        next(error)
    }
}

const home = (req, res, next) => {
    try {
        res.render("main", { username: req.user.username });
    } catch (error) {
        next(error)
    }
}

const info = (req, res, next) => {
    try {
        const infoObject = config.infoProcess;
        res.render("info", infoObject);
    } catch (error) {
        next(error)
    }
}

const infoDebug = (req, res, next) => {
    try {
        const infoObject = config.infoProcess;
        console.log(infoObject);
        res.render("info", infoObject);
    } catch (error) {
        next(error)
    }
}

const productTest = (req, res, next) => {
    try {
        const productos = [];
        for (let i = 0; i < 5; i++) {
            productos.push(getRandomProduct());
        }
        res.render("productos-test", { productos: productos });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    index,
    home,
    info,
    infoDebug,
    productTest
}
