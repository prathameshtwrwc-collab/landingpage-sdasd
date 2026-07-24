"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateChronotype } from "@/lib/scoring";
import { headers } from "next/headers";

export async function getAssessmentData() {
  const supabase = await createClient();

  const { data: version } = await supabase
    .from("assessment_versions")
    .select("id")
    .eq("name", "Sleep Chronotype Assessment")
    .eq("status", "ACTIVE")
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!version) throw new Error("No active assessment version found");

  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, question_order, category")
    .eq("assessment_version_id", version.id)
    .eq("is_active", true)
    .order("question_order");

  const questionIds = questions?.map((q) => q.id) ?? [];

  const { data: options } = await supabase
    .from("question_options")
    .select("id, question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score")
    .in("question_id", questionIds)
    .order("option_order");

  const opts = options ?? [];
  const optionsByQuestion: Record<string, typeof opts> = {};
  opts.forEach((o) => {
    if (!optionsByQuestion[o.question_id]) optionsByQuestion[o.question_id] = [];
    optionsByQuestion[o.question_id]!.push(o);
  });

  return {
    versionId: version.id,
    questions: questions?.map((q) => ({
      ...q,
      options: optionsByQuestion[q.id] ?? [],
    })) ?? [],
  };
}

export async function createMemberAndStartAssessment(data: {
  first_name: string;
  last_name: string;
  age: string;
  email: string;
  phone: string;
  gender?: string;
  marital_status?: string;
  department?: string;
  country?: string;
  location?: string;
  city?: string;
  pincode?: string;
  occupation?: string;
  org_code?: string;
  referral_code?: string;
}) {
  const supabase = await createClient();

  // Check for existing member by email
  const { data: existing } = await supabase
    .from("members")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  let memberId: string;
  let organizationId: string | null = null;
  let sourceType: "ORGANIZATION" | "DIRECT" | "REFERRAL" = "DIRECT";

  // Look up organization by code if provided
  if (data.org_code) {
    const { data: orgLink } = await supabase
      .from("organization_links")
      .select("organization_id")
      .eq("unique_code", data.org_code)
      .eq("active", true)
      .maybeSingle();
    if (orgLink) {
      organizationId = orgLink.organization_id;
      sourceType = "ORGANIZATION";
    }
  }

  // If referral code is provided, set source to REFERRAL
  if (data.referral_code) {
    sourceType = "REFERRAL";
  }

  if (existing) {
    memberId = existing.id;
  } else {
    const parsedAge = (() => {
      const n = parseInt(data.age, 10);
      return isNaN(n) ? null : n;
    })();

    const memberData: Record<string, unknown> = {
      first_name: data.first_name,
      last_name: data.last_name,
      age: parsedAge,
      email: data.email,
      phone: data.phone,
      gender: data.gender || null,
      marital_status: data.marital_status || null,
      department: data.department || null,
      country: data.country || null,
      location: data.location || null,
      city: data.city || null,
      pincode: data.pincode || null,
      occupation: data.occupation || null,
      organization_id: organizationId,
      source_type: sourceType,
      referral_code: data.referral_code || null,
    };

    const { data: member, error } = await supabase
      .from("members")
      .insert(memberData)
      .select()
      .single();
    if (error) throw new Error(error.message);
    memberId = member.id;

    // Create referral record if applicable
    if (data.referral_code) {
      const { data: referrer } = await supabase
        .from("members")
        .select("id")
        .eq("referral_code", data.referral_code)
        .maybeSingle();
      if (referrer) {
        await supabase.from("referrals").insert({
          referrer_member_id: referrer.id,
          referred_member_id: memberId,
          referral_code: data.referral_code,
          status: "COMPLETED",
        });
      }
    }
  }

  // If member already exists, check for an in-progress (STARTED) assessment
  if (existing) {
    const { data: started } = await supabase
      .from("assessments")
      .select("id, assessment_version_id")
      .eq("member_id", memberId)
      .eq("status", "STARTED")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (started) {
      // Get the last answered question index for this assessment
      const { data: existingAnswers } = await supabase
        .from("assessment_answers")
        .select("question_id, selected_option_id")
        .eq("assessment_id", started.id);

      // Get the questions for this version in order
      const { data: questions } = await supabase
        .from("questions")
        .select("id")
        .eq("assessment_version_id", started.assessment_version_id)
        .eq("is_active", true)
        .order("question_order");

      let lastAnsweredIndex = 0;
      const existingAnswerMap: Record<string, string> = {};
      if (existingAnswers && questions) {
        const questionOrder = questions.map((q) => q.id);
        existingAnswers.forEach((a) => {
          const idx = questionOrder.indexOf(a.question_id);
          if (idx >= 0) {
            existingAnswerMap[idx] = a.selected_option_id;
          }
        });
        // Find the first unanswered question index
        lastAnsweredIndex = existingAnswers.length;
      }

      return {
        memberId,
        assessmentId: started.id,
        resumeIndex: lastAnsweredIndex,
        existingAnswers: existingAnswerMap,
      };
    }
  }

  const { data: version } = await supabase
    .from("assessment_versions")
    .select("id")
    .eq("name", "Sleep Chronotype Assessment")
    .eq("status", "ACTIVE")
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!version) throw new Error("No active assessment version");

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || undefined;
  const ua = headersList.get("user-agent") || undefined;

  const { data: assessment, error: asErr } = await supabase
    .from("assessments")
    .insert({
      member_id: memberId,
      organization_id: organizationId,
      assessment_version_id: version.id,
      status: "STARTED",
      ip_address: ip,
      user_agent: ua,
    })
    .select()
    .single();

  if (asErr) throw new Error(asErr.message);

  return { memberId, assessmentId: assessment.id };
}

export async function submitAssessment(
  assessmentId: string,
  answers: { question_id: string; selected_option_id: string }[]
) {
  const supabase = await createClient();

  const { error: ansErr } = await supabase.from("assessment_answers").insert(
    answers.map((a) => ({
      assessment_id: assessmentId,
      question_id: a.question_id,
      selected_option_id: a.selected_option_id,
    }))
  );
  if (ansErr) throw new Error(ansErr.message);

  const optionIds = answers.map((a) => a.selected_option_id);
  const { data: scoredOptions } = await supabase
    .from("question_options")
    .select("id, lark_score, eagle_score, owl_score")
    .in("id", optionIds);

  if (!scoredOptions) throw new Error("Failed to load option scores");

  const result = calculateChronotype(
    scoredOptions.map((o) => ({
      option_id: o.id,
      lark_score: o.lark_score,
      eagle_score: o.eagle_score,
      owl_score: o.owl_score,
    }))
  );

  const { data: assessment } = await supabase
    .from("assessments")
    .select("member_id, organization_id")
    .eq("id", assessmentId)
    .single();

  if (!assessment) throw new Error("Assessment not found");

  // Fetch organization name if linked
  let orgName: string | null = null;
  if (assessment.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", assessment.organization_id)
      .single();
    orgName = org?.name ?? null;
  }

  const { error: resErr } = await supabase.from("chronotype_results").insert({
    assessment_id: assessmentId,
    member_id: assessment.member_id,
    organization_id: assessment.organization_id,
    chronotype: result.chronotype,
    total_score: result.total_score,
    confidence_score: result.confidence_score,
    lark_score: result.lark_score,
    eagle_score: result.eagle_score,
    owl_score: result.owl_score,
  });
  if (resErr) throw new Error(resErr.message);

  const { data: recommendations } = await supabase
    .from("recommendations")
    .select("id")
    .eq("chronotype", result.chronotype)
    .eq("is_active", true);

  if (recommendations && recommendations.length > 0) {
    await supabase.from("member_recommendations").insert(
      recommendations.map((r) => ({
        member_id: assessment.member_id,
        recommendation_id: r.id,
      }))
    );
  }

  // Fetch member's source_type for result display
  const { data: member } = await supabase
    .from("members")
    .select("source_type")
    .eq("id", assessment.member_id)
    .single();

  // Create report
  const { data: latestResult } = await supabase
    .from("chronotype_results")
    .select("id")
    .eq("assessment_id", assessmentId)
    .single();

  if (latestResult) {
    await supabase.from("reports").insert({
      member_id: assessment.member_id,
      assessment_id: assessmentId,
      result_id: latestResult.id,
    });
  }

  await supabase
    .from("assessments")
    .update({
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
      time_taken_seconds: answers.length * 15,
    })
    .eq("id", assessmentId);

  return {
    result,
    memberId: assessment.member_id,
    sourceType: member?.source_type ?? null,
    orgName,
  };
}

export async function getMemberDashboard(memberId: string) {
  const supabase = await createClient();

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .single();

  if (!member) return null;

  const { data: latestResult } = await supabase
    .from("chronotype_results")
    .select("*, assessments(assessment_version_id)")
    .eq("member_id", memberId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  const { data: recommendations } = await supabase
    .from("member_recommendations")
    .select("recommendations(*)")
    .eq("member_id", memberId);

  const { data: assessments } = await supabase
    .from("assessments")
    .select("id, status, started_at, completed_at")
    .eq("member_id", memberId)
    .order("started_at", { ascending: false });

  return {
    member,
    result: latestResult ?? null,
    recommendations: recommendations?.map((r) => r.recommendations) ?? [],
    assessments: assessments ?? [],
  };
}
