"use server";

import { productVariants, imagesVariant, tagsVariant } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { revalidatePath } from "next/cache";

import { createSafeActionClient } from "next-safe-action";
import { VariantSchema } from "@/types/variant-schema";

const actionClient = createSafeActionClient();

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImgs,
      },
    }) => {
      try {
        //  edited mode ---------------------------------

        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();

          await db
            .delete(tagsVariant)
            .where(eq(tagsVariant.variantID, editVariant[0].id));

          await db.insert(tagsVariant).values(
            tags.map((tag) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );
          await db
            .delete(imagesVariant)
            .where(eq(imagesVariant.variantID, editVariant[0].id));

          await db.insert(imagesVariant).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            }))
          );

          revalidatePath("/dashboard/product");

          return { success: `Edited variant ${productType}` };
        }

        // create variant & not edit mode ---------------------------------

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();

          await db.insert(tagsVariant).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(imagesVariant).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );

          revalidatePath("/dashboard/product");
          return { success: `Added variant ${productType}` };
        }
      } catch (error) {
        console.log(error);
        return { error: "Failed to create variant" };
      }
    }
  );
