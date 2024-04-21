// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("node-complete", "root", "ixl0lzstfu", {
//   dialect: "mysql",
//   host: "localhost",
//   logging: false,
// });

// // logging: false - stops the terminal spam with messages

// module.exports = sequelize;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

async function connect(client) {
  try {
    const connect = await MongoClient.connect("mongodb+srv://nik:ixl0lzstfu@atlascluster.37xqvmk.mongodb.net/");
    client(connect);
  } catch (err) {
    console.log(err);
  }
}

module.exports = connect;
