const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/customError");
const validator = require("validator");
const { tokenCreator } = require("../utils/jwt");

module.exports = {
  createUser: async function ({ userInput }) {
    try {
      const { email, password, name } = userInput;
      if (!validator.isEmail(email)) {
        throw new CustomError({ message: "Invalid email!", statusCode: 422 });
      }

      if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
        throw new CustomError({ message: "Password too short!", statusCode: 422 });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        throw new CustomError({ message: "User exists already!", statusCode: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await userModel.create({ email, password: hashedPassword, name });

      return { ...user._doc, _id: user._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  login: async function ({ email, password }) {
    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        throw new CustomError({ message: "User not found.", statusCode: 401 });
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        throw new CustomError({ message: "Password is incorrect.", statusCode: 401 });
      }

      const token = tokenCreator(user);

      return { token, userId: user._id.toString() };
    } catch (err) {
      throw err;
    }
  },
};
