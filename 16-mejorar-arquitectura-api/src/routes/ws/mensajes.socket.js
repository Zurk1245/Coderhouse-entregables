const util = require("util");
const { schema, normalize } = require("normalizr");
const servicesMensajes = require('../../services/mensajes.services')

const listarMensajes = async (socket) => {
    try {
        const mensajes = await servicesMensajes.getAll();
        // const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });
        // const schemaMensaje = new schema.Entity('mensaje', { author: schemaAuthor }, { idAttribute: '_id' })
        // const schemaMensajes = new schema.Entity('mensajes', { authors: [schemaAuthor], mensajes: [schemaMensaje] }, { idAttribute: '_id' })
        // const normalizedMessages = normalize({ id: "mensajes", mensajes }, schemaMensajes);
        // const normalizedLength = util.inspect(normalizedMessages, true, 7, true).length;
        socket.emit("messages", /*normalizedMessages.entities, normalizedLength*/ mensajes);
    } catch (error) {
        console.log(error)
    }
}

const agregarMensaje = async (socket, io) => {
    try {
        socket.on("newMessage", async message => {
            const mensajeGuardado = await servicesMensajes.create(message);
            const mensajes = await servicesMensajes.getAll();
            // const normalizedMessages = normalize({ id: "mensajes", mensajes }, schemaMensajes);
            // const normalizedLength = util.inspect(normalizedMessages, true, 7, true).length;
            io.sockets.emit("messages", /*normalizedMessages.entities, normalizedLength*/ mensajes);
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    listarMensajes,
    agregarMensaje
}
