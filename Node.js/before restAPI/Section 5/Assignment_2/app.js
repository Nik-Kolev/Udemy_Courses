const express = require("express");

const app = express();

app.use("/users", (req, res, next) => {
  console.log("asd");
  res.send("<h1>Users</h1>");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hi</h1>");
});

app.listen(3030);
