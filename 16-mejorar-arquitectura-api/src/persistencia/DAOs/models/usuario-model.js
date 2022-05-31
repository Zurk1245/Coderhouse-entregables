const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }

});

const UsuarioModel = model('Usuario', usuarioSchema);

module.exports = UsuarioModel;