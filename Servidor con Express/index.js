const express = require('express');
const fs = require('fs');
const ContenedorFile = require('./Contenedor');
const { Contenedor } = ContenedorFile;

const app = express();
const PORT = 8080;
const contenedor1 = new Contenedor('./productos.txt');


app.get('/', (req, res) => {
    res.send('Hola! Visite la ruta /productos o la ruta /productoRandom');
});

app.get('/productos', (req, res) => {
    contenedor1.getAll()
    .then(result => {
        res.send([result]);
    })
    .catch(err => {
        console.log(err);
    });
});

app.get('/productoRandom', (req, res) => {
    const data = fs.readFileSync(contenedor1.archivo, 'utf-8');
    const parsedData = JSON.parse(data);
    const randonNumber = Math.floor(Math.random() * parsedData.length) + 1;  
    contenedor1.getById(randonNumber)
    .then(result => {
        res.send({Producto_random: result});
    })
    .catch(err => {
        console.log(err);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
