const express = require('express')
const adminController = require('../controller/adminController')
const { upload } = require("../middleware/imageUpload")
const router = express.Router()

router.get("/product",adminController.getProduct);

router.get("/expired_product",adminController.getExpiryProduct);

router.get("/stock_product",adminController.getStockFinish);

router.post("/product",upload.single('image'),adminController.addProduct);

router.post("/register",adminController.register);

router.post("/bill",adminController.addBill);

router.post("/view_bill",adminController.viewBill);

router.post("/change_password",adminController.changePassword);

router.put("/product",adminController.updateProduct);

router.delete("/product",adminController.deleteProduct);

module.exports = router