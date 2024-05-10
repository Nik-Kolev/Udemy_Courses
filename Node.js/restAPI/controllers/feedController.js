const feedController = require("express").Router();

feedController.get("/getPosts", async (req, res, next) => {
  res.status(200).json({ posts: [{ title: "First Post", content: "This is the first post" }] });
});

feedController.post("/createPost", async (req, res, next) => {
  const { title, content } = req.body;
  // create post in db
  res.status(201).json({ message: "Post created successfully", post: { id: new Date().toISOString(), title, content } });
});

module.exports = feedController;
