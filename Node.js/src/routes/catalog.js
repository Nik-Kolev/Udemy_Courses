const express = require("express");
const path = require("path");
const router = express.Router();
const rootDir = require("../utils/path");

router.get("/catalog", (req, res) => {
  res.sendFile(path.join(rootDir, "views", "catalog.html"));
});

module.exports = router;
