const ProductoModel = require('../../models/producto-model');

let instance = null;

class MongoDbDAO {

    constructor() {}

    /* PATRÓN SINGLETON */
    static getInstance() {
        if (!instance) {
            instance = new MongoDbDAO();
        }
        return instance;
    }

    async saveProduct(newProduct) {
        const producto = await ProductoModel.create(newProduct);
        return producto;
    }

    async getProducts() {
        const mensajes = await ProductoModel.find({});
        return mensajes;
    }
}

module.exports = MongoDbDAO;