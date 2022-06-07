const MariadbDAO = require("./mensajes.dao.mariadb");
const MongodbDAO = require("./mensajes.dao.mongo");
/**
 * TODO:
 * agregar los require de las demás DAO a implementar
 */


class MensajesDatabaseFactory {

    static useDatabase(database) {
        if (database === "mariadb") return MariadbDAO.getInstance();
        if (database === "mongodb") return MongodbDAO.getInstance();
    }

}

module.exports = MensajesDatabaseFactory;