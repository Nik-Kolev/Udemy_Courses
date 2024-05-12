const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

function tokenCreator(data) {
  const payload = {
    email: data.email,
    userId: data._id.toString(),
  };
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

function tokenVerification(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { tokenCreator, tokenVerification };
