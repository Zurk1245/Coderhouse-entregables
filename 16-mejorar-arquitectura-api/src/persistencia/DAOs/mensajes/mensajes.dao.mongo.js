const MensajeModel = require('../../models/mensaje-model');
const MensajesDTO = require("../../DTOs/mensajes.dto");

let instance = null;

class MongoDbDAO {

    constructor() {}

    /* PATRÓN SINGLETON */
    static getInstance() {
        if (!instance) {
            instance = new MongoDbDAO();
        }
        return instance;
    }

    async saveMessages(mensaje) {
        const newMessage = new MensajesDTO(mensaje.autor, mensaje.mensaje)
        let elementoParaAgregar = new MensajeModel(newMessage);
        await elementoParaAgregar.save();
        return elementoParaAgregar;
    }

    async getMessages() {
        const mensajes = await MensajeModel.find();
        let mensajesFinales = [];
        for (let i = 0; i < mensajes.length; i++) {
            let autor = {
                id: mensajes[i].autor.id,
                nombre: mensajes[i].autor.nombre,
                apellido: mensajes[i].autor.apellido,
                edad: mensajes[i].autor.edad,
                alias: mensajes[i].autor.alias,
                avatar: mensajes[i].autor.avatar
            }
            let nuevoProducto = new MensajesDTO(autor, mensajes[i].mensaje);
            mensajesFinales.push(nuevoProducto);
        }
        return mensajesFinales;
    }
}

module.exports = MongoDbDAO;