const { io } = require("../../index");
const util = require("util");
const { schema, normalize } = require("normalizr");
const config = require("../config/config");
const { ProductManagement } = require("../persistencia/contenedores/productos-mariadb");
const ContenedorMongoDB = require("../persistencia/contenedores/contenedor-mongodb/mongodb-mesajes");
const mensajesDao = new ContenedorMongoDB(config.mongodbRemote);

const contenedorDeProductos = new ProductManagement();
let count = 0;

module.exports = async function(socket) {
    console.log("Nuevo cliente conectado!");
    if (count === 0) {
        await contenedorDeProductos.createProductsTableInDataBase();
        count = 1;
    } 
    socket.emit("products", await contenedorDeProductos.getAll());
    socket.on("newProduct", async product => {
        await contenedorDeProductos.save(product);
        const productosActualizados = await contenedorDeProductos.getAll();
        io.sockets.emit("products", productosActualizados);
    });
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
}