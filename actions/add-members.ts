"use server";
import Prisma, * as PrismaScope from "@prisma/client";
import * as z from "zod";
import { EmailSubmissionSchema } from "@/schemas";
import { db } from "@/lib/db";

export const PrismaClientKnownRequestError =
  Prisma?.Prisma.PrismaClientKnownRequestError ||
  PrismaScope?.Prisma.PrismaClientKnownRequestError;

export const addEmailsToOrganization = async (
  inputData: z.infer<typeof EmailSubmissionSchema>
) => {
  const validatedData = EmailSubmissionSchema.safeParse(inputData);
  if (!validatedData.success) {
    return { error: "Invalid input data." };
  }

  const { organizationId, emails } = validatedData.data;

  // Step 1: Ensure all emails are associated with a user (upsert users)
  const userUpserts = emails.map((emailObj) =>
    db.user.upsert({
      where: { email: emailObj.email },
      create: {
        email: emailObj.email,
        name: "Default Name", // Provide default name or handle accordingly
        role: "USER", // Default role, adjust as necessary
      },
      update: {}, // No updates needed for existing users
    })
  );

  try {
    await Promise.all(userUpserts);
  } catch (error) {
    console.error("Error upserting users:", error);
    return { error: "Failed to upsert users." };
  }

  // Step 2: Associate emails with organization (batch create OrganizationEmail)
  try {
    await db.$transaction(
      emails.map((emailObj) =>
        db.organizationEmail.create({
          data: {
            email: emailObj.email,
            organizationId,
          },
        })
      )
    );
    return {
      success:
        "Emails and users successfully associated with the organization.",
    };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Handle unique constraint violation (email already associated)
      return {
        error:
          "One or more emails are already associated with an organization.",
      };
    }
    console.error("Error associating emails with organization:", error);
    return { error: "Failed to associate emails with the organization." };
  }
};
