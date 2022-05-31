const socket = io.connect();

function sendProduct(e) {
    e.preventDefault();
    let nombre = document.getElementById("nombre");
    let precio = document.getElementById("precio");
    let foto = document.getElementById("foto");
    let newProduct = {
        nombre: nombre.value,
        precio: precio.value,
        foto: foto.value
    }
    socket.emit("newProduct", newProduct);
    return;
}

async function htmlTable(products) {
    return fetch('./views/products-table.hbs')
        .then(result => result.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ products });
            return html;
        })
}

socket.on("products", async products => {
    const html = await htmlTable(products);
    document.getElementById('products').innerHTML = html;
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
    socket.emit("newMessage", newMessage);
    mensaje.value = "";
}

function displayMessages(messages, compr) {
    if (!messages) {
        return;
    }
    const messagesTitle = `<h4 class="title">Mensajes - Compresión: ${compr}%</h4>`;
    const html = Object.values(messages).map(message => {
        return(`<div style="margin: 5px;">
            <span style="font-size: 1.3rem; color: blue; font-weight: bold;">${message._doc.autor.id}</span>
            <span style="font-size: 1.3rem; color: brown;">${message._doc.autor.alias}</span>
            <i style="font-size: 1.3rem; color: green;">${message._doc.autor.apellido}</i>
            <span style="font-size: 1.3rem; color: purple; font-weight: bold;">${message._doc.autor.avatar}</span>:
            <i style="font-size: 1.3rem; color: white;">${message._doc.mensaje}</i> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = messagesTitle.concat(html);
}

socket.on("messages", (messages, normalizedLength) => {
    const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
    const schemaMensaje = new normalizr.schema.Entity('mensaje', { author: schemaAuthor }, { idAttribute: '_id' })
    const schemaMensajes = new normalizr.schema.Entity('mensajes', { mensajes: [schemaMensaje] }, { idAttribute: '_id' })
    const denormalizedMessages = normalizr.denormalize(messages, schemaMensajes);
    
    const denormalizedLength = JSON.stringify(denormalizedMessages).length;
    const compr = Math.round((1 - denormalizedLength / normalizedLength) * 100);
    displayMessages(denormalizedMessages.mensaje, compr);
});