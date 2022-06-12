const axios = require("axios");
const logger = require("../config/logger");

async function getProducts() {
    try {
        const response = await axios.get("http://localhost:8080/api/productos");
        console.log(response.data);
        return;
    } catch (error) {
        logger.error(error);
    }
}

async function createProduct(requestProductBody) {
    try {
        const response = await axios.post("http://localhost:8080/api/productos", requestProductBody);
        console.log(response.data);
        return;
    } catch (error) {
        logger.error(error);
    }
}

async function updateProduct(productName, updatedProduct) {
    try {
        const response = await axios.put(`http://localhost:8080/api/productos/${productName}`, updatedProduct);
        console.log(`Producto ${productName} actualizado!`);
        //console.log(response.data);
        return;
    } catch (error) {
        logger.error(error);
    }
}

async function deleteProduct(productName) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/productos/${productName}`);
        console.log(response.data);
        return;
    } catch (error) {
        logger.error(error);
    }
}

(async function() {
    try {
        await getProducts();

        let productSample = {
            nombre: "Pera",
            precio: 10,
            foto: "https://cdn0.iconfinder.com/data/icons/fruity-3/512/Pear-256.png"
        }
        await createProduct(productSample);
        
        await getProducts();
        
        await getProducts();
        
        let updatedProduct = {
            precio: 200
        }
        await updateProduct("Pera", updatedProduct);
        
        await getProducts();
        
        await deleteProduct("Pera");
        
        await getProducts();   
    } catch (error) {
        logger.error(error);
    }
})();

