const Router = require("koa-router");
const ProductsController = require("../controllers/products.controller");

const router = new Router({
    prefix: "/productos"
});

router
    .get("/", ProductsController.list)  
    .post("/", ProductsController.create)
    .put("/:id", ProductsController.update)
    .delete("/:id", ProductsController.delete); 

module.exports = router;