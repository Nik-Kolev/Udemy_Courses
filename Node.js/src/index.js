const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");
const expressHbs = require("express-handlebars");

const app = express();

app.engine("hbs", expressHbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3030);
