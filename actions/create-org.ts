"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { OrganizationSchema } from "@/schemas";

interface CreateOrgResponse {
  error?: string;
  success?: string;
  organizationId?: string; // Include this property to handle successful organization creation
}

export const createOrg = async (
  values: z.infer<typeof OrganizationSchema>
): Promise<CreateOrgResponse> => {
  // Use the newly defined interface here
  const validatedFields = OrganizationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { organizationName, slug } = validatedFields.data;
  // Check if user already exists
  const existingOrganization = await db.organization.findFirst({
    where: {
      OR: [{ organizationName }, { slug }],
    },
  });

  if (existingOrganization) {
    return { error: "This company already exists!" };
  }

  const createOrganization = await db.organization.create({
    data: {
      organizationName,
      slug, // Include the slug in the data for creation
    },
  });

  // Check if the creation was successful and return the appropriate response
  if (createOrganization) {
    return {
      success: "Organization created!",
      organizationId: createOrganization.id, // Now correctly typed to be expected in the response
    };
  } else {
    return { error: "Something went wrong - No organization created!" };
  }
};
