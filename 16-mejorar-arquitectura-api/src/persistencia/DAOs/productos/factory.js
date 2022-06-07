const MariadbDAO = require("./productos.dao.mariadb");
const MongodbDAO = require("./productos.dao.mongo");
/**
 * TODO:
 * agregar los require de las demás DAO
 */


class ProductsDatabaseFactory {

    static useDatabase(database) {
        if (database === "mariadb") return MariadbDAO.getInstance();
        if (database === "mongodb") return MongodbDAO.getInstance();
    }

}

module.exports = ProductsDatabaseFactory;