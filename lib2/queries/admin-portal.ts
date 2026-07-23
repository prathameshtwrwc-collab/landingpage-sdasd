import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function getAdminOrg() {
  const session = await auth();
  const clerkUserId = session.userId;
  if (!clerkUserId) throw new Error("Not authenticated");

  const supabase = await createClient();

  // Try lookup by clerk_user_id first
  const { data: admin } = await supabase
    .from("organization_admins")
    .select("id, organization_id, first_name, last_name, organizations(name)")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (admin) {
    return {
      organizationId: admin.organization_id,
      orgName: (admin.organizations as unknown as { name: string } | null)?.name ?? "Organization",
      adminName: `${admin.first_name} ${admin.last_name}`,
    };
  }

  // Fall back to email lookup (needed when webhook hasn't linked clerk_user_id)
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(clerkUserId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("No email found for authenticated user");

  const { data: adminByEmail } = await supabase
    .from("organization_admins")
    .select("id, organization_id, first_name, last_name, organizations(name)")
    .eq("email", email)
    .maybeSingle();

  if (!adminByEmail) throw new Error("Admin not found");

  // Persist clerk_user_id for future lookups
  await supabase
    .from("organization_admins")
    .update({ clerk_user_id: clerkUserId })
    .eq("id", adminByEmail.id);

  return {
    organizationId: adminByEmail.organization_id,
    orgName: (adminByEmail.organizations as unknown as { name: string } | null)?.name ?? "Organization",
    adminName: `${adminByEmail.first_name} ${adminByEmail.last_name}`,
  };
}

export async function getAdminDashboardStats() {
  const { organizationId, orgName } = await getAdminOrg();
  const supabase = await createClient();

  const { count: totalMembers } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  const { count: completedAssessments } = await supabase
    .from("assessments")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("status", "COMPLETED");

  const { count: inProgress } = await supabase
    .from("assessments")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("status", "STARTED");

  const { data: chronoResults } = await supabase
    .from("chronotype_results")
    .select("chronotype")
    .eq("organization_id", organizationId);

  const counts = { LARK: 0, EAGLE: 0, OWL: 0 };
  chronoResults?.forEach((r) => {
    if (r.chronotype in counts) counts[r.chronotype as keyof typeof counts]++;
  });
  const total = chronoResults?.length || 1;

  return {
    orgName,
    totalMembers: totalMembers ?? 0,
    completedAssessments: completedAssessments ?? 0,
    inProgress: inProgress ?? 0,
    notStarted: (totalMembers ?? 0) - (completedAssessments ?? 0) - (inProgress ?? 0),
    chronotypeMix: [
      { label: "Larks", value: Math.round((counts.LARK / total) * 100), color: "#f4b54d" },
      { label: "Eagles", value: Math.round((counts.EAGLE / total) * 100), color: "#354a82" },
      { label: "Owls", value: Math.round((counts.OWL / total) * 100), color: "#e9e2f5" },
    ],
  };
}

export async function getAdminMembers() {
  const { organizationId } = await getAdminOrg();
  const supabase = await createClient();

  const { data } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAdminAssessmentResults() {
  const { organizationId } = await getAdminOrg();
  const supabase = await createClient();

  const { data } = await supabase
    .from("assessments")
    .select("id, status, started_at, completed_at, members(first_name, last_name), chronotype_results(chronotype, confidence_score)")
    .eq("organization_id", organizationId)
    .order("started_at", { ascending: false })
    .limit(50);

  return ((data ?? []) as unknown) as {
    id: string;
    status: string;
    started_at: string;
    completed_at: string | null;
    members: { first_name: string; last_name: string } | null;
    chronotype_results: { chronotype: string; confidence_score: number } | null;
  }[];
}
