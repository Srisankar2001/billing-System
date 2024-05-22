const express = require('express')
const cashierController = require('../controller/cashierController')
const { upload } = require("../middleware/imageUpload")
const router = express.Router()

router.get("/product",cashierController.getProduct);

router.post("/bill",cashierController.addBill);

router.post("/view_bill",cashierController.viewBill);

router.post("/change_password",cashierController.changePassword);

module.exports = router