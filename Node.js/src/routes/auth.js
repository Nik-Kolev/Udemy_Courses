const router = require("express").Router();

const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const userModel = require("../models/user");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body("password", "Please enter a password with valid numbers and text - at least 5 characters").isLength({ min: 5 }).isAlphanumeric().trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        if (await userModel.findOne({ email: value })) {
          throw new Error("Email already exists!");
        }
      })
      .normalizeEmail(),
    body("password", "Please enter a password with valid numbers and text - at least 5 characters").isLength({ min: 5 }).isAlphanumeric().trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

module.exports = router;
