const { mariaDBOptions } = require("../../config/mariaDB");
const knex = require("knex")(mariaDBOptions);
const logger = require("../../config/logger");

class MariadbDAO {
    constructor() {
        this.products = []; 
    }

    /* MENSAJES */

    async saveMessage(mensaje) {
        try {
            console.log("Servicio para guardar mensajes no implmentado para la base de datos seleccionada");
            return;
        } catch (error) {
            logger.error(`Error: ${error}`);
        }
    }

    async getMessages() {
        try {
            console.log("Servicio para obtener mensajes no implmentado para la base de datos seleccionada");
            return;
        } catch (error) {
            logger.error(`Error: ${error}`);
        } 
    }

    /* PRODUCTOS */

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

    async saveProduct(product) {
        try {
            await knex("productos").insert(product);
            return;  
        } catch (error) {
            logger.error(error);
        }
    }

    async getProducts() {
        try {
            const products = await knex.select("*").from("productos");
            const result = Object.values(JSON.parse(JSON.stringify(products)));
            return result;
        } catch (error) {
            logger.error(error);
        }
    }

}

module.exports = MariadbDAO;