"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema, zVariantSchema } from "@/types/variant-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputTags } from "./input-tags";
import VariantImages from "./variant-images";
import { forwardRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { deleteVariant } from "@/server/actions/delete-variant";
import { createVariant } from "@/server/actions/create-variant";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
};

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ children, editMode, productID, variant }, ref) => {
    const form = useForm<zVariantSchema>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: "#000000",   
        editMode,
        id: undefined,
        productID,
        productType: "",
      },
    });

    const [open, setOpen] = useState(false);

    // server actions to edit variant ---------------------

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }

      if (editMode && variant) {
        form.setValue("editMode", true);
        form.setValue("id", variant.id);
        form.setValue("productID", variant.productID);
        form.setValue("productType", variant.productType);
        form.setValue("color", variant.color);
        form.setValue(
          "tags",
          variant.tagsVariant.map((tag) => tag.tag)
        );
        form.setValue(
          "variantImages",
          variant.imagesVariant.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          }))
        );
      }
    };

    // mount once for edited mode

    useEffect(() => {
      setEdit();
    }, []);

    // server actions to create variant ---------------------

    const { execute, status } = useAction(createVariant, {
      onExecute() {
        if (!editMode) {
          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Sonner" }), 1000)
            );

          toast.promise(promise, {
            loading: "Loading...",
            success: () => {
              return `Creating Variant`;
            },
            error: "Error",
          });
        }

        if (editMode) {
          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Sonner" }), 1000)
            );

          toast.promise(promise, {
            loading: "Loading...",
            success: () => {
              return `Variant has been edited`;
            },
            error: "Error",
          });
        }

        setOpen(false);

        return;
      },

      onSuccess(data) {
        if (data.data?.error) toast.error(data.data.error);
        if (data.data?.success) toast.success(data.data.success);

        return;
      },
    });

    // server actions to delete variant ---------------------

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        const promise = () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Sonner" }), 1000)
          );

        toast.promise(promise, {
          loading: "Loading...",
          success: () => {
            return `Variant has been deleted`;
          },
          error: "Error",
        });

        return;
      },

      onSuccess(data) {
        if (data.data?.error) toast.error(data.data.error);
        if (data.data?.success) toast.success(data.data.success);

        return;
      },
    });

    // server actions to submit form product variant ---------------------

    function onSubmit(values: zVariantSchema) {
      execute(values);
    }

    // main component product variant ---------------------

    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent className="flex flex-col gap-3 overflow-y-scroll rounded-md max-h-[35rem] desktopMinWidth:max-w-screen-lg">
            <DialogHeader>
              <DialogTitle className="py-2">
                {editMode ? "Edit" : "Create"} your variant
              </DialogTitle>
              <DialogDescription>
                Manage your product variant, add tags, images and more
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pick a title for your variant"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <InputTags
                          {...field}
                          onChange={(e) => field.onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <VariantImages />
                <div className="flex gap-4 items-center justify-center">
                  {editMode && variant && (
                    <Button
                      variant={"destructive"}
                      type="button"
                      disabled={variantAction.status === "executing"}
                      onClick={(e) => {
                        e.preventDefault();
                        variantAction.execute({ id: variant.id });
                      }}
                    >
                      Delete Variant
                    </Button>
                  )}
                  <Button
                    disabled={
                      status === "executing" ||
                      !form.formState.isValid ||
                      !form.formState.isDirty
                    }
                    type="submit"
                  >
                    {editMode ? "Update Variant" : "Create Variant"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

ProductVariant.displayName = "ProductVariant";
