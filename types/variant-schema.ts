import * as z from "zod";

export const VariantSchema = z.object({
  productID: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z.string().min(3, {
    message: "Product type must be at least 3 character",
  }),
  color: z.string().min(3, { message: "Color must be at least 3 characters" }),
  tags: z.array(z.string()).min(1, {
    message: "You must provide at least one tags",
  }),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Please wait for image to upload",
        }),
        key: z.string().optional(),
        id: z.number().optional(),
        size: z.number(),
        name: z.string(),
      })
    )
    .min(1, { message: "You must provide at least one image  " }),
});

export type zVariantSchema = z.infer<typeof VariantSchema>;
