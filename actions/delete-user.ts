"use server";

import * as z from "zod";

import { DeleteUserSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

export const deleteUser = async (values: z.infer<typeof DeleteUserSchema>) => {
  const validatedFields = DeleteUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  const { id } = validatedFields.data;

  const existingUser = await getUserById(id);

  if (!existingUser) {
    return { error: "User ID not found!" };
  }

  try {
    await db.user.delete({
      where: { id: id },
    });
    return { success: "User deleted successfully" };
  } catch (error) {
    console.error("Deletion error:", error);
    return { error: "Error occurred during user deletion" };
  }
};