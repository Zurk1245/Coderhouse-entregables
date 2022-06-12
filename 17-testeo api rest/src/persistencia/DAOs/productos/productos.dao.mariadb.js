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
        return result;
    }

    async getProducts() {
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
        //await knex.select().from(this.tableName);
        await knex(this.tableName).where({nombre: nombre}).update(updatedProduct);
    }

    async deleteProduct(nombre) {
        try {
            const response = await knex(this.tableName).where({nombre: nombre}).del();
            console.log(response.data);
            console.log(response);
            return response;   
        } catch (error) {
            logger.error(error);
        }
    }

    /**
     * TODO: Faltan agregar los demás métodos del CRUD
     */

}

module.exports = MariadbDAO;