const { io } = require("../../index");
const util = require("util");
const { schema, normalize } = require("normalizr");
const config = require("../config/config");

/* FORMA ANTERIOR PARA INSTANCIAR LOS CONTENDORES de los DAOs */

/*const ProductManagement = require("../persistencia/contenedores/mariadb-productos");
const ContenedorMongoDB = require("../persistencia/contenedores/contenedor-mongodb/mongodb-mesajes");
const mensajesDao = new ContenedorMongoDB(config.mongodbRemote);
const contenedorDeProductos = new ProductManagement();*/


/* FACTORY (UTILIZANDO LOS DAOs CORRESPONDIENTES) */

const DatabaseFactory = require("../persistencia/factory");
const dbFactory = new DatabaseFactory();
const database = dbFactory.useDatabase(config.database);
console.log(config.database);

let count = 0;

module.exports = async function(socket) {
    console.log("Nuevo cliente conectado!");
    if (count === 0) {
        await database.createProductsTableInDataBase();
        count = 1;
    } 
    socket.emit("products", await database.getProducts());
    socket.on("newProduct", async product => {
        await database.saveProduct(product);
        const productosActualizados = await database.getProducts();
        io.sockets.emit("products", productosActualizados);
    });
    const mensajes = await database.getMessages();
    const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });
    const schemaMensaje = new schema.Entity('mensaje', { author: schemaAuthor }, { idAttribute: '_id' })
    const schemaMensajes = new schema.Entity('mensajes', { authors: [schemaAuthor], mensajes: [schemaMensaje] }, { idAttribute: '_id' })
    const normalizedMessages = normalize({ id: "mensajes", mensajes }, schemaMensajes);
    const normalizedLength = util.inspect(normalizedMessages,true,7,true).length;

    socket.emit("messages", normalizedMessages.entities, normalizedLength);
    socket.on("newMessage", async message => {
        const mensajeGuardado = await database.saveMessage(message);
        console.log(mensajeGuardado);
        const mensajes =  await database.getMessages();
        const normalizedMessages = normalize({ id: "mensajes", mensajes }, schemaMensajes);
        const normalizedLength = util.inspect(normalizedMessages,true,7,true).length;
        io.sockets.emit("messages", normalizedMessages.entities, normalizedLength);
    });
}