const { mariaDBOptions } = require("../options/mariaDB");
const knex_mariaDB = require("knex")(mariaDBOptions);

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

module.exports = { insertDataForMariaDB };