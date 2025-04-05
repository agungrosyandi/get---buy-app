// important dont forget to put this "use server" ---------------------------------

"use server";

import { createSafeActionClient } from "next-safe-action";

import { eq } from "drizzle-orm";
import { products } from "../schema";

import { ProductSchema } from "@/types/product-schema";
import { db } from "../drizzle";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const CreateProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        //  search & show product ------------------

        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        // if product do not shows logic ------------------------

        if (!currentProduct) return { error: "Product not found" };

        // edit product logic ------------------------

        const editProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/product");

        return { success: `Product ${editProduct[0].title} has been edit` };
      }

      // add new product logic ------------------------

      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();
        return { success: `Product ${newProduct[0].title} has been created` };
      }
    } catch (err) {
      console.log(err);
      return { error: "Failed to create product" };
    }
  });
