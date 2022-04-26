const { mariaDBOptions } = require("../options/mariaDB");
const knex_mariaDB = require("knex")(mariaDBOptions);


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

module.exports = { getDataFromMariaDB };