const { tokenVerification } = require("../utils/jwt");
const ValidationError = require("../utils/createValidationError");

module.exports = (req, res, next) => {
  try {
    const header = req.get("Authorization");

    if (!header) {
      throw new ValidationError({ message: "Not Authenticated!", statusCode: 404 });
    }

    const token = header.split(" ")[1];

    const decodedToken = tokenVerification(token);

    if (!decodedToken) {
      throw new ValidationError({ message: "Not Authenticated!", statusCode: 401 });
    }

    req.userId = decodedToken.userId;
  } catch (err) {
    next(err);
  }
  next();
};
