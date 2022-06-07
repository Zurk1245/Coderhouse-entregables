const { faker } = require('@faker-js/faker');

function getRandomProduct() {
    let producto = {
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        foto: faker.image.image()
    }
    return producto;
}

module.exports = {
    getRandomProduct
}