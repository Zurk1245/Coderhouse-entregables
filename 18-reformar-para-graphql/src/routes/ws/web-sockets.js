const { listarProductos, agregarProducto } = require('./productos.sockets')
const { listarMensajes, agregarMensaje } = require('./mensajes.socket')

const socketInit = async (socket, io) => {
    console.log("Nuevo cliente conectado!");
    
    await listarProductos(socket)
    await agregarProducto(socket, io)

    await listarMensajes(socket)
    await agregarMensaje(socket, io)

}

module.exports = { socketInit }