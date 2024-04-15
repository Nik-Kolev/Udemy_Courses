const express = require("express");

const productController = require("../controllers/products");

const router = express.Router();

router.get("/add-product", productController.getAtProduct);
router.post("/add-product", productController.postAddProduct);

module.exports = router;
