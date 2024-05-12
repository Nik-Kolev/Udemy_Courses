require("dotenv").config();
const express = require("express");
const router = require("./router");
const path = require("path");
const app = express();

const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://nik:ixl0lzstfu@atlascluster.37xqvmk.mongodb.net/udemy-messages";

const errorHandler = require("./utils/errorHandler");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, uuidv4() + ".jpg");
  },
});

const fileFilter = (req, file, cb) => {
  file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ? cb(null, true) : cb(null, false);
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use((req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }
  next();
});

app.use(router);
app.use((err, req, res, next) => {
  errorHandler(err, req, res, err.statusCode || 500);
});

(async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  } catch (err) {
    console.log(err);
  }
})();
