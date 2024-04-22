const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, imageUrl, price, description, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchOne(id) {
    const db = getDb();
    return db.collection("products").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static deleteOne(id) {
    const db = getDb();
    return db.collection("products").deleteOne({ _id: new mongodb.ObjectId(id) });
  }

  static updateOne(id, data) {
    const db = getDb();
    return db.collection("products").updateOne({ _id: new mongodb.ObjectId(id) }, { $set: data });
  }
}

module.exports = Product;
