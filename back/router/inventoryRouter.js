const express = require('express')
const inventoryController = require('../controller/inventoryController')
const { upload } = require("../middleware/imageUpload")
const router = express.Router()

router.get("/product",inventoryController.getProduct);

router.get("/expired_product",inventoryController.getExpiryProduct);

router.get("/stock_product",inventoryController.getStockFinish);

router.post("/product",upload.single('image'),inventoryController.addProduct);

router.post("/change_password",inventoryController.changePassword);

router.put("/product",inventoryController.updateProduct);

router.delete("/product",inventoryController.deleteProduct);

module.exports = router