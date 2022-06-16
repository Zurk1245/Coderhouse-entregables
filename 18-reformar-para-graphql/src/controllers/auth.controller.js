const passport = require('../services/auth.services');

const loginView = (req, res, next) => {
    try {
        res.render("login");
    } catch (error) {
        next(error)
    }
}

const loginVerify = (req, res, next) => {
    try {
        return passport.authenticate("login", {
            successRedirect: "/home",
            failureRedirect: "/login/error"
        })(req, res, next)
    } catch (error) {
        next(error)
    }
}

const loginError = (req, res, next) => {
    try {
        res.render("error-login");
    } catch (error) {
        next(error)
    }
}

const registerView = (req, res, next) => {
    try {
        res.render("registro");
    } catch (error) {
        next(error)
    }
}

const registerVerify = (req, res, next) => {
    try {
        return passport.authenticate("registro", {
            successRedirect: "/home",
            failureRedirect: "/auth/registro/error"
        })(req, res, next)
    } catch (error) {
        next(error)
    }
}

const registerError = (req, res, next) => {
    try {
        res.render("error-registro");
    } catch (error) {
        next(error)
    }
}

const logout = (req, res, next) => {
    try {
        res.render("logout", { username: req.user.username });
        req.logOut();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    loginView,
    loginVerify,
    loginError,
    registerView,
    registerVerify,
    registerError,
    logout
}