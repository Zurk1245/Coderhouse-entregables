const config = require('../config/config');
const productsDAO = require('../persistencia/DAOs/productos/factory').useDatabase(config.PERSISTENCIA);

const getAll = async () => {
    const productos = await productsDAO.getProducts();
    /*if (productos.length === 0) {
        const error = new Error('No hay productos cargados')
        error.status = 404
        throw error
    }*/
    return productos
}

const getById = async (id) => {
    /**TODO: falta implementar*/
    return 'Método getById product services'
}

const create = async (producto) => {
    /**TODO: agregar validaciones correspondientes. lanzar posibles errores */
    const newProduct = await productsDAO.saveProduct(producto)
    return newProduct
}

const update = async (id, newData) => {
    /**TODO: falta implementar*/
    return 'Método update product services'
}

const remove = async (id) => {
    /**TODO: falta implementar*/
    return 'Método remove product services'
}

const getRandoms = () => {
    /**TODO: falta implementar*/
    return 'Método getRandoms product services'
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getRandoms
}