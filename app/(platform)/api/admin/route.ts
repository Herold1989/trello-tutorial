import { getData } from "@/actions/user-list";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        try {
            const users = await getData(); // Fetch user data
            return new NextResponse(JSON.stringify(users), {status: 200});
        } catch (error) {
            console.error("Failed to fetch users:", error);
            return new NextResponse(null, { status: 500 });
        }
    }
    
    return new NextResponse(null, { status: 403 });
}
