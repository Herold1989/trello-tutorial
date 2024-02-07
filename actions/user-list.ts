"use server";

import { UserTable } from "@/data/user-columns"; // Import the UserTable type
import { db } from "@/lib/db"; // Import the database instance

// Define the getData function to fetch all users
export const getData = async (): Promise<UserTable[]> => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
      },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name || 'No Name', // Provide a default value or handle as needed
      email: user.email || 'No Email', // Provide a default value or handle as needed
      role: user.role as "ADMIN" | "USER", // Assure TypeScript that role is one of the two
      company: user.company || '-', // Provide a default value or handle as needed

    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};
