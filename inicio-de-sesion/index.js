/*============================[Dependencies]============================*/
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const util = require("util");
const { schema, normalize } = require("normalizr");
//const cookieParser = require("cookie-parser");
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
const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedorDeProductos = new ProductManagement();
contenedorDeProductos.createProductsTableInDataBase(); 

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
    await mongoose.connect(config.mongodbRemote.cnxStr);
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
    await mongoose.connect(config.mongodbRemote.cnxStr);
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

//app.use(cookieParser());
app.use(session({
        /*store: MongoStore.create({
            mongoUrl: "mongodb+srv://mariano:mariano@cluster0.z4zz9.mongodb.net/entregables?retryWrites=true&w=majority",
            mongoOptions: advancedOptions
        }),*/
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 100000 * 60
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
/*app.use(function(req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    next();
});*/

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
    //const user = req.user;
    res.redirect("/home");
    //res.render("main", { username: user.username });
});
app.get("/login/error", (req, res) => {
    res.render("error-login");
});

// REGISTRO
app.get("/registro", (req, res) => {
    res.render("registro");
});
app.post("/registro", passport.authenticate("registro", { failureRedirect: "/login/error" }), (req, res) => {
    //const user = req.user;
    res.redirect("/home");
    //res.render("main", { user });
});
app.get("/registro/error", (req, res) => {
    res.render("error-register");
});

// LOGOUT
app.post("/logout", (req, res) => {
    const user = req.session.usuario;
    req.session.destroy(err => {
        if(!err) {
            res.render("logout", { usuario: user });
        } 
        else res.send({status: 'Logout ERROR', body: err});
    });
});

// HOME
app.post("/home", (req, res) => {
    req.session.isLogged = true;
    req.session.usuario = req.body.usuario;
    res.redirect("/home");
});

const homeRouter = express.Router();
app.use("/home", homeRouter);
homeRouter.use(express.static(__dirname + "/public"));

homeRouter.get("/", isLogged, (req, res) => {
    res.render("main", { username: req.user.username});
})

// FAIL ROUTE
app.get("*", (req, res) => {
    res.render("no-encontrado");
});

/*============================[SOCKET.IO]============================*/

io.on("connection", async (socket) => {
    //await mongoose.connect(config.mongodbRemote.cnxStr);
    //if (err) console.log(err);
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
//const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error: ${error}`));