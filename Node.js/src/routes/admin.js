const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAtProduct);

router.get("/products", adminController.getAtProducts);

router.post("/add-product", adminController.postAddProduct);

module.exports = router;
