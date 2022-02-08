const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const productAPI = require("./productos");
const { ProductManagement } = productAPI;
const ContenedorDeMensajes = require("./contenedor-mensajes");

const handlebars = require("express-handlebars");

const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedor = new ProductManagement();
const contenedorDeMensajes = new ContenedorDeMensajes("./mensajes.txt");

app.use(express.static("public"));

io.on("connection", async socket => {
    console.log("Nuevo cliente conectado!");

    socket.emit("products", contenedor.products);
    
    socket.on("newProduct", product => {
        contenedor.save(product);
        io.sockets.emit("products", contenedor.products);
    })

    socket.emit("messages", await contenedorDeMensajes.getAll());

    socket.on("newMessage", async message => {
        await contenedorDeMensajes.save(message);
        const updatedMessages = await contenedorDeMensajes.getAll();
        io.sockets.emit("messages", updatedMessages);
    });

});

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error: ${error}`));