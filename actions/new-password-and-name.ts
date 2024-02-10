"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NewPasswordAndNameSchema } from "@/schemas";

export const newPasswordAndName = async (values: z.infer<typeof NewPasswordAndNameSchema>) => {
  const validatedFields = NewPasswordAndNameSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input data." };
  }

  const { token, name, password } = validatedFields.data;

  // Verify the token and retrieve the associated email
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return { error: "Token is invalid or has expired." };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Update the user's name and password
    await db.user.update({
      where: { email: verificationToken.email },
      data: {
        name,
        password: hashedPassword,
        // Set email as verified if applicable
        emailVerified: new Date(),
      },
    });

    // Optionally, delete the verification token after successful update
    await db.verificationToken.delete({
      where: { token },
    });

    return { success: "Your profile has been updated successfully." };
  } catch (error) {
    if (error) {
      // Handle specific errors, e.g., P2002 for unique constraint violation
      return { error: "An error occurred while updating the profile." };
    }

    console.error("Error updating user profile:", error);
    return { error: "Failed to update profile." };
  }
};
