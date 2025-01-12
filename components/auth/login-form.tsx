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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import AuthCard from "./auth-card";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { EmailSign } from "@/server/actions/email-sign";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showToFactor, setShowToFactor] = useState(false);

  const { execute, status } = useAction(EmailSign, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) setSuccess(data.data.success);

      if (data.data?.twoFactor) {
        setShowToFactor(true);
      }
    },
  });

  const onSubmit = (value: z.infer<typeof LoginSchema>) => {
    execute(value);
  };

  return (
    <AuthCard
      cardTitle="Welcome Back"
      backButtonHref="/auth/register"
      backButtonLabel="Create a New Account"
      showSocial
    >
      <div>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {/* OTP Input -------------------------------------------- */}

              {showToFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        we sent you a two factor code to your email
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={status === "executing"}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!showToFactor && (
                <>
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
                </>
              )}

              <FormSuccess message={success} />
              <FormError message={error} />

              <Button variant={"link"}>
                <Link href="/auth/reset">Forget Password</Link>
              </Button>
            </div>

            <Button
              className={cn(
                "w-full mt-10",
                status === "executing" ? "animate-pulse" : ""
              )}
              variant={"default"}
              type="submit"
            >
              {showToFactor ? "Verify" : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
