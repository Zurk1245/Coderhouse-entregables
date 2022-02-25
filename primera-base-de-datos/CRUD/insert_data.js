const { mariaDBOptions } = require("../options/mariaDB");
const { sqliteOptions } = require("../options/sqlite3");
const knex_mariaDB = require("knex")(mariaDBOptions);
const knex_sqlite = require("knex")(sqliteOptions);

const insertDataForMariaDB = (table, element) => {
    knex_mariaDB(table).insert(element)
    .then(() => console.log("element inserted"))
    .catch(err => {
        console.log("err");
        throw err;
    })
    /*.finally(() => {
        knex.destroy();
    });*/
}

const insertDataForSqlite = (table, element) => {
    knex_sqlite(table).insert(element)
    .then(() => console.log("element inserted"))
    .catch(err => {
        console.log("err");
        throw err;
    })
    /*.finally(() => {
        knex.destroy();
    });*/
}

module.exports = { insertDataForMariaDB, insertDataForSqlite };