const Product = require("../models/product");

exports.getAtProduct = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product", path: "/admin/add-product", formsCSS: true, productCSS: true, activeAddProduct: true });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.getAtProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", { products, pageTitle: "Admin Products", path: "/admin/products" });
  });
};
