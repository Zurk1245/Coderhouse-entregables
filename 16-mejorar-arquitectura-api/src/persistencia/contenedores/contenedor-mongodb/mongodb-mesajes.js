const mongoose = require('mongoose');
const MensajeModel = require('./models/mensaje-model');
const logger = require("../../../config/logger");

class ContenedorMongoDB {

    constructor(config) {
        this.config = config;
    }

    async save(mensaje) {
        try {
            await mongoose.connect(this.config.cnxStr);
            let elementoParaAgregar = new MensajeModel(mensaje);
            await elementoParaAgregar.save();

            const result = `Mensaje agregado con el id ${elementoParaAgregar._id}`;
            return result;
        } catch (error) {
            logger.error(`Error: ${error}`);
        } /*finally {
            mongoose.disconnect().catch((error) => {
                console.error(error);
            })
        }*/
    }

    async getAll() {
        try {
            await mongoose.connect(this.config.cnxStr);
            const mensajes = await MensajeModel.find();
            return mensajes;
        } catch (error) {
            logger.error(`Error: ${error}`);
        } /*finally {
            mongoose.disconnect().catch((error) => {
                console.error(error);
            })
        }*/
    }
}

module.exports = ContenedorMongoDB;