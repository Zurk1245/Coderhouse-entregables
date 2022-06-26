const ProductoModel = require("../database/models/product.model");

module.exports = class ProductsController {
    static async list(ctx) {
        try {
            let products = await ProductoModel.find();
            return ctx.body = products;
        } catch (error) {
            console.log(error);
        }
    }

    static async create(ctx) {
        try {
            const newProduct = {
                nombre: ctx.request.body.nombre,
                precio: ctx.request.body.precio,
                foto: ctx.request.body.foto
            }
            const addedProduct = await ProductoModel.create(newProduct);
            ctx.body = `Producto ${ctx.request.body.nombre} agregado con id ${addedProduct._id}`;
            return    
        } catch (error) {
            console.log(error);
        }
    }

    static async update(ctx) {
        try {
            await ProductoModel.updateOne({_id: ctx.params.id}, ctx.request.body);
            return ctx.body = `Producto con id ${ctx.params.id} actualizado!`;
        } catch (error) {
            console.log(error);
        }
    }

    static async delete(ctx) {
         try {
            await ProductoModel.deleteOne({_id: ctx.params.id});
            ctx.body = `Producto con id ${ctx.params.id} eliminado!`;   
        } catch (error) {
            console.log(error);
        }
    }
}