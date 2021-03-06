/*============================[Dependencies]============================*/
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const config = require("./src/config");
const MONGO_URL = config.mongodbRemote.cnxStr;
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const passport = require('passport');
const UsuarioModel = require("./contenedores/contenedor-mongodb/models/usuario-model");
const session = require('express-session');
const hbs = require("express-handlebars");
const productosTestRouter = require("./src/routes/productos-test");
const { loginStrategy, registroStrategy } = require("./src/passport-strategies");
const parseArgs = require("minimist");
const options = { default: { port: 8080 } };
const args = parseArgs(process.argv, options);
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = args.port;

/*============================[Middlewares]============================*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*----------- Motor de plantillas -----------*/
app.engine("hbs", hbs.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
}));
app.set("view engine", "hbs")
app.set("views", "./public/views");
app.use("/api/productos-test", productosTestRouter);

/*----------- Session -----------*/
app.use(cookieParser());
app.use(session({
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: advancedOptions
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
}));

/*----------- Passport -----------*/
app.use(passport.initialize());
app.use(passport.session());
passport.use("login", loginStrategy);
passport.use("registro", registroStrategy);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
        UsuarioModel.findById(id, done);
});

/*============================[Routers]============================*/
const indexRouter = require("./src/routes/index");
app.use("/", indexRouter);
const loginRouter = require("./src/routes/login");
app.use("/login", loginRouter);
const registroRouter = require("./src/routes/registro");
app.use("/registro", registroRouter);
const logoutRouter = require("./src/routes/logout");
app.use("/logout", logoutRouter);
const homeRouter = require("./src/routes/home");
app.use("/home", homeRouter);
const infoRouter = require("./src/routes/info");
app.use("/info", infoRouter);
const apiRandomRouter = require("./src/routes/api-randoms");
app.use("/api/randoms", apiRandomRouter);

// FAIL ROUTE
app.get("*", (req, res) => {
    res.render("no-encontrado");
});

/*============================[SOCKET.IO]============================*/
io.on("connection", socket => {
    require("./src/web-sockets")(socket);
});

/*============================[Servidor]============================*/
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error: ${error}`));

module.exports = { io };