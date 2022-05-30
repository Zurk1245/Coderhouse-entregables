const express = require("express");
const { isLogged } = require("../middlewares/middleware-functions");
const passport = require('passport');
const authRouter = express.Router();

/*============================[Routes]============================*/

/*----------- Index -----------*/
authRouter.get("/", isLogged, (req, res) => {
    res.redirect("/home");
});

/*----------- Login -----------*/
authRouter.get("/login", (req, res) => {
    res.render("login");
});
authRouter.post("/login", passport.authenticate("login", { failureRedirect: "/login/error" }), (req, res) => {
    res.redirect("/home");
});
authRouter.get("/login/error", (req, res) => {
    res.render("error-login");
});


/*----------- Registro -----------*/
authRouter.get("/registro", (req, res) => {
    res.render("registro");
});
authRouter.post("/registro", passport.authenticate("registro", { failureRedirect: "/registro/error" }), (req, res) => {
    res.redirect("/home");
});
authRouter.get("/registro/error", (req, res) => {
    res.render("error-registro");
});


/*----------- Logout -----------*/
authRouter.post("/logout", async (req, res) => {
    res.render("logout", { username: req.user.username });
    req.logOut();
});

module.exports = authRouter;