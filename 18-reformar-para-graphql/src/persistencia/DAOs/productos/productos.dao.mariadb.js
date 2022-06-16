const logger = require("../../../config/logger");
const { mariaDBOptions } = require("../../../config/mariaDB");
const ProductosDTO = require("../../DTOs/productos.dto");
const knex = require("knex")(mariaDBOptions);

let instance = null;

class MariadbDAO {
    constructor() {
        this.tableName = "productos";
        this.createProductsTableInDataBase()
    }

    /* PATRÓN SINGLETON */
    static getInstance() {
        if (!instance) {
            instance = new MariadbDAO();
        }
        return instance;
    }

    async createProductsTableInDataBase() {
        await knex.schema
            .dropTableIfExists(this.tableName)
            .createTable(this.tableName, table => {
                table.increments('id').primary()
                table.string('nombre').notNullable()
                table.integer('precio')
                table.string('foto')
            });
    }

    async saveProduct(product) {
        const productToSend = new ProductosDTO(product.nombre, product.precio, product.foto);
        const result = await knex(this.tableName).insert(productToSend);
        return productToSend;
    }

    async getProducts(productName) {
        if (productName) {
            const product = await knex.select("*").from(this.tableName).where({nombre: productName});
            product ? product : undefined;
        }
        const products = await knex.select("*").from(this.tableName);
        let productosFinales = [];
        for (let i = 0; i < products.length; i++) {
            let producto = {
                nombre: products[i].nombre,
                precio: products[i].precio,
                foto: products[i].foto,
            }
            let nuevoProducto = new ProductosDTO(producto.nombre, producto.precio, producto.foto);
            productosFinales.push(nuevoProducto);
        }
        
        const result = Object.values(JSON.parse(JSON.stringify(productosFinales)));
        return result;
    }

    async updateProduct(nombre, updatedProduct) {
        try {
            const result = await knex(this.tableName).where({nombre: nombre}).update(updatedProduct);
            const product = await this.getProducts(nombre);
            return product;   
        } catch (error) {
            logger.log(error);
        }
    }

    async deleteProduct(nombre) {
        try {
            const eliminatedProduct = this.getProducts(productName);
            console.log("borrandoooooo");
            console.log(eliminatedProduct);
            await knex(this.tableName).where({nombre: nombre}).del();
            eliminatedProduct.eliminated = true;
            return eliminatedProduct;   
        } catch (error) {
            logger.error(error);
        }
    }
}

module.exports = MariadbDAO;