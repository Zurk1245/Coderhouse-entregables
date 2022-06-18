const config = require('../../config/config');
const logger = require('../../config/logger');
const MensajesDAO = require('../../persistencia/DAOs/mensajes/factory').useDatabase(config.PERSISTENCIA);

const getAll = async () => {
    try {
        const mensajes = await MensajesDAO.getMessages();
        return mensajes;   
    } catch (error) {
        logger.error(error);
    }
}

const create = async ({ mensaje }) => {
    try {
        const newMessage = await MensajesDAO.saveMessages(mensaje);
        const mensajeAdaptado = {
            id: newMessage.autor.id,
            nombre: newMessage.autor.nombre,
            apellido: newMessage.autor.apellido,
            edad: newMessage.autor.edad,
            alias: newMessage.autor.alias,
            avatar: newMessage.autor.avatar,
            mensaje: newMessage.mensaje
        }
        return mensajeAdaptado;   
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    getAll,
    create
}