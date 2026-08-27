"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrgCode } from "@/lib/utils/org-code";

async function requireSuperadmin() {
  const session = await auth();
  const role = (session.sessionClaims?.publicMetadata as Record<string, unknown>)?.role;
  if (role !== "superadmin") {
    throw new Error("Unauthorized: superadmin role required");
  }
  return session.userId;
}

/**
 * Ensures an email is not already registered under a different role.
 * One email can belong to exactly one of: member, organization admin,
 * or superadmin. Throws a clear error otherwise.
 */
async function assertEmailNotInUse(
  supabase: ReturnType<typeof createAdminClient>,
  rawEmail: string,
  opts: { excludeAdminId?: string | null } = {}
) {
  const email = rawEmail.toLowerCase().trim();
  if (!email) return;

  // Already a member?
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (member) {
    throw new Error("This email already exists as a member. Please use a different email.");
  }

  // Already an admin (org admin or superadmin) — ignoring the admin being edited.
  const adminQuery = supabase
    .from("organization_admins")
    .select("id, role")
    .eq("email", email);
  if (opts.excludeAdminId) {
    adminQuery.neq("id", opts.excludeAdminId);
  }
  const { data: admin } = await adminQuery.maybeSingle();
  if (admin) {
    throw new Error(
      admin.role === "superadmin"
        ? "This email already exists as a superadmin. Please use a different email."
        : "This email already exists as an organization admin. Please use a different email."
    );
  }
}

export async function createOrganizationInternal(formData: FormData) {
  const name = formData.get("name") as string;
  const orgType = (formData.get("organization_type") as string) || "Corporate";
  const country = formData.get("country") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string || "";
  const branch = formData.get("branch") as string || "";
  const pincode = formData.get("pincode") as string || "";
  const city = formData.get("city") as string || "";
  const state = formData.get("state") as string || "";

  if (!name) throw new Error("Organization name is required");

  const supabase = createAdminClient();
  const code = await generateOrgCode(name);

  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ name, organization_type: orgType, unique_code: code, email, country, department, branch, pincode, city, state })
    .select()
    .single();

  if (orgErr) throw new Error(orgErr.message);

  const { error: linkErr } = await supabase
    .from("organization_links")
    .insert({ organization_id: org.id, unique_code: code });

  if (linkErr) throw new Error(linkErr.message);

  return { success: true, org };
}

export async function createOrganizationAdminInternal(formData: FormData) {
  try {
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const organizationId = formData.get("organization_id") as string;

    if (!firstName || !lastName || !email || !password || !organizationId) {
      return { error: "All fields are required (including password)" };
    }

    const supabase = createAdminClient();

    const emailLower = email.toLowerCase().trim();

    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("email", emailLower)
      .maybeSingle();
    if (member) {
      return { error: "This email already exists as a member. Please use a different email." };
    }

    const { data: existingAdmin } = await supabase
      .from("organization_admins")
      .select("id, role")
      .eq("email", emailLower)
      .maybeSingle();
    if (existingAdmin) {
      return {
        error:
          existingAdmin.role === "superadmin"
            ? "This email already exists as a superadmin. Please use a different email."
            : "This email already exists as an organization admin. Please use a different email.",
      };
    }

    const { data: existingOrg } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", organizationId)
      .single();

    if (!existingOrg) return { error: "Organization not found" };

    const clerk = await clerkClient();

    const existingClerkUsers = await clerk.users.getUserList({
      emailAddress: [emailLower],
    });

    if (existingClerkUsers.totalCount > 0) {
      return { error: "This email is already registered. Please use a different email." };
    }

    const clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: { role: "admin" },
    });

    const { error } = await supabase.from("organization_admins").insert({
      organization_id: organizationId,
      clerk_user_id: clerkUser.id,
      first_name: firstName,
      last_name: lastName,
      email: emailLower,
      role: "admin",
    });

    if (error) return { error: error.message };

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create admin" };
  }
}

export async function toggleOrgActiveLinkInternal(orgId: string, active: boolean) {
  const supabase = createAdminClient();

  // Get the latest link for this org (or create one if none exists)
  let { data: link } = await supabase
    .from("organization_links")
    .select("id, unique_code")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!link) {
    // No link exists — create one with a generated code
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .single();

    const code = await generateOrgCode(org?.name ?? "ORG");

    const { data: newLink, error: insertErr } = await supabase
      .from("organization_links")
      .insert({ organization_id: orgId, unique_code: code, active })
      .select()
      .single();

    if (insertErr) throw new Error(insertErr.message);
    return { unique_code: newLink.unique_code, active };
  }

  // Update existing link's active status
  const { error: updateErr } = await supabase
    .from("organization_links")
    .update({ active })
    .eq("id", link.id);

  if (updateErr) throw new Error(updateErr.message);

  return { unique_code: link.unique_code, active };
}

export async function createOrganization(formData: FormData) {
  await requireSuperadmin();
  return createOrganizationInternal(formData);
}

export async function createOrganizationAdmin(formData: FormData) {
  await requireSuperadmin();
  return createOrganizationAdminInternal(formData);
}

export async function toggleOrgActiveLink(orgId: string, active: boolean) {
  await requireSuperadmin();
  return toggleOrgActiveLinkInternal(orgId, active);
}

// ─── Edit / Delete ──────────────────────────────────────────────────

export async function editOrgInternal(orgId: string, data: Record<string, string>) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("organizations").update(data).eq("id", orgId);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteOrgInternal(orgId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("organizations").delete().eq("id", orgId);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function editAdminInternal(adminId: string, data: Record<string, string>) {
  const supabase = createAdminClient();

  // If the admin's email is changing, ensure the new email is not already
  // used by a member, another admin, or a superadmin.
  const newEmail = data.email;
  if (newEmail) {
    await assertEmailNotInUse(supabase, newEmail, { excludeAdminId: adminId });
  }

  const { error } = await supabase.from("organization_admins").update(data).eq("id", adminId);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteAdminInternal(adminId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("organization_admins").delete().eq("id", adminId);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function editMemberInternal(memberId: string, data: Record<string, unknown>) {
  const supabase = createAdminClient();

  // If the member's email is changing, ensure it is not already used by an
  // admin (org admin or superadmin) — one email = one role.
  const newEmail = data.email as string | undefined;
  if (newEmail) {
    const email = newEmail.toLowerCase().trim();
    const { data: adminConflict } = await supabase
      .from("organization_admins")
      .select("id, role")
      .eq("email", email)
      .maybeSingle();
    if (adminConflict) {
      throw new Error(
        adminConflict.role === "superadmin"
          ? "This email already exists as a superadmin. Please use a different email."
          : "This email already exists as an organization admin. Please use a different email."
      );
    }
  }

  const { error } = await supabase.from("members").update(data).eq("id", memberId);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteMemberInternal(memberId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("members").delete().eq("id", memberId);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── Server-action wrappers (with auth check) ───────────────────────

export async function editOrg(formData: FormData) {
  await requireSuperadmin();
  const orgId = formData.get("id") as string;
  const data: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (k !== "id") data[k] = v as string;
  }
  return editOrgInternal(orgId, data);
}

export async function deleteOrg(orgId: string) {
  await requireSuperadmin();
  return deleteOrgInternal(orgId);
}

export async function editAdmin(formData: FormData) {
  await requireSuperadmin();
  const adminId = formData.get("id") as string;
  const data: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (k !== "id") data[k] = v as string;
  }
  return editAdminInternal(adminId, data);
}

export async function deleteAdmin(adminId: string) {
  await requireSuperadmin();
  return deleteAdminInternal(adminId);
}

export async function editMember(memberId: string, data: Record<string, unknown>) {
  await requireSuperadmin();
  return editMemberInternal(memberId, data);
}

export async function deleteMember(memberId: string) {
  await requireSuperadmin();
  return deleteMemberInternal(memberId);
}
