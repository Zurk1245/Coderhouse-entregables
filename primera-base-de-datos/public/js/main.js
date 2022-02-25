const socket = io.connect();

function sendProduct(e) {
    e.preventDefault();
    console.log("APRETADO!");
    const nombre = document.getElementById("nombre");
    const precio = document.getElementById("precio");
    const foto = document.getElementById("foto");
    const newProduct = {
        nombre: nombre.value,
        precio: precio.value,
        foto: foto.value
    }
    socket.emit("newProduct", newProduct);
}

function htmlTable(products) {
    return fetch('products-table.hbs')
        .then(result => result.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ products });
            return html;
        })
}

socket.on("products", products => {
    htmlTable(products).then(html => {
        console.log(html);
        document.getElementById('products').innerHTML = html;
    });
});

function sendMessage(e) {
    e.preventDefault();
    const autor = document.getElementById("autor");
    let mensaje = document.getElementById("mensaje");
    const newMessage = {
        autor: autor.value,
        mensaje: mensaje.value,
        fecha: new Date().toLocaleString()
    }
    socket.emit("newMessage", newMessage);
    mensaje.value = "";
}

function displayMessages(messages) {
    const messagesTitle = `<h2 class="title">Mensajes</h2>`;
    const html = messages.map(message => {
        
        return(`<div style="margin: 5px;">
            <span style="font-size: 1.3rem; color: blue; font-weight: bold;">${message.autor}</span>
            <span style="font-size: 1.3rem; color: brown;">${message.fecha}</span>:
            <i style="font-size: 1.3rem; color: green;">${message.mensaje}</i> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = messagesTitle.concat(html);
}

socket.on("messages", messages => {
    displayMessages(messages);
});