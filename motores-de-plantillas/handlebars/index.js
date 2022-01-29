const express = require("express");
const app = express();
const productAPI = require("./productos");
const { ProductManagement } = productAPI;
const PORT = 8080;
const handlebars = require("express-handlebars");

const contenedor = new ProductManagement();
//PRODUCTOS DE EJEMPLO
/*contenedor.products = [
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
]*/

app.use(express.urlencoded({extended: true}));

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");


app.get("/", (req, res) => {
    res.render("main");
});

app.get("/productos", (req, res) => {
    const products = contenedor.getAll();
    let thereAreProducts;
    if (products.length == 0) {
        thereAreProducts = false;
    } else {
        thereAreProducts = true;
    }
    res.render("products", {
        products: products,
        thereAreProducts: thereAreProducts
    });
});

app.post("/productos", (req, res) => {
    const newProduct = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    }
    contenedor.save(newProduct);
    res.render("main");
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port`, PORT);
});
server.on("error", (error) => console.log(`error en el servidor ${error}`));    