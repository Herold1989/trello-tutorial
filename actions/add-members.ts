"use server";

import * as z from "zod";
import { EmailSubmissionSchema } from "@/schemas";
import { db } from "@/lib/db";
import { sendVerificationEmailOrganization } from "@/lib/mail";
import { generateVerificationTokenOrganization } from "@/lib/tokens";

export const addEmailsToOrganization = async (inputData: z.infer<typeof EmailSubmissionSchema>) => {
  const validatedData = EmailSubmissionSchema.safeParse(inputData);
  if (!validatedData.success) {
    return { error: "Invalid input data." };
  }

  const { organizationId, emails } = validatedData.data;

  try {
    // Perform user upsert and email association within a transaction
    await db.$transaction(async (prisma) => {
      for (const emailObj of emails) {
        await prisma.user.upsert({
          where: { email: emailObj.email },
          create: {
            email: emailObj.email,
            name: "Default Name",
            role: "USER",
            organizationId,
          },
          update: {},
        });

        await prisma.organizationEmail.create({
          data: {
            email: emailObj.email,
            organizationId,
          },
        });
      }
    });

    // Send verification emails asynchronously outside the transaction
    emails.forEach(async (emailObj) => {
      const { token } = await generateVerificationTokenOrganization(emailObj.email);
      await sendVerificationEmailOrganization(emailObj.email, token);
    });

    return {
      success: "Emails and users successfully associated with the organization and verification emails sent.",
    };
  } catch (error) {
    console.error("Error processing emails for organization:", error);
    return { error: "Failed to process emails for the organization." };
  }
};
