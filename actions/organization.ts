"use server";

import { db } from "@/lib/db"; // Import the database instance

export const getOrganization = async (id: string) => {
    try {
        const organization = await db.organization.findUnique({ where: { id } });
        return organization;
      } catch (error) {
        console.error("Failed to fetch organization:", error);
        return null;
      }
}