/*============================[Dependencies]============================*/
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const util = require("util");
const { schema, normalize } = require("normalizr");
const cookieParser = require("cookie-parser");
//const MongoStore = require("connect-mongo");
//const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require("bcrypt");
const productAPI = require("./contenedores/productos");
const { ProductManagement } = productAPI;
const config = require("./config");
const ContenedorMongoDB = require("./contenedores/contenedor-mongodb/mongodb-mesajes");
const mensajesDao = new ContenedorMongoDB(config.mongodbRemote);
const hbs = require("express-handlebars");
const productosTestRouter = require("./routes/productos-test");
const UsuarioModel = require("./contenedores/contenedor-mongodb/models/usuario-model");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedorDeProductos = new ProductManagement();
contenedorDeProductos.createProductsTableInDataBase(); 

const MONGO_URL = config.mongodbRemote.cnxStr;

//mongoose.connect(MONGO_URL);

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
/*----------- Passport -----------*/
passport.use("login", new LocalStrategy(async (username, password, done) => {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log(error);        
    }
    UsuarioModel.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            console.log(`Usuario no encontrado con el username ${username}`);
            return done(null, false);
        }
        if (!isValidPassword(user, password)) {
            console.log("Contraseña invalida");
            return done(null, false);
        }
        return done(null, user);
    })
}));
passport.use("registro", new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log(error);        
    }
    UsuarioModel.findOne({ username }, (err, user) => {
        if (err) {
            console.log(`Error en el registro: ${err}`);
            return done(err);
        }
        if (user) {
            console.log("El usuario ya está registrado");
            return done(null, false);
        }
        const newUser = {
            username,
            password: createHash(password)
        }
        UsuarioModel.create(newUser, (err, userWithId) => {
            if (err) {
                console.log(`Error registrando al usuario: ${err}`);
                done(err);
            }
            console.log(userWithId);
            console.log("Registro exitoso");
            done(null, userWithId);
        });
    })
}))
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
        UsuarioModel.findById(id, done);
})

/*----------- Session -----------*/

app.use(cookieParser());
app.use(session({
        /*store: MongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: advancedOptions
        }),*/
        secret: "keyboard cat",
        resave: false,
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
app.use(passport.initialize());
app.use(passport.session());

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
function isValidPassword(usuario, password) {
    return bCrypt.compareSync(password, usuario.password)
}
function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/login");
}


/*============================[Routes]============================*/
// INDEX
app.get("/", isLogged, (req, res) => {
    res.redirect("/home");
});

// LOGIN
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", passport.authenticate("login", { failureRedirect: "/login/error" }), (req, res) => {
    res.redirect("/home");
});
app.get("/login/error", (req, res) => {
    res.render("error-login");
});

// REGISTRO
app.get("/registro", (req, res) => {
    res.render("registro");
});
app.post("/registro", passport.authenticate("registro", { failureRedirect: "/login/error" }), (req, res) => {
    res.redirect("/home");
});
app.get("/registro/error", (req, res) => {
    res.render("error-register");
});

// LOGOUT
app.post("/logout", async (req, res) => {
    req.logOut();
    res.render("logout", { username: req.user.username });
});

const homeRouter = express.Router();
app.use("/home", homeRouter);
homeRouter.use(express.static(__dirname + "/public"));

homeRouter.get("/", isLogged, async (req, res) => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log(req.session)
        res.render("main", { username: req.user.username});   
    } catch (error) {
        console.log(`Error en home: ${error}`);
    }
})

// FAIL ROUTE
app.get("*", (req, res) => {
    res.render("no-encontrado");
});

/*============================[SOCKET.IO]============================*/

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado!");

    socket.emit("products", await contenedorDeProductos.getAll());
    
    socket.on("newProduct", async product => {
        contenedorDeProductos.save(product);
        const productos = await contenedorDeProductos.getAll();
        io.sockets.emit("products", productos); 
    })

    const mensajes = await mensajesDao.getAll();
    const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });
    const schemaMensaje = new schema.Entity('mensaje', { author: schemaAuthor }, { idAttribute: '_id' })
    const schemaMensajes = new schema.Entity('mensajes', { authors: [schemaAuthor], mensajes: [schemaMensaje] }, { idAttribute: '_id' })
    const normalizedMessages = normalize({ id: "mensajes", mensajes }, schemaMensajes);

    const normalizedLength = util.inspect(normalizedMessages,true,7,true).length;
    socket.emit("messages", normalizedMessages.entities, normalizedLength);

    socket.on("newMessage", async message => {
        const mensajeGuardado = await mensajesDao.save(message);
        console.log(mensajeGuardado);
        const mensajes =  await mensajesDao.getAll();
        const normalizedMessages = normalize({ id: "mensajes", mensajes }, schemaMensajes);
        const normalizedLength = util.inspect(normalizedMessages,true,7,true).length;
        io.sockets.emit("messages", normalizedMessages.entities, normalizedLength);
    });
});

/*============================[Servidor]============================*/
const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error: ${error}`));