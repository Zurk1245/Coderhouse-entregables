require("dotenv").config();

module.exports = {
    mongodbRemote: {
        client: "mongodb",
        cnxStr: process.env.CONNECTION_STRING,
    }
}