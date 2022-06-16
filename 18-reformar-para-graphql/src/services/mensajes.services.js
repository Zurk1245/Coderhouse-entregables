const config = require('../config/config')
const MensajesDAO = require('../persistencia/DAOs/mensajes/factory').useDatabase(config.PERSISTENCIA)

const getAll = async () => {
    const mensajes = await MensajesDAO.getMessages()
    return mensajes
}

const create = async (mensaje) => {
    const newMessage = await MensajesDAO.saveMessages(mensaje)
    return newMessage
}

module.exports = {
    getAll,
    create
}