import { createClient } from "@/lib/supabase/server";

export async function getPlatformStats() {
  const supabase = await createClient();

  const [{ count: orgs }, { count: members }, { count: assessments }, { count: admins }] =
    await Promise.all([
      supabase.from("organizations").select("*", { count: "exact", head: true }),
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("assessments").select("*", { count: "exact", head: true }).eq("status", "COMPLETED"),
      supabase.from("organization_admins").select("*", { count: "exact", head: true }),
    ]);

  const { data: chronoDist } = await supabase
    .from("chronotype_results")
    .select("chronotype");

  const chronoCounts = { LARK: 0, EAGLE: 0, OWL: 0 };
  chronoDist?.forEach((r) => {
    if (r.chronotype in chronoCounts) chronoCounts[r.chronotype as keyof typeof chronoCounts]++;
  });
  const totalChrono = chronoDist?.length || 1;

  return {
    organizations: orgs ?? 0,
    members: members ?? 0,
    assessments: assessments ?? 0,
    admins: admins ?? 0,
    chronotypeDistribution: {
      lark: Math.round((chronoCounts.LARK / totalChrono) * 100),
      eagle: Math.round((chronoCounts.EAGLE / totalChrono) * 100),
      owl: Math.round((chronoCounts.OWL / totalChrono) * 100),
    },
  };
}

export async function getOrganizations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, organization_type, unique_code, status, country, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  // Fetch the latest link status for each organization
  const orgIds = (data ?? []).map((o) => o.id);
  const { data: links } = await supabase
    .from("organization_links")
    .select("organization_id, active, unique_code")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  // Merge link data into org records
  const linkMap = new Map<string, { active: boolean; unique_code: string }>();
  (links ?? []).forEach((l) => {
    if (!linkMap.has(l.organization_id)) {
      linkMap.set(l.organization_id, { active: l.active ?? false, unique_code: l.unique_code ?? "" });
    }
  });

  return (data ?? []).map((o) => ({
    ...o,
    link_active: linkMap.get(o.id)?.active ?? false,
    link_code: linkMap.get(o.id)?.unique_code ?? o.unique_code,
  }));
}

export async function getAllMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, age, gender, source_type, organization_id, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getOrganizationMembers(orgId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, age, gender, source_type, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getOrganizationDetails(orgId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getOrganizationAdmins() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_admins")
    .select("id, first_name, last_name, email, role, status, organization_id, organizations(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
