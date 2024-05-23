const { tokenVerification } = require("../utils/jwt");
const ValidationError = require("../utils/createValidationError");

module.exports = (req, res, next) => {
  try {
    const header = req.get("Authorization");

    if (!header) {
      // throw new ValidationError({ message: "Not Authenticated!", statusCode: 404 });
      req.isAuth = false;
      return next();
    }

    const token = header.split(" ")[1];

    const decodedToken = tokenVerification(token);

    if (!decodedToken) {
      // throw new ValidationError({ message: "Not Authenticated!", statusCode: 401 });
      req.isAuth = false;
      return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  next();
};
