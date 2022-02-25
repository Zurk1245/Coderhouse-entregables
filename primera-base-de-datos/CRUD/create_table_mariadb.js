const { mariaDBOptions } = require("../options/mariaDB");
const knex = require("knex")(mariaDBOptions);

const createTable = (tableName) => {
    knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary()
        table.string('nombre').notNullable()
        table.integer('precio')
        table.integer('foto')
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