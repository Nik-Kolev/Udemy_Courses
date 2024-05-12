const userController = require("express").Router();
const userModel = require("../models/user");
const userSchema = require("../validations/userSchema");
const ValidationError = require("../utils/createValidationError");
const bcrypt = require("bcryptjs");

userController.put("/signup", async (req, res, next) => {
  try {
    const { email, name, password } = userSchema.partial().parse(req.body);

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ValidationError("Email already exists!");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userModel.create({ email, password: hashedPassword, name });
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    next(err);
  }
});

userController.post("/login", async (req, res, next) => {
  try {
    const { email, password, repeatPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!emailExists) {
      throw new ValidationError({ message: "Email or password is incorrect!", statusCode: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ValidationError({ message: "Email or password is incorrect!", statusCode: 401 });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = userController;
