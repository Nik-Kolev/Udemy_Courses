const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const userModel = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    req.user = await userModel.findById("6629641702224e67dd6915d3");
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
    await mongoose.connect("mongodb+srv://nik:ixl0lzstfu@atlascluster.37xqvmk.mongodb.net/nodeUdemy");
    if (!userModel.findOne()) {
      userModel.create({
        name: "Nik",
        email: "kolev@abv.bg",
        cart: {
          items: [],
        },
      });
    }
    app.listen(3030, () => {
      console.log("Server is listening on port 3030");
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
