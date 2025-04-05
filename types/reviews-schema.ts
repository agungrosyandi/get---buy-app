import * as z from "zod";

export const ReviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "please add at least one start" })
    .max(5, { message: "Please add no more than 5 start" }),
  comment: z
    .string()
    .min(10, { message: "please add at least 10 character for comment" }),
});

export type zReviewSchema = z.infer<typeof ReviewSchema>;
