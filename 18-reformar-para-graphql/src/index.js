/*============================[Dependencies]============================*/
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const cookieParser = require("cookie-parser");
const config = require('./config/config')
const passport = require('passport');
const session = require('express-session');
const hbs = require("express-handlebars");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const logger = require("./config/logger");
const { conectarMongo } = require('./database/mongo.connection')

const indexRouter = require('./routes/index.routes')
const GraphQLController = require("./graphql/graphql.controller");

/*============================[Middlewares]============================*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*----------- Motor de plantillas -----------*/
app.engine("hbs", hbs.engine({ extname: ".hbs", defaultLayout: "index.hbs", }));
app.set("view engine", "hbs")
app.set("views", "./src/views");


/*----------- Session -----------*/
app.use(cookieParser());
app.use(session(config.sessionConfig));

/*----------- Passport -----------*/
app.use(passport.initialize());
app.use(passport.session());


/*----------- Logger -----------*/
app.use(function (req, res, next) {
    logger.info(req.url);
    next();
});


/*----------- Routes -----------*/
app.use('/', indexRouter)
app.use(express.static('./public'))

app.use("/graphql", new GraphQLController());

// FAIL ROUTE
app.get("*", (req, res) => {
    res.render("no-encontrado");
    logger.warn(`Ruta fallida: ${req.url}`);
});

const webSocket = require('./routes/ws/web-sockets')
/*============================[SOCKET.IO]============================*/
io.on("connection", socket => {
    webSocket.socketInit(socket, io)
});

// error handler
app.use((err, req, res, next) => {
    console.log(err)
    // normalize error
    if (!err.status) {
        err.status = 500
        err.message = 'Internal Server Error'
    }
    res.status(err.status).json({ error: err.message })
})

/*============================[Servidor]============================*/
if (cluster.isMaster && config.SERVER_MODE == "CLUSTER") {

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString());
        cluster.fork();
    })

} else {

    const connectedServer = httpServer.listen(config.PORT, () => {
        logger.info('Server Mode: ' + config.SERVER_MODE + " - " + 'Persistencia: ' + config.PERSISTENCIA);
        logger.info(`Server listening on http://localhost:${connectedServer.address().port} with pid ${process.pid}`);
        conectarMongo(config.mongodbRemote.cnxStr)
                .then(() => logger.info('Mongoose conectado! (solo para la autenticacion)'))
                .catch(err => logger.error(`Error al conectar mongo: ${err.message}`));
        if (config.PERSISTENCIA === 'mongodb') {
            logger.info("Mongoose conectado para persistencia tambien!");
        }
    });
    connectedServer.on("error", error => logger.error(`Error: ${error}`));
}