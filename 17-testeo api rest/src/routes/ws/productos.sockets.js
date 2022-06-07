const servicesProductos = require('../../services/productos.services')

const listarProductos = async (socket) => {
    const productos = await servicesProductos.getAll();
    socket.emit("products", productos);
}

const agregarProducto = async (socket, io) => {
    socket.on("newProduct", async product => {
        await servicesProductos.create(product);
        const productos = await servicesProductos.getAll();
        io.sockets.emit("products", productos); 
    })
}

module.exports = {
    listarProductos,
    agregarProducto
}