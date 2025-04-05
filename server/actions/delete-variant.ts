"use server";

import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { revalidatePath } from "next/cache";

import * as z from "zod";
import { createSafeActionClient } from "next-safe-action";

const actionClient = createSafeActionClient();

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deleteVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      revalidatePath("/dashboard/main-dashboard");

      return {
        success: `Variant ${deleteVariant[0].productID} has been deleted`,
      };
    } catch (error) {
      console.log(error);
      return { error: "failed to delete variant" };
    }
  });
