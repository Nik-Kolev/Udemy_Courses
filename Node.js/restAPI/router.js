const router = require("express").Router();

const feedController = require("./controllers/feedController");
const userController = require("./controllers/userController");

router.use("/feed", feedController);
router.use("/auth", userController);

module.exports = router;
