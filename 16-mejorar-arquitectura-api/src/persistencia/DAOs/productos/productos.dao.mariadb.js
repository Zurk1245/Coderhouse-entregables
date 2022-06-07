const { mariaDBOptions } = require("../../../config/mariaDB");
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
        const result = await knex(this.tableName).insert(product);
        return result;
    }

    async getProducts() {
        const products = await knex.select("*").from(this.tableName);
        const result = Object.values(JSON.parse(JSON.stringify(products)));
        return result;
    }

    /**
     * TODO: Faltan agregar los demás métodos del CRUD
     */

}

module.exports = MariadbDAO;