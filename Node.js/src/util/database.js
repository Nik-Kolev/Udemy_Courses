const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

async function mongoConnect() {
  try {
    const connect = await MongoClient.connect("mongodb+srv://nik:ixl0lzstfu@atlascluster.37xqvmk.mongodb.net/");
    _db = connect.db("nodeUdemy");
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

module.exports = {
  mongoConnect,
  getDb,
};
