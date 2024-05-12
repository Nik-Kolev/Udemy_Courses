const { z } = require("zod");

const minLength = 5;

const createPostSchema = z.object({
  title: z.string().trim().min(minLength, `Title must be at least ${minLength} characters long`),
  content: z.string().trim().min(minLength, `Content must be at least ${minLength} characters long`),
});

module.exports = createPostSchema;
