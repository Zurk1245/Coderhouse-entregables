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
        // USAR MENSAJE-DTO
        let elementoParaAgregar = new MensajeModel(mensaje);
        await elementoParaAgregar.save();
        return elementoParaAgregar;
    }

    async getMessages() {
        // USAR MENSAJE-DTO
        const mensajes = await MensajeModel.find();
        return mensajes;
    }
}

module.exports = MongoDbDAO;