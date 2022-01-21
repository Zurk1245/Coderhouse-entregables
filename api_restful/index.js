const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/', (req, res) => {
    res.send({message: 'Hello world!'});
});

app.get('/api/productos', (req, res) => {
    res.send({});
});

app.get('/api/productos/:id', (req, res) => {
    console.log('hola');
    //console.log(req);
    res.send({Id: req.params.id});
});

app.post('/api/productos', (req, res) => {
    res.send({});
});

app.put('/api/productos/:id', (req, res) => {
    res.send({});
});

app.delete('/api/productos/:id', (req, res) => {
    res.send({})
});





app.listen(PORT, () => {
    console.log(`Server live at port`, PORT);
});