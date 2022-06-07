const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { createHash, isValidPassword } = require("../middlewares/middleware-functions");
const UsuarioModel = require("../persistencia/models/usuario-model");

// login
passport.use("login", new LocalStrategy((username, password, done) => {
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
}))

// registro
passport.use("registro", new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
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
}))

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    UsuarioModel.findById(id, done);
});

module.exports = passport;