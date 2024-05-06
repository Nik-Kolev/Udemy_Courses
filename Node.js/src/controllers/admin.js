const productModel = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: { title, price, description, imageUrl },
        hasError: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }
    await productModel.create({ title, price, description, imageUrl, userId: req.user._id });
    res.redirect("/");
  } catch (err) {
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
    //short version:
    next(new Error(err, 500));
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
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const prodId = req.body.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        product: { title, price, description, imageUrl, _id: prodId },
        hasError: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }
    const product = await productModel.findOneAndUpdate({ _id: prodId, userId: req.user._id }, { title, price, description, imageUrl }, { new: true });
    if (product) {
      return res.redirect("/");
    }
    res.redirect("/admin/products");
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productModel.find({ userId: req.user._id });
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await productModel.findOneAndDelete({ _id: prodId, userId: req.user._id });
  res.redirect("/admin/products");
};
