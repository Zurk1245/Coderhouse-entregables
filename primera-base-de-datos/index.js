const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const productAPI = require("./contenedores/productos");
const { ProductManagement } = productAPI;
const ContenedorDeMensajes = require("./contenedores/mensajes");

const handlebars = require("express-handlebars");

const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedorDeProductos = new ProductManagement();
const contenedorDeMensajes = new ContenedorDeMensajes("./mensajes.txt");

contenedorDeProductos.createProductsTableInDataBase(); 
contenedorDeMensajes.createMessagesTableInDataBase();  


app.use(express.static("public"));

io.on("connection", async socket => {
    console.log("Nuevo cliente conectado!");

    socket.emit("products", await contenedorDeProductos.getAll());
    
    socket.on("newProduct", async product => {
        contenedorDeProductos.save(product);
        const productos = await contenedorDeProductos.getAll();
        io.sockets.emit("products", productos); 
    })

    socket.emit("messages", await contenedorDeMensajes.getAll());

    socket.on("newMessage", async message => {
        contenedorDeMensajes.save(message);
        const mensajes =  await contenedorDeMensajes.getAll();
        io.sockets.emit("messages", mensajes);
    });

});

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${connectedServer.address().port}`);
});
connectedServer.on("error", error => console.log(`Error: ${error}`));