const { getDataFromSqlite } = require("../CRUD/get_data");
const { insertDataForSqlite } = require("../CRUD/insert_data");
const { sqliteOptions } = require("../options/sqlite3");
const knex = require("knex")(sqliteOptions);

class ContenedorDeMensajes {

    constructor(archivo) {
        this.archivo = archivo;
    }

    createMessagesTableInDataBase() {
        knex.schema.dropTableIfExists('mensajes').then(() => {
            console.log("Table mensajes eliminada!");
          });
        knex.schema.createTable("mensajes", (table) => {
            table.increments('id').primary()
            table.string('mensaje').notNullable()
            table.string('autor')
            table.string('fecha').notNullable()
        })
        .then(() => {
            console.log("Table mensajes creada!");
        }) 
        .catch(err => {
            console.log(err); 
            throw err;
        })
        .finally(() => {
            knex.destroy();
        })
    }

    save(mensaje) {
        insertDataForSqlite("mensajes", mensaje);
    }

    async getAll() {
        try {
            const data = await getDataFromSqlite("mensajes");
            return data;
        } catch (error) {
            console.log(error);            
        }
    }

    
}

module.exports = ContenedorDeMensajes;