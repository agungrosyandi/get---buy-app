"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductSchema, zProductSchema } from "../../../types/product-schema";
import Tiptap from "./tiptap";
import { useAction } from "next-safe-action/hooks";
import { CreateProduct } from "@/server/actions/create-product";
import { toast } from "sonner";

import { useEffect } from "react";
import { getProduct } from "@/server/actions/get-product";

export default function CreateProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();

  const searchParams = useSearchParams();

  const editMode = searchParams.get("id");

  // edit mode logic in front end, receive server action logic

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);

      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/product");
        return;
      }

      if (data.success) {
        const id = parseInt(editMode);
        form.setValue("title", data.success.title);
        form.setValue("description", data.success.description);
        form.setValue("price", data.success.price);
        form.setValue("id", id);
      }
    }
  };

  // dont forget to put useEffect mount when wrap to edit mode. apply them also in tiptap component ------------------

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  // execute front logic from backend --------------------------------------

  const { execute, status } = useAction(CreateProduct, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);

        return;
      }

      if (data.data?.success) {
        router.push("/dashboard/product");
        toast.success(data.data.success);

        return;
      }
    },

    onExecute: () => {
      if (editMode) {
        const promise = () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Sonner" }), 1000)
          );

        toast.promise(promise, {
          loading: "Loading...",
          success: () => {
            return `Product has been edited`;
          },
          error: "Error",
        });
      }

      if (!editMode) {
        const promise = () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Sonner" }), 1000)
          );

        toast.promise(promise, {
          loading: "Loading...",
          success: () => {
            return `Product has been created`;
          },
          error: "Error",
        });
      }

      return;
    },

    onError: (error) => console.error(error),
  });

  // submit form logic --------------------------------------

  const onSubmit = async (values: zProductSchema) => {
    execute(values);
  };

  // main front-end --------------------------------------

  return (
    <Card className="">
      <CardHeader className="w-full items-center">
        <CardTitle>
          {editMode ? <span>Edit Product</span> : <span>Create Product</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukan nama produk" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-5">
                      <DollarSign
                        size={30}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        type="number"
                        placeholder="Your Price"
                        step="10000"
                        min={0}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
