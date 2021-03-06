const { Schema, model } = require('mongoose');

const productoSchema = new Schema({
    nombre: {
        type: String,
        //required: true,
    },
    precio: {
        type: String,
        //required: true
    },
    foto: {
        type: String,
        //required: true
    }
});

const ProductoModel = model('productos', productoSchema, "productos");

module.exports = ProductoModel;