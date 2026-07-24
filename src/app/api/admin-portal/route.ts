import { NextResponse } from "next/server";
import { getAdminDashboardStats, getAdminMembers, getAdminAssessmentResults, getOrgTeamAdmins } from "@/lib/queries/admin-portal";

export async function GET(req: Request) {
  try {
    let stats, members, results, team;
    try {
      const url = new URL(req.url);
      const memberPage = Math.max(1, parseInt(url.searchParams.get("member_page") ?? "1", 10));
      const memberLimit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("member_limit") ?? "50", 10)));
      const memberSearch = url.searchParams.get("member_search") || undefined;

      [stats, members, results, team] = await Promise.all([
        getAdminDashboardStats(),
        getAdminMembers({ page: memberPage, limit: memberLimit, search: memberSearch }),
        getAdminAssessmentResults(),
        getOrgTeamAdmins(),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("relation")) {
        return NextResponse.json({ error: "Database tables not found. Run supabase/schema.sql → schema2.sql → schema3.sql in Supabase SQL Editor." }, { status: 500 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ stats, members, results, team });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
