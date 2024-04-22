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
    // const cartProduct = this.cart.items.findIndex((x) => {
    //   return x._id === product._id;
    // });

    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db.collection("users").updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
