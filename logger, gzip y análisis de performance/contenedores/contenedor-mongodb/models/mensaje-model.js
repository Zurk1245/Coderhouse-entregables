const { Schema, model } = require('mongoose');

const mensajeSchema = new Schema({
    autor: {
        type: Object,
        required: true,
        id: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        apellido: {
            type: String,
            required: true
        },
        edad: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    },
    mensaje: {
        type: String,
        required: true
    }
});

const MensajeModel = model('Mensaje', mensajeSchema);

module.exports = MensajeModel;