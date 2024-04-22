const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const { mongoConnect } = require("./util/database");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("66269b9e439a01f5e9fda6ea");
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

async function startServer() {
  try {
    await mongoConnect();
    console.log("Connected to MongoDB");
    app.listen(3030, () => {
      console.log("Server is listening on port 3030");
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
