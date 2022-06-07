const MensajeModel = require('../../models/mensaje-model');

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
        let elementoParaAgregar = new MensajeModel(mensaje);
        await elementoParaAgregar.save();
        return elementoParaAgregar;
    }

    async getMessages() {
        const mensajes = await MensajeModel.find();
        return mensajes;
    }
}

module.exports = MongoDbDAO;