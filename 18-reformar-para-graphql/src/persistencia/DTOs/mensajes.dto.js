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

    set apellido(apellido) {
        this.apellido = apellido;
    }

    get edad() {
        return this.autor.edad;
    }

    set edad(edad) {
        this.autor.edad = edad;
    }

    get avatar() {
        return this.autor.avatar;
    }

    set avatar(avatar) {
        this.autor.avatar = avatar;
    }

    get alias() {
        return this.autor.alias;
    }

    set alias(alias) {
        this.autor.alias = alias;
    }
}

module.exports = MensajesDTO;