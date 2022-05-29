const { getDataFromMariaDB } = require("../CRUD/get_data");
const { insertDataForMariaDB } = require("../CRUD/insert_data");
const { mariaDBOptions } = require("../../config/mariaDB");
const knex = require("knex")(mariaDBOptions);
const logger = require("../../config/logger");

class ProductManagement {
    constructor() {
        this.products = []; 
    }

    createProductsTableInDataBase() {
        knex.schema.dropTableIfExists("productos").then(() => {
            console.log("Table productos eliminada!");
          });
          knex.schema.createTable("productos", (table) => {
              table.increments('id').primary()
              table.string('nombre').notNullable()
              table.integer('precio')
              table.string('foto')
            })
            .then(() => {
              console.log("Table productos creada!");
            }) 
            .catch(err => {
              logger.error(err);
              throw err;
            })
            .finally(() => {
                knex.destroy();
            })
    }

    save(product) {
        insertDataForMariaDB("productos", product);
    }


    async getAll() {
        try {
            const data = await getDataFromMariaDB("productos");
            return data;
        } catch (error) {
            logger.error(error);            
        }
    }

}

module.exports = { ProductManagement };