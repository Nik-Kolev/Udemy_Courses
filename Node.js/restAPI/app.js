require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://nik:ixl0lzstfu@atlascluster.37xqvmk.mongodb.net/udemy-messages";

const errorHandler = require("./utils/errorHandler");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const { v4: uuidv4 } = require("uuid");
const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

// app.use(cors());
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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,HEAD,OPTION");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use((req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data || null;
      const message = err.message || "An error occurred.";
      const code = err.originalError.statusCode;
      return {
        message,
        code,
        data,
      };
    },
  })
);

app.use((err, req, res, next) => {
  errorHandler(err, req, res, err.statusCode || 500);
});

(async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
})();
