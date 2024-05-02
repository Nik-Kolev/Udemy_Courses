const productModel = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    await productModel.create({ title, price, description, imageUrl, userId: req.user._id });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.productId;

    const product = await productModel.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const prodId = req.body.productId;
    await productModel.findByIdAndUpdate(prodId, { title, price, description, imageUrl });
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await productModel.findByIdAndDelete(prodId);
  res.redirect("/admin/products");
};
