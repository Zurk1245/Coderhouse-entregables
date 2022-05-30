const { mariaDBOptions } = require("../../config/mariaDB");
const knex = require("knex")(mariaDBOptions);
const logger = require("../../config/logger");

class ProductManagement {
    constructor() {
        this.products = []; 
    }

    async createProductsTableInDataBase() {
        try {
            await knex.schema
                .dropTableIfExists("productos")
                .createTable("productos", table => {
                    table.increments('id').primary()
                    table.string('nombre').notNullable()
                    table.integer('precio')
                    table.string('foto')
                });
        } catch (error) {
            logger.error(error);
        }
    }

    async save(product) {
        try {
            await knex("productos").insert(product);
            console.log("element inserted");    
        } catch (error) {
            logger.error(error);
        }
    }

    async getAll() {
        try {
            const products = await knex.select("*").from("productos");
            return Object.values(JSON.parse(JSON.stringify(products)));    
        } catch (error) {
            logger.error(error);
        }
    }

}

module.exports = { ProductManagement };