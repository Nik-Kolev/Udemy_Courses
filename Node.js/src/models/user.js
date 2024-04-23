const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product, id) {
    const cartProductIndex = this.cart.items.findIndex((x) => {
      return x.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };

    const db = getDb();
    return db.collection("users").updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { cart: updatedCart } });
  }

  getCart = async () => {
    const db = getDb();
    const productIds = this.cart.items.map((x) => x.productId);
    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();
    return products.map((product) => {
      const { quantity } = this.cart.items.find((item) => item.productId.toString() == product._id.toString());
      return { ...product, quantity };
    });
  };

  deleteItemFromCart(id) {
    const db = getDb();
    const updatedItems = this.cart.items.filter((x) => x.productId.toString() !== id.toString());
    return db.collection("users").updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: updatedItems } } });
  }

  addOrder = async () => {
    const db = getDb();
    const cart = await this.getCart();
    const order = {
      items: cart,
      user: {
        _id: new mongodb.ObjectId(this._id),
        name: this.username,
      },
    };
    return db
      .collection("orders")
      .insertOne(order)
      .then(() => {
        this.cart = { items: [] };
        return db.collection("users").updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
      });
  };

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
