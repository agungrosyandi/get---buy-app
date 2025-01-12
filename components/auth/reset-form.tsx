"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AuthCard from "./auth-card";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { ResetSchema } from "@/types/reset-schema";
import { reset } from "@/server/actions/password-reset";

export default function ResetForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (value: z.infer<typeof ResetSchema>) => {
    execute(value);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password ?"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial
    >
      <div>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Input Your Valid Email"
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormSuccess message={success} />
              <FormError message={error} />
            </div>

            <Button
              className={cn(
                "w-full mt-10",
                status === "executing" ? "animate-pulse" : ""
              )}
              variant={"default"}
              type="submit"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
