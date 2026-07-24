import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrganizationDetails, getAllMembers, getOrganizationAdmins } from "@/lib/queries/admin";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const url = new URL(req.url);
    const orgId = url.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

    const [org, allMembers, allAdmins] = await Promise.all([
      getOrganizationDetails(orgId),
      getAllMembers({ limit: 10000 }),
      getOrganizationAdmins({ limit: 10000 }),
    ]);

    const members = (allMembers.data ?? []).filter((m: Record<string, unknown>) => m.organization_id === orgId);
    const admins = (allAdmins.data ?? []).filter((a: Record<string, unknown>) => a.organization_id === orgId);

    return NextResponse.json({ org, members, admins });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
