const express = require("express");

const adminController = require("../controllers/admin");
const { body } = require("express-validator");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [body("title").isString().isLength({ min: 3 }).trim(), body("price").isFloat(), body("description").trim().isLength({ min: 5, max: 200 })],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [body("title").isString().isLength({ min: 3 }).trim(), body("price").isFloat(), body("description").trim().isLength({ min: 5, max: 200 })],
  isAuth,
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
