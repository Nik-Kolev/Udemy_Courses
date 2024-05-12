const feedController = require("express").Router();
const createPostSchema = require("../validations/postSchema");
const postModel = require("../models/post");
const userModel = require("../models/user");
const clearImage = require("../utils/clearImage");
const isAuth = require("../middleware/isAuth");
const ValidationError = require("../utils/createValidationError");

const ITEMS_PER_PAGE = 2;

feedController.get("/getPosts", isAuth, async (req, res, next) => {
  try {
    let page = Number(req.query.page);
    page < 1 || isNaN(page) ? (page = 1) : page;

    const totalPosts = await postModel.find().countDocuments();
    const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

    page = totalPages !== 0 ? Math.min(page, totalPages) : 1;

    const posts = await postModel
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json({ message: "Fetched posts successfully", posts, totalItems: totalPosts });
  } catch (err) {
    next(err);
  }
});

feedController.post("/createPost", isAuth, async (req, res, next) => {
  try {
    const { title, content } = createPostSchema.partial().parse(req.body);
    if (!req.file) {
      throw new Error({ message: "No image provided", statusCode: 422 });
    }
    const imageUrl = req.file.path;

    const newPost = await postModel.create({ title, content, imageUrl, creator: req.userId });
    const user = await userModel.findByIdAndUpdate({ _id: req.userId }, { $push: { posts: newPost } }, { new: true });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
});

feedController.get("/post/:postId", isAuth, async (req, res, next) => {
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

feedController.put("/post/:postId", isAuth, async (req, res, next) => {
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

    if (post.creator.toString() !== req.userId) {
      throw new ValidationError({ message: "Not authorized", statusCode: 403 });
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    const updatedPost = await postModel.findByIdAndUpdate({ _id: postId }, { title, imageUrl, content }, { new: true });
    res.status(200).json({ message: "Post updated!", post: updatedPost });
  } catch (err) {
    next(err);
  }
});

feedController.delete("/post/:postId", isAuth, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);

    if (!post) {
      throw new ValidationError({ message: "Could not find specific post", statusCode: 404 });
    }

    if (post.creator.toString() !== req.userId) {
      throw new ValidationError({ message: "Not authorized", statusCode: 403 });
    }

    clearImage(post.imageUrl);

    await postModel.findByIdAndDelete(postId);
    await userModel.findByIdAndUpdate(req.userId, { $pull: { posts: post._id } });

    res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = feedController;
