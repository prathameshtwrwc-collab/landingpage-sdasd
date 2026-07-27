import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPlatformStats, getOrganizations, getOrganizationAdmins, getAllMembers, getOrganizationDetails } from "@/lib/queries/admin";
import { createOrganizationInternal, createOrganizationAdminInternal, toggleOrgActiveLinkInternal, editOrgInternal, deleteOrgInternal, editAdminInternal, deleteAdminInternal, editMemberInternal, deleteMemberInternal } from "@/lib/actions/superadmin";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "org-settings") {
      const supabase = await createClient();
      const { data: admin } = await supabase
        .from("organization_admins")
        .select("organization_id")
        .eq("clerk_user_id", session.userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!admin?.organization_id) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      const org = await getOrganizationDetails(admin.organization_id);
      return NextResponse.json({
        id: org.id,
        name: org.name,
        type: org.organization_type,
        email: org.email,
        country: org.country,
        status: org.status,
        department: org.department ?? "",
        branch: org.branch ?? "",
        pincode: org.pincode ?? "",
        city: org.city ?? "",
        state: org.state ?? "",
        brandingLogo: org.branding_logo ?? "",
        brandingCompany: org.branding_company ?? "",
      });
    }

    const parsePage = (key: string) => {
      const v = url.searchParams.get(key);
      return v ? Math.max(1, parseInt(v, 10)) : undefined;
    };
    const parseLimit = (key: string) => {
      const v = url.searchParams.get(key);
      return v ? Math.min(200, Math.max(1, parseInt(v, 10))) : undefined;
    };

    const orgPage = parsePage("org_page");
    const orgLimit = parseLimit("org_limit");
    const orgSearch = url.searchParams.get("org_search") || undefined;

    const adminPage = parsePage("admin_page");
    const adminLimit = parseLimit("admin_limit");
    const adminSearch = url.searchParams.get("admin_search") || undefined;

    const memberPage = parsePage("member_page");
    const memberLimit = parseLimit("member_limit");
    const memberSearch = url.searchParams.get("member_search") || undefined;

    const [stats, organizations, admins, members] = await Promise.all([
      getPlatformStats(),
      getOrganizations({ page: orgPage, limit: orgLimit, search: orgSearch }),
      getOrganizationAdmins({ page: adminPage, limit: adminLimit, search: adminSearch }),
      getAllMembers({ page: memberPage, limit: memberLimit, search: memberSearch }),
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

    if (action === "edit_org") {
      const { id, ...data } = await req.json();
      const result = await editOrgInternal(id, data);
      return NextResponse.json(result);
    }

    if (action === "delete_org") {
      const { orgId } = await req.json();
      const result = await deleteOrgInternal(orgId);
      return NextResponse.json(result);
    }

    if (action === "edit_admin") {
      const { id, ...data } = await req.json();
      const result = await editAdminInternal(id, data);
      return NextResponse.json(result);
    }

    if (action === "delete_admin") {
      const { adminId } = await req.json();
      const result = await deleteAdminInternal(adminId);
      return NextResponse.json(result);
    }

    if (action === "edit_member") {
      const { id, ...data } = await req.json();
      const result = await editMemberInternal(id, data);
      return NextResponse.json(result);
    }

    if (action === "delete_member") {
      const { memberId } = await req.json();
      const result = await deleteMemberInternal(memberId);
      return NextResponse.json(result);
    }

    if (action === "update_org_settings") {
      const supabase = await createClient();
      const { data: admin } = await supabase
        .from("organization_admins")
        .select("organization_id")
        .eq("clerk_user_id", session.userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!admin?.organization_id) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      const { name, type, email, country, brandingLogo, brandingCompany, department, branch, pincode, city, state } = await req.json();
      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.organization_type = type;
      if (email !== undefined) updateData.email = email;
      if (country !== undefined) updateData.country = country;
      if (department !== undefined) updateData.department = department;
      if (branch !== undefined) updateData.branch = branch;
      if (pincode !== undefined) updateData.pincode = pincode;
      if (city !== undefined) updateData.city = city;
      if (state !== undefined) updateData.state = state;
      if (brandingLogo !== undefined) updateData.branding_logo = brandingLogo || null;
      if (brandingCompany !== undefined) updateData.branding_company = brandingCompany || null;

      const { error } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", admin.organization_id);

      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
