const MongodbDAO = require("./DAOs/mongodb");
const config = require("../config/config");
const MariadbDAO = require("./DAOs/mariadb");

let instance = null;

class DatabaseFactory {

    useDatabase(database) {
        if (database === "mongodb") return new MongodbDAO(config.mongodbRemote);
        if (database === "mariadb") return new MariadbDAO();
    }

    /* PATRÓN SINGLETON */
    static getInstance() {
        if (!instance) {
            instance = new DatabaseFactory();
        }
        return instance;
    }
}

module.exports = DatabaseFactory;