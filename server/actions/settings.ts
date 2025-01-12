"use server";

import { createSafeActionClient } from "next-safe-action";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { SettingSchema } from "@/types/settings-schema";
import { auth } from "../auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const settings = actionClient
  .schema(SettingSchema)
  .action(async ({ parsedInput: values }) => {
    const user = await auth();

    if (!user) {
      return { error: "user not found " };
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUser) {
      return { error: "User not found" };
    }

    if (user.user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );
      if (!passwordMatch) {
        return { error: "Password does not match" };
      }
      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      );
      if (samePassword) {
        return { error: "New password is the same as the old password" };
      }
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const updatedUser = await db
      .update(users)
      .set({
        name: values.name,
        email: values.email,
        twoFactorEnabled: values.isTwoFactorEnabled,
        password: values.password,
        image: values.image,
      })
      .where(eq(users.id, dbUser.id));

    revalidatePath("/dashboard/settings");

    return { success: "settings update" };
  });
