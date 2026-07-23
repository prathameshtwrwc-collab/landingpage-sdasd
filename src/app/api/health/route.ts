import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // Check 1: Environment variables
  checks.hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  checks.hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Check 2: Supabase connectivity
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("organizations").select("id").limit(1);
    checks.supabaseConnected = !error;
    checks.supabaseError = error?.message ?? null;
    checks.tablesExist = !error || !error.message?.includes("relation") ? true : false;
  } catch (err) {
    checks.supabaseConnected = false;
    checks.supabaseError = err instanceof Error ? err.message : "Unknown error";
  }

  // Check 3: Database schema tables
  try {
    const supabase = await createClient();
    const tables = ["organizations", "organization_admins", "members", "assessment_versions", "questions", "question_options", "assessments", "assessment_answers", "chronotype_results", "recommendations", "member_recommendations", "organization_links"];
    const results: Record<string, boolean> = {};
    for (const table of tables) {
      const { error } = await supabase.from(table).select("id").limit(1);
      results[table] = !error;
    }
    checks.tableStatus = results;
  } catch {
    checks.tableStatus = "Could not check tables";
  }

  const healthy = checks.supabaseConnected === true && checks.tablesExist === true;

  return NextResponse.json({
    status: healthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    ...checks,
    instructions: !checks.supabaseConnected
      ? "Run schema.sql → schema2.sql → schema3.sql in Supabase SQL Editor (in that order). Files are in supabase/ directory."
      : undefined,
  });
}
