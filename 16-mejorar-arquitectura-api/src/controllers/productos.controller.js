const productServices = require('../services/productos.services')
const { fork } = require("child_process");

const getAll = async (req, res, next) => {
    try {
        const productos = await productServices.getAll()
        res.json(productos)
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const product = await productServices.getById(req.params?.id)
        res.json(product)
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const result = await productServices.create(req.body)
        res.json(result)
    } catch (error) {
        next(error)
    }
}


const update = async (req, res, next) => {
    try {
        const newProduct = await productServices.update(req.params?.id, req.body)
        res.json(newProduct)
    } catch (error) {
        next(error)
    }
}


const remove = async (req, res, next) => {
    try {
        const result = await productServices.remove(req.params?.id)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const getRandoms = (req, res) => {
    try {
        let cantidadNumerosAleatorios = req.query.cant;
        if (!cantidadNumerosAleatorios) {
            cantidadNumerosAleatorios = 1000000;
        }
        //DESACTIVAR CHILD PROCESS DE LA RUTA RANDOMS
        /*
        const randoms = fork("api/randoms.js");
        randoms.send({cantidad: cantidadNumerosAleatorios});
        randoms.on("message", randomNumbers => {
            res.render("apiRandoms", { randomNumbers: randomNumbers, process_id: process.pid});
        })*/;
    } catch (error) {
        res.json({ error: error.message })
    }

}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getRandoms
}