const { sqliteOptions } = require("../options/sqlite3");
const knex = require("knex")(sqliteOptions);

const createTable = () => {
    knex.schema.createTable("mensajes", (table) => {
        table.increments('id').primary()
        table.string('mensaje').notNullable()
        table.integer('autor')
        table.string('fecha').notNullable()
      })
      .then(() => {
        console.log("table created");
      }) 
      .catch(err => {
        console.log(err); 
        throw err;
      })
      .finally(() => {
          knex.destroy();
      })
}

module.exports = createTable;