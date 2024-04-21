const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const { mongoConnect } = require("./util/database");

// app.use(async (req, res, next) => {
//   // try {
//   //   req.user = await User.findByPk(1);
//   //   next();
//   // } catch (err) {
//   //   console.log(err);
//   // }
//   console.log("asd");
//   next();
// });

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
