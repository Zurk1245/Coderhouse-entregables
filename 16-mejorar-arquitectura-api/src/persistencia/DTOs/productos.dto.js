class ProductosDTO {
    constructor(nombre, precio, foto) {
        //this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.foto = foto
    }

    /**
     * TODO: se puede implemtar metodos GET y SET para cada atributo
     */
    /*
    get nombre() {
        return this.nombre;
    }   

    set nombre(nombre) {
        this.nombre = nombre;
    }

    get precio() {
        return this.precio;
    }

    set precio(precio) {
        this.precio = precio;
    } 

    get foto() {
        return this.foto;
    }

    set foto(foto) {
        this.foto = foto;
    }*/
}

module.exports = ProductosDTO;