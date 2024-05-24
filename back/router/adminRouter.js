const express = require('express')
const adminController = require('../controller/adminController')
const router = express.Router()

router.get("/admin_count",adminController.getAdminCount);
router.get("/cashier_count",adminController.getCashierCount);
router.get("/inventory_count",adminController.getInventoryCount);
router.get("/product_count",adminController.getProductCount);
router.get("/bill_count",adminController.getBillCount);

router.get("/product",adminController.getProduct);

router.get("/expired_product",adminController.getExpiryProduct);

router.get("/stock_product",adminController.getStockFinish);

router.post("/product",adminController.addProduct);

router.post("/register",adminController.register);

router.get("/user",adminController.getUser);

router.post("/bill",adminController.addBill);

router.post("/view_bill",adminController.viewBill);

router.post("/change_password",adminController.changePassword);

router.put("/product",adminController.updateProduct);

router.delete("/product",adminController.deleteProduct);

module.exports = router