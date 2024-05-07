const productModel = require("../models/product");
const orderModel = require("../models/order");
const fs = require("fs");
const path = require("path");
const pdfKit = require("pdfkit");

exports.getProducts = async (req, res, next) => {
  try {
    // we can select some stuff and not everything or exclude something
    // const products = await productModel.find().select("title price -_id").populate("userId", "name");
    const products = await productModel.find().populate("userId");
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await productModel.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = (await req.user.populate("cart.items.productId")).cart.items;
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await productModel.findById(prodId);
    await req.user.addToCart(product);
    res.redirect("/cart");
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await req.user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const products = (await req.user.populate("cart.items.productId")).cart.items.map((item) => {
      // spreading the product and adding._doc populates the data and instead of product Id only we get the full data
      // .toObject() doesn`t bypass the schema and getters/setters -> its better
      return { quantity: item.quantity, product: item.productId.toObject() };
    });

    const order = new orderModel({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    next(new Error(err, 500));
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return next(new Error("No order found!"));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      console.log("asd");
      return next(new Error("Unauthorized"));
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    // const invoiceName = "CV.pdf"; //for testing as manually created pdf does not work properly
    const invoicePath = path.join("src", "invoices", invoiceName);

    // PDF kit creates pdf document, we pipe it to save it if needed - otherwise remove the line, pipe again to the response, write stuff inside and end the stream
    // We pipe to the response before writing something in order to immediately start sending the pdf file to the user, even before it being fully generated
    const pdfDoc = new pdfKit();
    res.setHeader("Content-Type", "Application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    // Course PDF
    // pdfDoc.fontSize(26).text("Invoice", { underline: true });
    // pdfDoc.text("--------------");

    // let totalPrice = 0;
    // order.products.forEach((x) => {
    //   totalPrice += x.quantity * x.product.price;
    //   pdfDoc.fontSize(14).text(x.product.title + " - " + x.quantity + " x " + "$" + x.product.price);
    // });

    // pdfDoc.text("--------------");
    // pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

    //Random PDF
    pdfDoc.fontSize(20).text("Invoice", { align: "center" }).moveDown();

    pdfDoc
      .fontSize(12)
      .text("Invoice Date: " + new Date().toDateString())
      .moveDown();

    pdfDoc.moveDown();
    pdfDoc.fontSize(16).text("Products", { underline: true }).moveDown();

    pdfDoc.fontSize(12).text("Title", { width: 200, align: "left" });
    pdfDoc.text("Quantity", { width: 100, align: "left" });
    pdfDoc.text("Price", { width: 100, align: "left" });
    pdfDoc.moveDown();

    let totalPrice = 0;
    order.products.forEach((x) => {
      totalPrice += x.quantity * x.product.price;
      pdfDoc.fontSize(10).text(x.product.title, { width: 200, align: "left" });
      pdfDoc.text(x.quantity.toString(), { width: 100, align: "left" });
      pdfDoc.text("$" + x.product.price.toFixed(2), { width: 100, align: "left" });
      pdfDoc.moveDown();
    });

    pdfDoc.text("Total Price: $" + totalPrice.toFixed(2)).moveDown();

    pdfDoc.end();
    // Below code works good for small files, but with large ones it will use lots of memory on the server and we wont be able to serve other users
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "Application/pdf");
    //   res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
    //   res.send(data);
    // });
    // Below is data streaming with static files
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader("Content-Type", "Application/pdf");
    // res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
    // file.pipe(res);
  } catch (err) {
    console.log(err);
    next(new Error(err, 500));
  }
};
