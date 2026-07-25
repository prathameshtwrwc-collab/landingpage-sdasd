import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const url = new URL(req.url);
    const memberId = url.searchParams.get("member_id");
    if (!memberId) return NextResponse.json({ error: "member_id required" }, { status: 400 });

    const supabase = await createClient();

    // Member record
    const { data: member } = await supabase.from("members").select("*").eq("id", memberId).maybeSingle();
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Organization
    const { data: org } = member.organization_id
      ? await supabase.from("organizations").select("name, unique_code, organization_type").eq("id", member.organization_id).maybeSingle()
      : { data: null };

    // Assessments with results
    const { data: assessments } = await supabase
      .from("assessments")
      .select("id, status, assessment_version_id, time_taken_seconds, started_at, completed_at")
      .eq("member_id", memberId)
      .order("started_at", { ascending: false });

    // Chronotype results
    const { data: chronoResults } = await supabase
      .from("chronotype_results")
      .select("id, assessment_id, chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score, generated_at")
      .eq("member_id", memberId)
      .order("generated_at", { ascending: false });

    // Reports
    const { data: reports } = await supabase
      .from("reports")
      .select("id, assessment_id, result_id, generated_at")
      .eq("member_id", memberId)
      .order("generated_at", { ascending: false });

    // Activity logs
    const { data: activityLogs } = await supabase
      .from("activity_logs")
      .select("id, activity_type, description, created_at")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(20);

    // Login audit
    const { data: loginAudit } = await supabase
      .from("login_audit")
      .select("id, email, ip_address, user_agent, success, created_at")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(20);

    // Assessment answers (last assessment)
    const lastAssessment = assessments?.[0];
    let answers: { question_text: string; option_text: string; lark_score: number; eagle_score: number; owl_score: number }[] = [];
    if (lastAssessment) {
      const { data: rawAnswers } = await supabase
        .from("assessment_answers")
        .select("question_id, selected_option_id")
        .eq("assessment_id", lastAssessment.id);

      if (rawAnswers) {
        for (const a of rawAnswers) {
          const { data: q } = await supabase.from("questions").select("question_text").eq("id", a.question_id).maybeSingle();
          const { data: o } = await supabase.from("question_options").select("option_text, lark_score, eagle_score, owl_score").eq("id", a.selected_option_id).maybeSingle();
          answers.push({ question_text: q?.question_text ?? "—", option_text: o?.option_text ?? "—", lark_score: o?.lark_score ?? 0, eagle_score: o?.eagle_score ?? 0, owl_score: o?.owl_score ?? 0 });
        }
      }
    }

    return NextResponse.json({
      member,
      organization: org,
      assessments: assessments ?? [],
      chronotypeResults: chronoResults ?? [],
      reports: reports ?? [],
      activityLogs: activityLogs ?? [],
      loginAudit: loginAudit ?? [],
      lastAssessmentAnswers: answers,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
