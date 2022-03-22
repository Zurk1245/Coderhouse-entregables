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
        document.getElementById('products').innerHTML = html;
    });
});

// !-- MESSAGES --!

function sendMessage(e) {
    console.log(e);
    console.log(document.getElementById("nombre").value)
    e.preventDefault();
    let id = document.getElementById("id");
    let nombre = document.getElementById("nombre");
    console.log(nombre.value);
    let apellido = document.getElementById("apellido");
    let edad = document.getElementById("edad");
    let alias = document.getElementById("alias");
    let avatar = document.getElementById("avatar");
    let mensaje = document.getElementById("mensaje");

    const newMessage = {
        autor: {
            id: id.value, 
            nombre: nombre.value, 
            apellido: apellido.value, 
            edad: edad.value, 
            alias: alias.value,
            avatar: avatar.value
        },
        mensaje: mensaje.value
    }
    console.log(newMessage);
    socket.emit("newMessage", newMessage);
    mensaje.value = "";
}

function displayMessages(messages) {
    const messagesTitle = `<h2 class="title">Mensajes</h2>`;
    const html = messages.map(message => {
        return(`<div style="margin: 5px;">
            <span style="font-size: 1.3rem; color: blue; font-weight: bold;">${message.autor.id}</span>
            <span style="font-size: 1.3rem; color: brown;">${message.autor.alias}</span>:
            <i style="font-size: 1.3rem; color: green;">${message.mensaje}</i> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = messagesTitle.concat(html);
}

socket.on("messages", messages => {
    displayMessages(messages);
});