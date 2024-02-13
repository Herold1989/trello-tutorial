import { getOrganization } from "@/actions/organization";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();

  if (!user?.organizationId) {
    // If organizationId is undefined, return an appropriate response
    return new NextResponse(
      JSON.stringify({ error: "User is not part of any organization" }),
      { status: 400 }
    );
  }

  try {
    // Now TypeScript knows organizationId is definitely a string
    const organization = await getOrganization(user.organizationId); // Fetch organization data
    return new NextResponse(JSON.stringify(organization?.organizationName), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return new NextResponse(null, { status: 500 });
  }
}
