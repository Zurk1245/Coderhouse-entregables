class ProductManagement {
    constructor() {
        this.products = []
    }

    save(product) {
        product.id = this.products.length == 0 ? 1 : this.products[this.products.length - 1].id + 1;
        this.products.push(product);
        return product;
    }

    getById(id) {
        return this.products[id];
    }

    getAll() {
        return this.products;
    }

    updateById(newTitle, newPrice, newThumbnail, id) {
        const productToUpdate = this.products.find(obj => obj.id == id);
        productToUpdate.title = newTitle;
        productToUpdate.price = newPrice;
        productToUpdate.thumbnail = newThumbnail;
    }

    deleteById(id) {
        const productToDelete = this.products.find(obj => obj.id == id);
        const productToDeletePosition = this.products.indexOf(productToDelete);
        this.products.splice(productToDeletePosition, 1);
    }         
}

module.exports = { ProductManagement };