const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const userModel = require("./models/user");
const MONGODB_URI = "mongodb+srv://nik:ixl0lzstfu@atlascluster.37xqvmk.mongodb.net/nodeUdemy";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

// multer storage engine - diskStorage
// cb(null, ...) - its the callback with 1st field error if we need it, but since we don`t here - it is null
const fileStorage = multer.diskStorage({
  destination: "src/images",
  // uuid or similar method (date.now as well) can be used to create unique file name if needed
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    //accepts only the files with these mime types
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use((req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/src/images", express.static(path.join(__dirname, "images")));
app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await userModel.findById(req.session.user._id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    next(new Error(err, 500));
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

//Express skips 404 above and goes down to the error middleware, if there are more than one - it goes top to bottom

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render...
  // res.redirect("/500");
  res.status(500).render("500", { pageTitle: "Error!", path: "/500" });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(3030, () => {
      console.log("Server is listening on port 3030");
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
