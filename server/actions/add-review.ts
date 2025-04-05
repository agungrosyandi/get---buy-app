"use server";

import { reviews } from "../schema";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { ReviewSchema } from "@/types/reviews-schema";
import { createSafeActionClient } from "next-safe-action";

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .schema(ReviewSchema)
  .action(async ({ parsedInput: { productID, rating, comment } }) => {
    try {
      const session = await auth();

      if (!session) return { error: "Please sign in" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if (reviewExists)
        return { error: "You have already reviewed this product" };

      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productID}`);

      return { success: newReview[0] };
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  });
