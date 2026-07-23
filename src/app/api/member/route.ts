import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const memberId = searchParams.get("member_id");

  if (!email && !memberId) {
    return NextResponse.json({ error: "email or member_id required" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    return NextResponse.json({ error: `Supabase connection failed: ${err instanceof Error ? err.message : "Check env vars"}` }, { status: 500 });
  }

  try {
    if (memberId) {
      const { data: result, error: resultErr } = await supabase
        .from("chronotype_results")
        .select("*, assessments(assessment_version_id)")
        .eq("member_id", memberId)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (resultErr) return NextResponse.json({ error: `DB error: ${resultErr.message}` }, { status: 500 });
      return NextResponse.json({ result: result ?? null });
    }

    const { data: member, error: memberErr } = await supabase
      .from("members")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (memberErr) return NextResponse.json({ error: `DB error: ${memberErr.message}` }, { status: 500 });
    if (!member) return NextResponse.json({ member: null, result: null, recommendations: [], assessments: [] });

    const { data: latestResult } = await supabase
      .from("chronotype_results")
      .select("*, assessments(assessment_version_id)")
      .eq("member_id", member.id)
      .order("generated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: recData } = await supabase
      .from("member_recommendations")
      .select("recommendations(*)")
      .eq("member_id", member.id);

    const { data: assessments } = await supabase
      .from("assessments")
      .select("id, status, started_at, completed_at")
      .eq("member_id", member.id)
      .order("started_at", { ascending: false });

    return NextResponse.json({
      member,
      result: latestResult ?? null,
      recommendations: recData?.map((r: Record<string, unknown>) => r.recommendations) ?? [],
      assessments: assessments ?? [],
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal error: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
