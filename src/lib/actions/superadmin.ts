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

export async function createOrganizationInternal(formData: FormData) {
  const name = formData.get("name") as string;
  const orgType = (formData.get("organization_type") as string) || "Corporate";
  const country = formData.get("country") as string;
  const email = formData.get("email") as string;

  if (!name) throw new Error("Organization name is required");

  const supabase = createAdminClient();
  const code = await generateOrgCode(name);

  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ name, organization_type: orgType, unique_code: code, email, country })
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
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const organizationId = formData.get("organization_id") as string;

  if (!firstName || !lastName || !email || !password || !organizationId) {
    throw new Error("All fields are required (including password)");
  }

  const supabase = createAdminClient();

  const { data: existingOrg } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", organizationId)
    .single();

  if (!existingOrg) throw new Error("Organization not found");

  // Create Clerk user with password
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.createUser({
    emailAddress: [email],
    password,
    firstName,
    lastName,
    publicMetadata: { role: "admin" },
  });

  // Insert into organization_admins with clerk_user_id
  const { error } = await supabase.from("organization_admins").insert({
    organization_id: organizationId,
    clerk_user_id: clerkUser.id,
    first_name: firstName,
    last_name: lastName,
    email,
    role: "admin",
  });

  if (error) throw new Error(error.message);

  return { success: true };
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
