const router = require("express").Router();
const feedController = require("./controllers/feedController");

router.use("/feed", feedController);

module.exports = router;
