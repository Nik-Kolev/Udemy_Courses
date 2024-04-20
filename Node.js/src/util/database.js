const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "ixl0lzstfu", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

// logging: false - stops the terminal spam with messages

module.exports = sequelize;
