const createTable = require("../CRUD/create_table_sqlite3");
const { getDataFromSqlite } = require("../CRUD/get_data");
const { insertDataForSqlite } = require("../CRUD/insert_data");

class ContenedorDeMensajes {

    constructor(archivo) {
        this.archivo = archivo;
    }

    createMessagesTableInDataBase() {
        createTable();
    }

    save(mensaje) {
        insertDataForSqlite("mensajes", mensaje);
    }

    async getAll() {
        try {
            const data = await getDataFromSqlite("mensajes");
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);            
        }
    }

    
}

module.exports = ContenedorDeMensajes;