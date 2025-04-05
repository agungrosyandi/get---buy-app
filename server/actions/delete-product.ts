// important dont forget to put this "use server" ---------------------------------

"use server";

import { createSafeActionClient } from "next-safe-action";

import { eq } from "drizzle-orm";
import { products } from "../schema";
import { db } from "../drizzle";

import * as z from "zod";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const DeleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/product");
      return { success: `Product ${data[0].title} has been deleted` };
    } catch (error) {
      console.log(error);
      return { error: "Failed to create product" };
    }
  });
