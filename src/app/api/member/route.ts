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

    // Get org code if member belongs to an organization
    let orgCode = "";
    if (member.organization_id) {
      const { data: orgLink } = await supabase
        .from("organization_links")
        .select("unique_code")
        .eq("organization_id", member.organization_id)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (orgLink) orgCode = orgLink.unique_code;
    }

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

    const { data: reports } = await supabase
      .from("reports")
      .select("id, result_id, generated_at")
      .eq("member_id", member.id)
      .order("generated_at", { ascending: false });

    const reportsEnriched = (reports ?? []).map((r) => ({
      id: r.id,
      result_id: r.result_id,
      generated_at: r.generated_at,
      chronotype: null as string | null,
      totalScore: null as number | null,
      larkScore: null as number | null,
      eagleScore: null as number | null,
      owlScore: null as number | null,
    }));

    const resultIds = reportsEnriched.filter((r) => r.result_id).map((r) => r.result_id);
    if (resultIds.length > 0) {
      const { data: chronoResults } = await supabase
        .from("chronotype_results")
        .select("id, chronotype, total_score, lark_score, eagle_score, owl_score")
        .in("id", resultIds);
      if (chronoResults) {
        const resultMap = new Map(chronoResults.map((cr: Record<string, unknown>) => [cr.id, cr]));
        reportsEnriched.forEach((r) => {
          const cr = r.result_id ? resultMap.get(r.result_id) : undefined;
          if (cr) {
            r.chronotype = cr.chronotype as string | null;
            r.totalScore = cr.total_score as number | null;
            r.larkScore = cr.lark_score as number | null;
            r.eagleScore = cr.eagle_score as number | null;
            r.owlScore = cr.owl_score as number | null;
          }
        });
      }
    }

    return NextResponse.json({
      member,
      orgCode,
      result: latestResult ?? null,
      recommendations: recData?.map((r: Record<string, unknown>) => r.recommendations) ?? [],
      assessments: assessments ?? [],
      reports: reportsEnriched,
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal error: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
