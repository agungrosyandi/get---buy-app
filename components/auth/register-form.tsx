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
import { RegisterSchema } from "@/types/register-schema";
import { emailRegister } from "@/server/actions/email-register";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export default function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data?.error);
      if (data.data?.success) setSuccess(data.data?.success);
    },
  });

  const onSubmit = (value: z.infer<typeof RegisterSchema>) => {
    execute(value);
  };

  return (
    <AuthCard
      cardTitle="Create Account"
      backButtonHref="/auth/login"
      backButtonLabel="Already have account ? Login here"
      showSocial
    >
      <div>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {/* email -------------------------------------------- */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Input Username"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* email -------------------------------------------- */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Your Valid Email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password -------------------------------------------- */}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        autoComplete="current-password"
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
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
