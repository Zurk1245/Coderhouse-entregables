const { mariaDBOptions } = require("../options/mariaDB");
const { sqliteOptions } = require("../options/sqlite3");
const knex_mariaDB = require("knex")(mariaDBOptions);
const knex_sqlite = require("knex")(sqliteOptions);


const getDataFromMariaDB = (table) => {
    const query = knex_mariaDB.select("*").from(table)
    return query.then(elements => {
        return Object.values(JSON.parse(JSON.stringify(elements)));
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
    /*.finally(() => {
        knex.destroy();
    })*/
}

const getDataFromSqlite = (table) => {
    const query = knex_sqlite.select("*").from(table)
    return query.then(elements => {
        return Object.values(JSON.parse(JSON.stringify(elements)));
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
    /*.finally(() => {
        knex.destroy();
    })*/
}

module.exports = { getDataFromMariaDB, getDataFromSqlite };