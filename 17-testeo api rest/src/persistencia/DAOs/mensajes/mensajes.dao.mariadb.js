const { mariaDBOptions } = require("../../../config/mariaDB");
const knex = require("knex")(mariaDBOptions);
const MensajesDTO = require('../../DTOs/mensajes.dto')

let instance = null;

class MariadbDAO {
    constructor() {
        this.tableName = "mensajes";
        this.createMessagesTableInDataBase()
    }

    /* PATRÓN SINGLETON */
    static getInstance() {
        if (!instance) {
            instance = new MariadbDAO();
        }
        return instance;
    }

    async createMessagesTableInDataBase() {
        await knex.schema
            .dropTableIfExists(this.tableName)
            .createTable(this.tableName, table => {
                table.increments('id').primary()
                table.string("email")
                table.string('nombre').notNullable()
                table.string('apellido')
                table.string('edad')
                table.string('alias')
                table.string('avatar')
                table.string('mensaje')
            });
    }

    async saveMessages(mensaje) {
        const messageDTO = new MensajesDTO(mensaje.autor, mensaje.mensaje);
        const messageToMariaDb = {
            email: messageDTO.id,
            nombre: messageDTO.nombre,
            apellido: messageDTO.apellido,
            edad: messageDTO.edad,
            alias: messageDTO.alias,
            avatar: messageDTO.avatar,
            mensaje: messageDTO.mensaje
        }
        const result = await knex(this.tableName).insert(messageToMariaDb);
        return result;
    }

    async getMessages() {
        const mensajes = await knex.select("*").from(this.tableName);
        let mensajesFinales = [];
        for (let i = 0; i < mensajes.length; i++) {
            let autor = {
                id: mensajes[i].email,
                nombre: mensajes[i].nombre,
                apellido: mensajes[i].apellido,
                alias: mensajes[i].alias,
                avatar: mensajes[i].avatar,
                mensaje: mensajes[i].mensaje
            }
            let mensaje = new MensajesDTO(autor, mensajes[i].mensaje);
            mensajesFinales.push(mensaje);
        }
        const result = Object.values(JSON.parse(JSON.stringify(mensajesFinales)));
        return result;
    }

}

module.exports = MariadbDAO;