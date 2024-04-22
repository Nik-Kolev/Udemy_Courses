const Product = require("../models/product");
const { where } = require("sequelize");

exports.getProducts = async (req, res, next) => {
  // try {
  //   // const products = await Product.findAll();
  //   res.render("shop/product-list", {
  //     prods: products,
  //     pageTitle: "All Products",
  //     path: "/products",
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.fetchOne(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCart().then((cart) => cart.getProducts());
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.fetchOne(prodId);
    console.log(req.user);
    const asd = await req.user.addToCart(product, req.user._id);
    // console.log(asd);
    //   const cart = await req.user.getCart();
    //   const product = (await cart.getProducts({ where: { id: prodId } }))[0];
    //   let prod;
    //   let qty;

    //   if (product) {
    //     [qty, prod] = [product.cartItem.quantity + 1, product];
    //   } else {
    //     [qty, prod] = [1, await Product.findByPk(prodId)];
    //   }
    //   await cart.addProduct(prod, { through: { quantity: qty } });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const product = (await cart.getProducts({ where: { id: prodId } }))[0];
    await product.cartItem.destroy();
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    await req.user.createOrder().then((order) => {
      order.addProducts(
        products.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    });
    await cart.setProducts(null);
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // fetches related products info instead it is just an id
    const orders = await req.user.getOrders({ include: ["products"] });
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
