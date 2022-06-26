const Koa = require("koa");
const koaBody = require("koa-body");
const { conectarMongo } = require("./database/connect.mongo");
require("dotenv").config();

const app = new Koa();

conectarMongo(process.env.CONNECTION_STRING).then(() => console.log("Mongo connected!")).catch(err => console.log(err));

app.use(koaBody());

const products = require("./routes/products.routes");
app.use(products.routes()).use(products.allowedMethods());


const PORT = 8080;
const server = app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
server.on("error", error => console.log(`Error en servidor Koa: ${error}`));