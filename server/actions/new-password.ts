// important dont forget to put this "use server" ---------------------------------

"use server";

import { createSafeActionClient } from "next-safe-action";
import { passwordResetTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { getPasswordResetTokenByToken } from "./tokens";
import { NewPasswordSchema } from "@/types/new-password-schema";

import bcrypt from "bcrypt";

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const dbPool = drizzle(pool);

    // check token --------------

    if (!token) {
      return { error: "Missing Token " };
    }

    // here we need to check if the token is valid ----------

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: "Token not found" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "user not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });

    return { success: "Password update" };
  });
