const express = require("express");
const { faker } = require('@faker-js/faker');
const productosTest = express.Router();

function getRandomProduct() {
    let producto = {
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        foto: faker.image.image()
    }
    return producto;
}

productosTest.get("/", (req, res) => {
    const productos = [];
    for(let i = 0; i < 5; i++) {
        productos.push(getRandomProduct());
    }
    res.render("productos-test", {productos: productos});
});

module.exports = productosTest;