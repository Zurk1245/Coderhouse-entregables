const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const util = require("util");
const { schema, normalize } = require("normalizr");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mariano:mariano@cluster0.z4zz9.mongodb.net/entregables?retryWrites=true&w=majority").then(res => {
    console.log("connected to mongodb");
});

const productAPI = require("./contenedores/productos");
const { ProductManagement } = productAPI;
const config = require("./config");
const ContenedorMongoDB = require("./contenedores/contenedor-mongodb/mongodb-mesajes");
const mensajesDao = new ContenedorMongoDB(config.mongodbRemote);

const hbs = require("express-handlebars");
const productosTestRouter = require("./routes/productos-test");
const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedorDeProductos = new ProductManagement();
contenedorDeProductos.createProductsTableInDataBase(); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("hbs", hbs.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
}));
app.set("view engine", "hbs")
app.set("views", "./public/views");
app.use("/api/productos-test", productosTestRouter);
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://mariano:mariano@cluster0.z4zz9.mongodb.net/entregables?retryWrites=true&w=majority",
            mongoOptions: advancedOptions
        }),
        secret: "key",
        resave: false,
        saveUninitialized: false
    })
)

function isLogged(req, res, next) {
    if (req.session.isLogged) {
        return next();
    } else {
        console.log("asd");
        return res.redirect("/login");
    }

}

app.get("/", isLogged, (req, res) => {
    res.redirect("/home");
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/home", (req, res, next) => {
    req.session.isLogged = true;
    req.session.usuario = req.body.usuario
    res.redirect("/home");
});

const homeRouter = express.Router();
app.use("/home", homeRouter);

homeRouter.use(express.static(__dirname + "/public"));

homeRouter.get("/", isLogged, (req, res) => {
    res.render("main", {usuario: req.session.usuario});
})

//SOCKET.IO

io.on("connection", async socket => {
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

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error: ${error}`));