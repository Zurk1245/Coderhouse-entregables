const ProductoModel = require('../../models/producto-model');
const ProductosDTO = require("../../DTOs/productos.dto");

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
        const productoParaAgregar = new ProductosDTO(newProduct.nombre, newProduct.precio, newProduct.foto);
        await ProductoModel.create(productoParaAgregar);
        return productoParaAgregar;
    }

    async getProducts() {
        const productos = await ProductoModel.find({});
        let productosFinales = [];
        for (let i = 0; i < productos.length; i++) {
            let producto = {
                nombre: productos[i].nombre,
                precio: productos[i].precio,
                foto: productos[i].foto,
            }
            let nuevoProducto = new ProductosDTO(producto.nombre, producto.precio, producto.foto);
            productosFinales.push(nuevoProducto);
        }
        return productosFinales;
    }

    async updateProduct(nombre, updatedProduct) {
        await ProductoModel.updateOne({nombre: nombre}, updatedProduct);
    }

    async deleteProduct(nombre) {
        await ProductoModel.deleteOne({nombre: nombre});
    }
}

module.exports = MongoDbDAO;