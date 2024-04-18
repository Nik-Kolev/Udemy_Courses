const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "ixl0lzstfu",
});

module.exports = pool.promise();
