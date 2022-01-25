const express = require('express');
const app = express();
const productAPI = require('./api/productos');
const { ProductManagement } = productAPI;
const PORT = 8080;

const productos = express.Router();
app.use('/api/productos', productos);
productos.use(express.json());
productos.use(express.urlencoded({extended: true}));

const contenedor =  new ProductManagement();
contenedor.products = [
    {
		title: "Manzana",
		price: "20",
		thumbnail: "https://cdn4.iconfinder.com/data/icons/fruits-79/48/04-apple-256.png",
		id: 1
	},
	{
		title: "Naranja",
		price: "10",
		thumbnail: "https://cdn1.iconfinder.com/data/icons/food-3-11/128/food_Orange-Citrus-Juice-Fruit-2-256.png",
		id: 2
	}
]

productos
    .route('/')
    .get((req, res) => {
        res.send(contenedor.products);
    })
    .post((req, res) => {
        const newProduct = {
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        }
        contenedor.save(newProduct);
        res.send(newProduct);
    });

productos
    .route('/:id')
    .get((req, res) => {
        //console.log(req.params.id);
        const id = req.params.id;
        const desiredProduct = contenedor.products.find(product => product.id == id);
        if (desiredProduct) {
            res.send(desiredProduct);
        } else {
            res.send({ error : 'producto no encontrado' });
        }
    })
    .put((req, res) => {
        const id = req.params.id;
        const productToUpdate = contenedor.products.find(product => product.id == id);
        if (productToUpdate) {
            const newTitle = req.body.title;
            const newPrice = req.body.price;
            const newThumbnail = req.body.thumbnail;
            contenedor.updateById(newTitle, newPrice, newThumbnail, id);    
            res.send(`Producto ${id} actualizado`);
        } else {
            res.send({ error : 'producto a actualizar no encontrado' });
        }
    })
    .delete((req, res) => {
        const id = req.params.id;
        const productToDelete = contenedor.products.find(product => product.id == id);
        if (productToDelete) {
            contenedor.deleteById(id);
            res.send(`Producto ${id} eliminado`);
        } else {
            res.send({ error : 'producto a eliminar no encontrado' });
        }
    });

productos.use('/static', express.static('public'));


const server = app.listen(PORT, () => {
    console.log(`Server live at port`, PORT);
});
server.on("error", (error) => console.log(`error en el servidor ${error}`));