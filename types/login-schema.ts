import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "invalid email address",
  }),
  password: z.string().min(1, {
    message: "Password is requred",
  }),
  code: z.optional(z.string()),
});
