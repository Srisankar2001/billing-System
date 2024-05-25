const express = require('express')
const productController = require('../controller/productController')
const { upload } = require("../middleware/imageUpload")
const router = express.Router()

router.get("/count",productController.getProductCount);

router.get("/all",productController.getAllProduct);

router.get("/expired",productController.getExpiryProduct);

router.get("/finished",productController.getStockFinish);

router.post("/add",upload.single('image'),productController.addProduct);

router.post("/get",productController.getProduct);

router.put("/update",productController.updateProduct);

router.delete("/delete",productController.deleteProduct);

module.exports = router