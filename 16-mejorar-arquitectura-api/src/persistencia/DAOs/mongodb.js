const mongoose = require('mongoose');
const MensajeModel = require('./models/mensaje-model');
const ProductoModel = require('./models/producto-model');
const logger = require("../../config/logger");

class MongodbDAO {

    constructor(config) {
        this.config = config;
    }

    /* PRODUCTOS */

    async createProductsTableInDataBase() {
        try {
            console.log("Servicio para crear tabla de productos no implementado para la base de datos seleccionada");
            return;
        } catch (error) {
            logger.error(error);
        }
    }

    async saveProduct(product) {
        try {
           console.log("Servicio para guardar productos no implementado para la base de datos seleccionada");
           return;
        } catch (error) {
            logger.error(`Error: ${error}`);
        }
    }

    async getProducts() {
        try {
           console.log("Servicio para obtener productos no implementado para la base de datos seleccionada");
           return;
        } catch (error) {
            logger.error(`Error: ${error}`);
        }
    }

    /* MENSAJES */

    async saveMessage(mensaje) {
        try {
            await mongoose.connect(this.config.cnxStr);
            let elementoParaAgregar = new MensajeModel(mensaje);
            await elementoParaAgregar.save();

            const result = `Mensaje agregado con el id ${elementoParaAgregar._id}`;
            return result;
        } catch (error) {
            logger.error(`Error: ${error}`);
        }
    }

    async getMessages() {
        try {
            await mongoose.connect(this.config.cnxStr);
            const mensajes = await MensajeModel.find();
            return mensajes;
        } catch (error) {
            logger.error(`Error: ${error}`);
        } 
    }
}

module.exports = MongodbDAO;