const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, price, description);
    await product.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

// exports.getEditProduct = async (req, res, next) => {
//   try {
//     const editMode = req.query.edit;
//     if (!editMode) {
//       return res.redirect("/");
//     }
//     const prodId = req.params.productId;
//     // const product = await Product.findByPk(prodId);
//     const product = await req.user.getProducts({ where: { id: prodId } });
//     // can use getProduct on the user - works the same way as findByPk
//     if (!product) {
//       return res.redirect("/");
//     }
//     res.render("admin/edit-product", {
//       pageTitle: "Edit Product",
//       path: "/admin/edit-product",
//       editing: editMode,
//       product: product[0],
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.postEditProduct = async (req, res, next) => {
//   try {
//     const { title, imageUrl, description, price } = req.body;
//     const prodId = req.body.productId;
//     await Product.update({ title, imageUrl, description, price }, { where: { id: prodId } });
//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    // const products = await req.user.getProducts();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.postDeleteProduct = async (req, res, next) => {
//   const prodId = req.body.productId;
//   await Product.destroy({ where: { id: prodId } });
//   res.redirect("/admin/products");
// };
