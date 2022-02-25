const sqliteOptions = {
    client: "sqlite3",
    connection: {
        filename: `${__dirname}/DB/mydb.sqlite`,
    },
    useNullAsDefault: true
}

module.exports = { sqliteOptions };