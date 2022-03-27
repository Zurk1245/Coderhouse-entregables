const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const util = require("util");
const productAPI = require("./contenedores/productos");
const { ProductManagement } = productAPI;
const ContenedorDeMensajes = require("./contenedores/mensajes");
//const { mariaDBOptions } = require("./options/mariaDB");
//const knex = require("knex")(mariaDBOptions);
const config = require("./config");
const ContenedorMongoDB = require("./contenedores/contenedor-mongodb/mongodb-mesajes");
const mensajesDao = new ContenedorMongoDB(config.mongodbRemote);

const hbs = require("express-handlebars");
const productosRouter = require("./routes/productos-test");
const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const { schema, normalize } = require("normalizr");


const contenedorDeProductos = new ProductManagement();
const contenedorDeMensajes = new ContenedorDeMensajes("./mensajes.txt");

contenedorDeProductos.createProductsTableInDataBase(); 
//contenedorDeMensajes.createMessagesTableInDataBase();  

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.engine("hbs", hbs.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
}));
app.set("view engine", "hbs")
app.set("views", "./views");
app.use("/api/productos-test", productosRouter);

app.use(express.static("public"));

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