import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title mus be at least 5 characters long",
  }),
  description: z
    .string()
    .min(8, { message: "Description at least 8 character" }),

  price: z.coerce
    .number({ invalid_type_error: "price must be number " })
    .positive({ message: "Price must be a positive number " }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
