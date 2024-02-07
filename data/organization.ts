import { db } from "@/lib/db";

export const getOrganizationByName = async (organization: string) => {
    try {
      const organizationName = await db.organization.findUnique({ where: { organization } });
      return organizationName;
    } catch {
      return null;
    }
  };
  