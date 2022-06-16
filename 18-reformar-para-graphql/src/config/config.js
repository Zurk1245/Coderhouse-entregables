const MongoStore = require("connect-mongo");
require("dotenv").config();
const parseArgs = require("minimist");
const options = { default: { port: 8080, modo: "FORK" } };
const args = parseArgs(process.argv.slice(2), options);
const numCPUs = require("os").cpus().length;

module.exports = {
    PERSISTENCIA: process.env.PERSISTENCIA || 'mariadb',
    numCPUs: numCPUs,
    args: args,
    infoProcess: {
        args: Object.values(args).join(" "),
        path: process.execPath,
        plataforma: process.platform,
        process_id: process.pid,
        version_node: process.version,
        carpeta: process.cwd(),
        memoria_reservada: process.memoryUsage.rss(),
        numCPUs: numCPUs
    },
    PORT: process.env.PORT || args.port,
    SERVER_MODE: args.modo, 
    mongodbRemote: {
        client: "mongodb",
        cnxStr: process.env.CONNECTION_STRING,
    },
    sessionConfig: {
        store: MongoStore.create({
            mongoUrl: process.env.CONNECTION_STRING,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
        }),
        secret: "keyboard cat",
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 1000 * 60 * 10
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }
}