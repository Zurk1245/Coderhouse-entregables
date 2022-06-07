class MensajesDTO {
    constructor(autor, mensaje) {
        this.autor = {
            id: autor.id,
            nombre: autor.nombre,
            apellido: autor.apellido,
            edad: autor.edad,
            avatar: autor.avatar,
            alias: autor.alias
        }
        this.mensaje = mensaje;
    }

    /**
     * TODO: se puede implemtar metodos GET y SET para cada atributo
     */
    get id() {
        return this.autor.id;
    }

    set id(id) {
        this.autor.id = id;
    }

    get nombre() {
        return this.autor.nombre;
    }

    set nombre(nombre) {
        this.autor.nombre = nombre;
    }

    get apellido() {
        return this.autor.apellido;
    }

    get edad() {
        return this.autor.edad;
    }

    get avatar() {
        return this.autor.avatar;
    }

    get alias() {
        return this.autor.alias;
    }
}

module.exports = MensajesDTO;