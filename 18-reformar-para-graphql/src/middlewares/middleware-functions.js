const bCrypt = require("bcrypt");

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
function isValidPassword(usuario, password) {
    return bCrypt.compareSync(password, usuario.password)
}
function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/auth/login");
}

module.exports = { createHash, isValidPassword, isLogged };