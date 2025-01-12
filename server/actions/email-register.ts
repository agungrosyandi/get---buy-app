"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";

import bcrypt from "bcrypt";
import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerficitaionEmail } from "./email";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    // we are hashing password ----------

    const hashedPassword = await bcrypt.hash(password, 10);

    // check existing user  ----------------------------

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerficitaionEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Email confirmation resend" };
      }

      return { error: "Email already in use" };
    }

    // logic for when the user not register ----------------------

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);

    await sendVerficitaionEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: "Confirmation Email Send!" };
  });
