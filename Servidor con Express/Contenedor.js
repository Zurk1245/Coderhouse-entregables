const fs = require('fs');

class Contenedor {

    constructor(archivo) {
        this.archivo = archivo;
    }

    async save(Object) {
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const parsedData = JSON.parse(data);
            Object.id = parsedData.length == 0 ? 1 : parsedData[parsedData.length - 1].id + 1;
            parsedData.push(Object);
            const stringifiedData = JSON.stringify(parsedData, null, '\t');
            await fs.promises.writeFile(this.archivo, stringifiedData);
            console.log(stringifiedData);
            return Object.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(Number) {
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const parsedData = JSON.parse(data);
            const desiredObject = parsedData.find(obj => obj.id == Number);
            console.log(desiredObject ? desiredObject : null);
            return desiredObject ? desiredObject : null; 
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const parsedData = JSON.parse(data);
            console.log(parsedData ? parsedData : null);
            return parsedData ? parsedData : null; 
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(Number) {
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const parsedData = JSON.parse(data);
            const desiredObjectPositionToDelete = parsedData.findIndex(object => object.id == Number);
            if (desiredObjectPositionToDelete === -1) {
                console.log('Id not found');
                return;
            } else {
                parsedData.splice(desiredObjectPositionToDelete, 1);
                const stringifiedData = JSON.stringify(parsedData);
                await fs.promises.writeFile(this.archivo, stringifiedData);
            }
        } catch (error) {
                console.log(error);
            }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.archivo, '[]');
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = { Contenedor };