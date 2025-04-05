// important dont forget to put this "use server" ---------------------------------

"use server";

import { createSafeActionClient } from "next-safe-action";

import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "../drizzle";

import * as z from "zod";

const actionClient = createSafeActionClient();

export const DeleteAccount = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db.delete(users).where(eq(users.id, id)).returning();

      return { success: `User ${data[0].name} has been deleted` };
    } catch (error) {
      console.log(error);
      return { error: "Failed to delete account" };
    }
  });
