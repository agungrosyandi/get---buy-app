"use server";

import { createSafeActionClient } from "next-safe-action";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";
import { ResetSchema } from "@/types/reset-schema";

const actionClient = createSafeActionClient();

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "User not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (!passwordResetToken) {
      return { error: "Token not generated" };
    }

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );

    return { success: "Reset Email Sent" };
  });
