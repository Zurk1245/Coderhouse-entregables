const LocalStrategy = require('passport-local').Strategy;
const config = require("../logica-negocio/config");
const MONGO_URL = config.mongodbRemote.cnxStr;
const { createHash, isValidPassword } = require("./middleware-functions");
const mongoose = require("mongoose");
const UsuarioModel = require("../persistencia/contenedores/contenedor-mongodb/models/usuario-model");

/*----------- Strategies -----------*/
const loginStrategy = new LocalStrategy(async (username, password, done) => {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log(error);        
    }
    UsuarioModel.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            console.log(`Usuario no encontrado con el username ${username}`);
            return done(null, false);
        }
        if (!isValidPassword(user, password)) {
            console.log("Contraseña invalida");
            return done(null, false);
        }
        return done(null, user);
    })
})
const registroStrategy =  new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log(error);        
    }
    UsuarioModel.findOne({ username }, (err, user) => {
        if (err) {
            console.log(`Error en el registro: ${err}`);
            return done(err);
        }
        if (user) {
            console.log("El usuario ya está registrado");
            return done(null, false);
        }
        const newUser = {
            username,
            password: createHash(password)
        }
        UsuarioModel.create(newUser, (err, userWithId) => {
            if (err) {
                console.log(`Error registrando al usuario: ${err}`);
                done(err);
            }
            console.log(userWithId);
            console.log("Registro exitoso");
            done(null, userWithId);
        });
    })
})


module.exports = { loginStrategy, registroStrategy };