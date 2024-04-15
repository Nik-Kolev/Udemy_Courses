const Product = require("../models/product");

exports.getAtProduct = (req, res) => {
  res.render("add-product", { pageTitle: "Add Product", path: "/admin/add-product", formsCSS: true, productCSS: true, activeAddProduct: true });
};

exports.postAddProduct = (req, res) => {
  console.log(req.body);
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop", { products, pageTitle: "Shop", path: "/", hasProducts: products.length > 0, activeShop: true, productCSS: true });
  });
};
