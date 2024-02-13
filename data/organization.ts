import { db } from "@/lib/db";

export const getOrganizationByName = async (organizationName: string) => {
    try {
      const organization = await db.organization.findUnique({ where: { organizationName } });
      return organization;
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
  