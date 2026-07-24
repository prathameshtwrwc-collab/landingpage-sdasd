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

  const [{ count: totalMembers }, { count: completedAssessments }, { count: inProgress }] =
    await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }).eq("organization_id", organizationId),
      supabase.from("assessments").select("*", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "COMPLETED"),
      supabase.from("assessments").select("*", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "STARTED"),
    ]);

  const { data: chronoResults } = await supabase
    .from("chronotype_results")
    .select("chronotype, confidence_score")
    .eq("organization_id", organizationId);

  const counts = { LARK: 0, EAGLE: 0, OWL: 0 };
  let totalConfidence = 0;
  chronoResults?.forEach((r) => {
    if (r.chronotype in counts) counts[r.chronotype as keyof typeof counts]++;
    totalConfidence += r.confidence_score ?? 0;
  });
  const totalChrono = chronoResults?.length || 0;

  const avgConfidence = totalChrono > 0 ? Math.round(totalConfidence / totalChrono) : 0;

  const { data: orgLinks } = await supabase
    .from("organization_links")
    .select("unique_code, active")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(1);

  const link = orgLinks?.[0];
  const orgLinkStatus = link ? (link.active ? "active" : "paused") : "none";
  const orgUniqueCode = link?.unique_code ?? "";

  // Assessment activity: daily counts for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: rawActivity } = await supabase
    .from("assessments")
    .select("completed_at")
    .eq("organization_id", organizationId)
    .eq("status", "COMPLETED")
    .gte("completed_at", sevenDaysAgo.toISOString());

  const dayLabels: string[] = [];
  const dayCounts: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayLabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    dayCounts.push(0);
  }
  rawActivity?.forEach((r) => {
    if (!r.completed_at) return;
    const d = new Date(r.completed_at as string);
    const dayIndex = dayLabels.findIndex(
      (_, i) => {
        const check = new Date();
        check.setDate(check.getDate() - (6 - i));
        return check.toDateString() === d.toDateString();
      }
    );
    if (dayIndex >= 0) dayCounts[dayIndex]++;
  });

  const assessmentActivity = dayLabels.map((label, i) => ({ label, value: dayCounts[i] }));

  return {
    orgName,
    totalMembers: totalMembers ?? 0,
    completedAssessments: completedAssessments ?? 0,
    inProgress: inProgress ?? 0,
    notStarted: (totalMembers ?? 0) - (completedAssessments ?? 0) - (inProgress ?? 0),
    avgConfidence,
    orgLinkStatus,
    orgUniqueCode,
    assessmentActivity,
    chronotypeMix: [
      { label: "Larks", value: totalChrono > 0 ? Math.round((counts.LARK / totalChrono) * 100) : 0, color: "#f4b54d" },
      { label: "Eagles", value: totalChrono > 0 ? Math.round((counts.EAGLE / totalChrono) * 100) : 0, color: "#354a82" },
      { label: "Owls", value: totalChrono > 0 ? Math.round((counts.OWL / totalChrono) * 100) : 0, color: "#7B68AE" },
    ],
  };
}

export async function getAdminMembers(opts?: { page?: number; limit?: number; search?: string }) {
  const { organizationId } = await getAdminOrg();
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const search = opts?.search?.trim() ?? "";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("members")
    .select("id, first_name, last_name, email, source_type, created_at", { count: "exact" })
    .eq("organization_id", organizationId);

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);
  return { data: data ?? [], total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) };
}

export async function getOrgTeamAdmins() {
  const { organizationId } = await getAdminOrg();
  const supabase = await createClient();

  const { data } = await supabase
    .from("organization_admins")
    .select("id, first_name, last_name, email, role, status, created_at")
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
