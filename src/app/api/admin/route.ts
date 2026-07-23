import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPlatformStats, getOrganizations, getOrganizationAdmins, getAllMembers } from "@/lib/queries/admin";
import { createOrganizationInternal, createOrganizationAdminInternal, toggleOrgActiveLinkInternal } from "@/lib/actions/superadmin";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const [stats, organizations, admins, members] = await Promise.all([
      getPlatformStats(),
      getOrganizations(),
      getOrganizationAdmins(),
      getAllMembers(),
    ]);

    return NextResponse.json({ stats, organizations, admins, members });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "create_org") {
      const fd = await req.formData();
      const result = await createOrganizationInternal(fd);
      return NextResponse.json(result);
    }

    if (action === "create_admin") {
      const fd = await req.formData();
      const result = await createOrganizationAdminInternal(fd);
      return NextResponse.json(result);
    }

    if (action === "toggle_link") {
      const { orgId, active } = await req.json();
      const result = await toggleOrgActiveLinkInternal(orgId, active);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
