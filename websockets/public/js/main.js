const socket = io.connect();

function sendProduct(e) {
    e.preventDefault();
    const title = document.getElementById("title");
    const price = document.getElementById("price");
    const thumbnail = document.getElementById("thumbnail");
    console.log(title.value, price.value, thumbnail.value);
    const newProduct = {
        title: title.value,
        price: price.value,
        thumbnail: thumbnail.value
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
    })
});

function sendMessage(e) {
    e.preventDefault();
    const author = document.getElementById("author");
    let message = document.getElementById("message");
    const newMessage = {
        author: author.value,
        message: message.value,
        date: new Date().toLocaleString()
    }
    socket.emit("newMessage", newMessage);
    message.value = "";
}

function displayMessages(messages) {
    const messagesTitle = `<h2 class="title">Mensajes</h2>`;
    const html = messages.map(message => {
        
        return(`<div style="margin: 5px;">
            <span style="font-size: 1.3rem; color: blue; font-weight: bold;">${message.author}</span>
            <span style="font-size: 1.3rem; color: brown;">${message.date}</span>:
            <i style="font-size: 1.3rem; color: green;">${message.message}</i> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = messagesTitle.concat(html);
}

socket.on("messages", messages => {
    displayMessages(messages);
});

