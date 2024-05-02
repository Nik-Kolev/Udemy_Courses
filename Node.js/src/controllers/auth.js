const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = async (req, res, next) => {
  try {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = async (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid Email or Password!");
      return res.redirect("/login");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.redirect("/");
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.findOne({ email });
    if (user) {
      return res.redirect("/signup");
    }
    await userModel.create({ email, password: hashedPassword, cart: { items: [] } });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
