const express = require('express')
const authController = require('../controller/authController')
const router = express.Router()

router.post("/signup",authController.signin);

router.get("/verify",authController.verify)

router.get("/logout",authController.logout);

module.exports = router