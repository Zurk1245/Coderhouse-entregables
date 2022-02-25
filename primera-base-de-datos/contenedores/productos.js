const createTable = require("../CRUD/create_table_mariadb");
const { getDataFromMariaDB } = require("../CRUD/get_data");
const { insertDataForMariaDB } = require("../CRUD/insert_data");

class ProductManagement {
    constructor() {
        this.products = []; 
    }

    createProductsTableInDataBase() {
        createTable("productos");
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