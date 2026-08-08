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
    const [{ data: org }, { data: assessments }, { data: chronoResults }, { data: reports }, { data: activityLogs }, { data: loginAudit }] = await Promise.all([
      member.organization_id
        ? supabase.from("organizations").select("name, unique_code, organization_type").eq("id", member.organization_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("assessments")
        .select("id, status, assessment_version_id, time_taken_seconds, started_at, completed_at")
        .eq("member_id", memberId)
        .order("started_at", { ascending: false }),
      supabase
        .from("chronotype_results")
        .select("id, assessment_id, chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score, generated_at")
        .eq("member_id", memberId)
        .order("generated_at", { ascending: false }),
      supabase
        .from("reports")
        .select("id, assessment_id, result_id, generated_at")
        .eq("member_id", memberId)
        .order("generated_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("id, user_type, user_id, action, entity_type, details_json, created_at")
        .eq("user_id", memberId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("login_audit")
        .select("id, user_type, user_id, ip_address, login_at")
        .eq("user_id", memberId)
        .order("login_at", { ascending: false })
        .limit(20),
    ]);

    // Assessment answers (last assessment)
    const lastAssessment = assessments?.[0];
    let answers: { question_text: string; option_text: string; lark_score: number; eagle_score: number; owl_score: number }[] = [];
    if (lastAssessment) {
      const { data: rawAnswers } = await supabase
        .from("assessment_answers")
        .select("question_id, selected_option_id")
        .eq("assessment_id", lastAssessment.id);

      if (rawAnswers && rawAnswers.length > 0) {
        const questionIds = rawAnswers.map((a) => a.question_id);
        const optionIds = rawAnswers.map((a) => a.selected_option_id);

        const [{ data: questions }, { data: options }] = await Promise.all([
          supabase.from("questions").select("id, question_text").in("id", questionIds),
          supabase.from("question_options").select("id, option_text, lark_score, eagle_score, owl_score").in("id", optionIds),
        ]);

        const questionMap = new Map((questions ?? []).map((q) => [q.id, q]));
        const optionMap = new Map((options ?? []).map((o) => [o.id, o]));

        answers = rawAnswers.map((a) => {
          const q = questionMap.get(a.question_id);
          const o = optionMap.get(a.selected_option_id);
          return {
            question_text: q?.question_text ?? "—",
            option_text: o?.option_text ?? "—",
            lark_score: o?.lark_score ?? 0,
            eagle_score: o?.eagle_score ?? 0,
            owl_score: o?.owl_score ?? 0,
          };
        });
      }
    }

    return NextResponse.json({
      member,
      organization: org,
      assessments: assessments ?? [],
      chronotypeResults: chronoResults ?? [],
      reports: reports ?? [],
      activityLogs: (activityLogs ?? []).map((a) => {
        const details = (a.details_json ?? {}) as Record<string, unknown>;
        return {
          id: a.id,
          activity_type: a.action,
          description: String(details.description ?? details.message ?? a.action),
          created_at: a.created_at,
        };
      }),
      loginAudit: (loginAudit ?? []).map((a) => ({
        id: a.id,
        success: true,
        email: null,
        ip_address: a.ip_address,
        created_at: a.login_at,
      })),
      lastAssessmentAnswers: answers,
    }, {
      headers: { "Cache-Control": "private, max-age=20, stale-while-revalidate=60" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
