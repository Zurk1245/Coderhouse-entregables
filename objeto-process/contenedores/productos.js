const { getDataFromMariaDB } = require("../CRUD/get_data");
const { insertDataForMariaDB } = require("../CRUD/insert_data");
const { mariaDBOptions } = require("../options/mariaDB");
const knex = require("knex")(mariaDBOptions);

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
              console.log(err);
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
            console.log(error);            
        }
    }

}

module.exports = { ProductManagement };