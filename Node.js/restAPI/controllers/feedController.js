const feedController = require("express").Router();
const { createPostSchema } = require("../validations/feedSchema");
const postModel = require("../models/post");

feedController.get("/getPosts", async (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post",
        imageUrl: "images/cube.jpg",
        creator: {
          name: "Nik",
        },
        createdAt: new Date(),
      },
    ],
  });
});

feedController.post("/createPost", async (req, res, next) => {
  try {
    const { title, content } = createPostSchema.partial().parse(req.body);
    const newPost = await postModel.create({ title, content, imageUrl: "images/cube.jpg", creator: { name: "Nik" } });
    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
});

module.exports = feedController;
