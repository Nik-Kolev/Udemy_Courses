const router = require("express").Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/signup", authController.postSignup);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

module.exports = router;
