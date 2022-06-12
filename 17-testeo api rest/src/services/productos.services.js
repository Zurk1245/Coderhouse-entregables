const config = require('../config/config');
const logger = require('../config/logger');
const productsDAO = require('../persistencia/DAOs/productos/factory').useDatabase(config.PERSISTENCIA);

const getAll = async () => {
    try {
        const productos = await productsDAO.getProducts();
        return productos;
    } catch (error) {
        logger.error(error);
    }
}

const getById = async (nombre) => {
    try {
        const producto = await productsDAO.getProducts(nombre);
        return producto;
    } catch (error) {
        logger.error(error);
    }
}

const create = async (producto) => {
    try {
        const newProduct = await productsDAO.saveProduct(producto);
        return newProduct;   
    } catch (error) {
        logger.error(error);
    }
}

const update = async (id, newData) => {
    try {
        const newProduct = await productsDAO.updateProduct(id, newData);
        return newProduct;   
    } catch (error) {
        logger.error(error);
    }
}

const remove = async (id) => {
    try {
        const newProduct = await productsDAO.deleteProduct(id);
        return newProduct;
    } catch (error) {
        logger.error(error);
    }
}

const getRandoms = () => {
    /**TODO: falta implementar*/
    try {
        return 'Método getRandoms product services';
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getRandoms
}