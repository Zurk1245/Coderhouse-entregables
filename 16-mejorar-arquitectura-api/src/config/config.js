require("dotenv").config();
const parseArgs = require("minimist");
const options = { default: { port: 8080, modo: "FORK" } };
const args = parseArgs(process.argv, options);

module.exports = {
    database: args.database,
    mongodbRemote: {
        client: "mongodb",
        cnxStr: process.env.CONNECTION_STRING,
    }
}