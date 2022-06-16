const express = require("express");
const router = express.Router();

const authController = require('../../controllers/auth.controller')

// LOGIN
router.get("/login", authController.loginView);
router.post("/login", authController.loginVerify);
router.get("/login/error", authController.loginError);

//registro
router.get("/registro", authController.registerView);
router.post("/registro", authController.registerVerify);
router.get("/registro/error", authController.registerError);

// LOGOUT
router.post("/logout", authController.logout);

module.exports = router;