// important dont forget to put this "use server" ---------------------------------

"use server";

import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { products } from "../schema";

export async function getProduct(id: number) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) throw new Error("Product no found");

    return { success: product };
  } catch (error) {
    console.log(error);
    return { error: "failed to get product" };
  }
}
