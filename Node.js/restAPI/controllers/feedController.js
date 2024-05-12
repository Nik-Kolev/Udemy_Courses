const feedController = require("express").Router();
const createPostSchema = require("../validations/postSchema");
const postModel = require("../models/post");
const clearImage = require("../utils/clearImage");

const ITEMS_PER_PAGE = 2;

feedController.get("/getPosts", async (req, res, next) => {
  try {
    let page = Number(req.query.page);
    page < 1 || isNaN(page) ? (page = 1) : page;

    const totalPosts = await postModel.find().countDocuments();
    const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

    page > totalPages ? (page = totalPages) : page;

    const posts = await postModel
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json({ message: "Fetched posts successfully", posts, totalItems: totalPosts });
  } catch (err) {
    next(err);
  }
});

feedController.post("/createPost", async (req, res, next) => {
  try {
    const { title, content } = createPostSchema.partial().parse(req.body);
    if (!req.file) {
      throw new Error({ message: "No image provided", statusCode: 422 });
    }
    const imageUrl = req.file.path;
    const newPost = await postModel.create({ title, content, imageUrl, creator: { name: "Nik" } });
    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
});

feedController.get("/post/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) {
      throw new Error({ message: "Could not find specific post", statusCode: 404 });
    }
    res.status(200).json({ message: "Post fetched.", post });
  } catch (err) {
    next(err);
  }
});

feedController.put("/post/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content } = createPostSchema.partial().parse(req.body);
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      throw new Error({ message: "No image provided", statusCode: 422 });
    }
    const post = await postModel.findById(postId);
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    const updatedPost = await postModel.findByIdAndUpdate({ _id: postId }, { title, imageUrl, content }, { new: true });
    res.status(200).json({ message: "Post updated!", post: updatedPost });
  } catch (err) {
    next(err);
  }
});

feedController.delete("/post/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) {
      throw new Error({ message: "Could not find specific post", statusCode: 404 });
    }

    clearImage(post.imageUrl);

    await postModel.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = feedController;
