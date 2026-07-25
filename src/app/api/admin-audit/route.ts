import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = await createClient();
    const url = new URL(req.url);

    const search = url.searchParams.get("search") || "";
    const type = url.searchParams.get("type") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(200, Math.max(10, parseInt(url.searchParams.get("limit") ?? "50", 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const tableExists = async (table: string) => {
      const { error } = await supabase.from(table).select("id", { count: "exact", head: true }).limit(1);
      return !(error && error.message.includes("relation"));
    };

    // ── Determine which tables exist ──
    const hasActivityLogs = await tableExists("activity_logs");
    const hasLoginAudit = await tableExists("login_audit");

    // ── Query activity_logs ──
    let activities: { id: string; member_id: string | null; activity_type: string; description: string | null; created_at: string; _source: string }[] = [];
    let alCount = 0;
    if (hasActivityLogs && (!type || type !== "login_audit")) {
      let aq = supabase
        .from("activity_logs")
        .select("id, member_id, activity_type, description, metadata, created_at", { count: "exact" });
      if (type && type !== "login_audit") aq = aq.eq("activity_type", type);
      if (search) aq = aq.or(`description.ilike.%${search}%,activity_type.ilike.%${search}%`);
      const { data: ad, error: ae, count: ac } = await aq.order("created_at", { ascending: false }).range(from, to);
      if (!ae) { activities = (ad ?? []).map((r) => ({ ...r, _source: "activity" })); alCount = ac ?? 0; }
    }

    // ── Query login_audit ──
    let logins: { id: string; member_id: string | null; email: string | null; ip_address: string | null; success: boolean | null; created_at: string; _source: string; activity_type: string; description: string }[] = [];
    let loginTotal = 0;
    if (hasLoginAudit && (!type || type === "LOGIN" || type === "login_audit")) {
      let lq = supabase
        .from("login_audit")
        .select("id, member_id, email, ip_address, success, created_at", { count: "exact" });
      if (search) lq = lq.or(`email.ilike.%${search}%,ip_address.ilike.%${search}%`);
      const { data: ld, error: le, count: lc } = await lq.order("created_at", { ascending: false }).range(0, 49);
      if (!le) {
        logins = (ld ?? []).map((r) => ({
          id: r.id, member_id: r.member_id, email: r.email, ip_address: r.ip_address,
          success: r.success, created_at: r.created_at, _source: "login_audit",
          activity_type: r.success ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
          description: r.success ? `Login by ${r.email ?? "unknown"}` : `Failed login attempt for ${r.email ?? "unknown"}`,
        }));
        loginTotal = lc ?? 0;
      }
    }

    // ── Supplement with assessment & member activity ──
    const supplement: { id: string; activity_type: string; description: string; member_id: string | null; created_at: string; _source: string }[] = [];
    if (!type) {
      const { data: recentAssessments } = await supabase
        .from("assessments")
        .select("id, member_id, status, completed_at, started_at")
        .order("started_at", { ascending: false })
        .range(0, 20);

      if (recentAssessments) {
        (recentAssessments ?? []).forEach((a) => {
          const ts: string | null = (a.completed_at ?? a.started_at) as string | null;
          if (!ts) return;
          supplement.push({
            id: a.id as string,
            activity_type: a.status === "COMPLETED" ? "ASSESSMENT_COMPLETED" : "ASSESSMENT_STARTED",
            description: a.status === "COMPLETED" ? `Assessment completed` : `Assessment started`,
            member_id: a.member_id as string | null,
            created_at: ts,
            _source: "assessment",
          });
        });
      }

      const { data: recentMembers } = await supabase
        .from("members")
        .select("id, first_name, last_name, email, created_at")
        .order("created_at", { ascending: false })
        .range(0, 20);

      if (recentMembers) {
        (recentMembers ?? []).forEach((m) => {
          supplement.push({
            id: m.id as string,
            activity_type: "MEMBER_REGISTERED",
            description: `Member registered: ${m.first_name ?? ""} ${m.last_name ?? ""} (${m.email ?? "—"})`.trim(),
            member_id: m.id as string | null,
            created_at: m.created_at as string,
            _source: "member",
          });
        });
      }
    }

    // ── Combine, sort, paginate ──
    const allEntries: { created_at: string }[] = [...activities, ...logins, ...supplement];
    const combined = allEntries
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, limit);

    const total = activities.length + loginTotal + supplement.length;

    return NextResponse.json({
      data: combined.slice(0, limit),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      activityTypes: activities
        ? [...new Set(activities.map((r) => r.activity_type).filter(Boolean))].sort()
        : [],
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
