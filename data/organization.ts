import { db } from "@/lib/db";

export const getOrganizationByName = async (organization: string) => {
    try {
      const organizationName = await db.organization.findUnique({ where: { organization } });
      return organizationName;
    } catch (error) {
      console.error("Failed to fetch organization:", error);
      return null;
    }
  };
  
  export const getOrganizationById = async (id: string) => {
    try {
      const organization = await db.organization.findUnique({ where: { id } });
      return organization;
    } catch (error) {
      console.error("Failed to fetch organization:", error);
      return null;
    }
  };
  