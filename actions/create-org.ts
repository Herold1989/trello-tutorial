"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { OrganizationSchema } from "@/schemas";
import { getOrganizationByName } from "@/data/organization";

export const createOrg = async (
  values: z.infer<typeof OrganizationSchema>
): Promise<{ error?: string; success?: string }> => {
  const validatedFields = OrganizationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { organization } = validatedFields.data;
  // Check if user already exists
  const existingOrganization = await getOrganizationByName(organization);
  if (existingOrganization) {
    return { error: "This company already exists!" };
  }

  const createOrganization = await db.organization.create({
    data: {
      organization,
    },
  });

  if (createOrganization) {
    return { success: "Organization created!" };
  } else {
    return { error: "Something went wrong - No organization created!" };
  }
};
