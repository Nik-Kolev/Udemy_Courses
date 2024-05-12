const { z } = require("zod");

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .refine((value) => emailRegex.test(value), { message: "Email is not the correct format!" }),
  name: z.string().trim().min(1),
  password: z.string().trim().min(5),
});

module.exports = userSchema;
