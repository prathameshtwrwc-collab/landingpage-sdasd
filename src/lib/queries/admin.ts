import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 10;

export async function getPlatformStats() {
  const supabase = await createClient();
  const [orgsCount, membersCount, assessmentsCount, adminsCount, larkCount, eagleCount, owlCount] =
    await Promise.all([
      supabase.from("organizations").select("*", { count: "exact", head: true }),
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("assessments").select("*", { count: "exact", head: true }).eq("status", "COMPLETED"),
      supabase.from("organization_admins").select("*", { count: "exact", head: true }),
      supabase.from("chronotype_results").select("*", { count: "exact", head: true }).eq("chronotype", "LARK"),
      supabase.from("chronotype_results").select("*", { count: "exact", head: true }).eq("chronotype", "EAGLE"),
      supabase.from("chronotype_results").select("*", { count: "exact", head: true }).eq("chronotype", "OWL"),
    ]);
  const totalChrono = (larkCount.count ?? 0) + (eagleCount.count ?? 0) + (owlCount.count ?? 0) || 1;
  return {
    organizations: orgsCount.count ?? 0,
    members: membersCount.count ?? 0,
    assessments: assessmentsCount.count ?? 0,
    admins: adminsCount.count ?? 0,
    chronotypeDistribution: {
      lark: Math.round(((larkCount.count ?? 0) / totalChrono) * 100),
      eagle: Math.round(((eagleCount.count ?? 0) / totalChrono) * 100),
      owl: Math.round(((owlCount.count ?? 0) / totalChrono) * 100),
    },
  };
}

export async function getOrganizations(opts?: { page?: number; limit?: number; search?: string }) {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const search = opts?.search?.trim() ?? "";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("organizations")
    .select("id, name, organization_type, unique_code, status, country, created_at", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,unique_code.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  // Fetch link statuses for this page of orgs
  const orgIds = (data ?? []).map((o) => o.id);
  const { data: links } = await supabase
    .from("organization_links")
    .select("organization_id, active, unique_code")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  const linkMap = new Map<string, { active: boolean; unique_code: string }>();
  (links ?? []).forEach((l) => {
    if (!linkMap.has(l.organization_id)) {
      linkMap.set(l.organization_id, { active: l.active ?? false, unique_code: l.unique_code ?? "" });
    }
  });

  return {
    data: (data ?? []).map((o) => ({
      ...o,
      link_active: linkMap.get(o.id)?.active ?? false,
      link_code: linkMap.get(o.id)?.unique_code ?? o.unique_code,
    })),
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getAllMembers(opts?: { page?: number; limit?: number; search?: string }) {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const search = opts?.search?.trim() ?? "";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("members")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);
  return { data: data ?? [], total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) };
}

export async function getOrganizationMembers(orgId: string, opts?: { page?: number; limit?: number }) {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, age, gender, source_type, created_at", { count: "exact" })
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  return { data: data ?? [], total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) };
}

export async function getOrganizationDetails(orgId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*").eq("id", orgId).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getOrganizationAdmins(opts?: { page?: number; limit?: number; search?: string }) {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const search = opts?.search?.trim() ?? "";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("organization_admins")
    .select("*, organizations(name)", { count: "exact" });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);
  return { data: data ?? [], total: count ?? 0, page, limit, totalPages: Math.ceil((count ?? 0) / limit) };
}
