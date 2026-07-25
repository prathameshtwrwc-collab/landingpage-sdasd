import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(_request: Request, { params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: assessment } = await supabase
    .from("assessments")
    .select("member_id")
    .eq("id", assessmentId)
    .eq("status", "COMPLETED")
    .maybeSingle();

  if (!assessment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name, email")
    .eq("id", assessment.member_id)
    .maybeSingle();

  const { data: result } = await supabase
    .from("chronotype_results")
    .select("chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  return NextResponse.json({
    firstName: member?.first_name ?? "",
    lastName: member?.last_name ?? "",
    email: member?.email ?? "",
    chronotype: result.chronotype,
    totalScore: result.total_score,
    confidenceScore: result.confidence_score,
    larkScore: result.lark_score,
    eagleScore: result.eagle_score,
    owlScore: result.owl_score,
  });
}
