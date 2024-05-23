const userModel = require("../models/user");
const postModel = require("../models/post");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/customError");
const validator = require("validator");
const { tokenCreator } = require("../utils/jwt");

module.exports = {
  createUser: async function ({ userInput }) {
    try {
      const { email, password, name } = userInput;
      if (!validator.isEmail(email)) {
        throw new CustomError({ message: "Invalid email!", statusCode: 422 });
      }

      if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
        throw new CustomError({ message: "Password too short!", statusCode: 422 });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        throw new CustomError({ message: "User exists already!", statusCode: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await userModel.create({ email, password: hashedPassword, name });

      return { ...user._doc, _id: user._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  login: async function ({ email, password }) {
    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        throw new CustomError({ message: "User not found.", statusCode: 401 });
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        throw new CustomError({ message: "Password is incorrect.", statusCode: 401 });
      }

      const token = tokenCreator(user);

      return { token, userId: user._id.toString() };
    } catch (err) {
      throw err;
    }
  },
  createPost: async function ({ postInput }, req) {
    try {
      if (!req.isAuth) {
        throw new CustomError({ message: "Not authenticated", statusCode: 401 });
      }
      const { title, content, imageUrl } = postInput;
      const user = await userModel.findById(req.userId);
      if (!user) {
        throw new CustomError({ message: "Invalid user", statusCode: 401 });
      }
      if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
        throw new CustomError({ message: "Title is invalid", statusCode: 422 });
      }

      if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
        throw new CustomError({ message: "Content is invalid", statusCode: 422 });
      }

      const post = await postModel.create({ title, content, imageUrl, creator: user });

      user.posts.push(post);
      await user.save();

      return { ...post._doc, _id: post._id.toString(), createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() };
    } catch (err) {
      throw err;
    }
  },
  posts: async function (args, req) {
    try {
      if (!req.isAuth) {
        throw new CustomError({ message: "Not authenticated", statusCode: 401 });
      }
      const totalPosts = await postModel.find().countDocuments();
      const posts = await postModel.find().sort({ createdAt: -1 }).populate("creator");

      return {
        posts: posts.map((x) => {
          return { ...x._doc, _id: x._id.toString(), createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString() };
        }),
        totalPosts,
      };
    } catch (err) {
      throw err;
    }
  },
};
