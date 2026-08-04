import { createClient } from "@supabase/supabase-js";

export type PublicResultData = {
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  chronotype: string;
  totalScore: number | null;
  confidenceScore: number | null;
  larkScore: number | null;
  eagleScore: number | null;
  owlScore: number | null;
  completedAt: string | null;
  brandingCompany: string;
  brandingLogo: string;
  wakeTime: string | null;
  bedtime: string | null;
  peakFocus: string | null;
};

export async function fetchPublicResult(
  assessmentId: string,
): Promise<PublicResultData | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: assessment } = await supabase
    .from("assessments")
    .select("member_id, organization_id, completed_at")
    .eq("id", assessmentId)
    .eq("status", "COMPLETED")
    .maybeSingle();

  if (!assessment) {
    return null;
  }

  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name, email, referral_code")
    .eq("id", assessment.member_id)
    .maybeSingle();

  /* An assessment always references a member (FK ON DELETE CASCADE), so a
     missing member means the data is inconsistent — fail closed instead of
     returning a partial or mismatched result. */
  if (!member) {
    return null;
  }

  const { data: result } = await supabase
    .from("chronotype_results")
    .select("chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  if (!result) {
    return null;
  }

  // Member's actual selected inputs → personal wake / focus / bedtime shown
  // on the shared result page. Q1 = wake time, Q2 = bedtime, Q3 = peak
  // productivity, Q10 = natural sleepiness (fallback for bedtime).
  const { data: scheduleRows } = await supabase
    .from("assessment_answers")
    .select(`
      questions!inner(question_order),
      question_options!inner(option_text)
    `)
    .eq("assessment_id", assessmentId);

  let wakeTime: string | null = null;
  let bedtime: string | null = null;
  let peakFocus: string | null = null;
  (scheduleRows ?? []).forEach((row) => {
    const order = (row as { questions: { question_order: number }[] }).questions?.[0]?.question_order;
    const text = (row as { question_options: { option_text: string }[] }).question_options?.[0]?.option_text;
    if (!order || !text) return;
    if (order === 1) wakeTime = text;
    else if (order === 2) bedtime = text;
    else if (order === 3) peakFocus = text;
    else if (order === 10 && !bedtime) bedtime = text;
  });

  let brandingCompany = "";
  let brandingLogo = "";

  if (assessment.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("branding_company, branding_logo")
      .eq("id", assessment.organization_id)
      .maybeSingle();

    brandingCompany = org?.branding_company ?? "";
    brandingLogo = org?.branding_logo ?? "";

    if (!brandingCompany || !brandingLogo) {
      const { data: orgLink } = await supabase
        .from("organization_links")
        .select("branding_company, branding_logo")
        .eq("organization_id", assessment.organization_id)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orgLink) {
        brandingCompany = orgLink.branding_company ?? brandingCompany;
        brandingLogo = orgLink.branding_logo ?? brandingLogo;
      }
    }
  }

  return {
    firstName: member.first_name ?? "",
    lastName: member.last_name ?? "",
    email: member.email ?? "",
    referralCode: member.referral_code ?? "",
    chronotype: result.chronotype,
    totalScore: result.total_score,
    confidenceScore: result.confidence_score,
    larkScore: result.lark_score,
    eagleScore: result.eagle_score,
    owlScore: result.owl_score,
    completedAt: assessment.completed_at ?? null,
    brandingCompany,
    brandingLogo,
    wakeTime,
    bedtime,
    peakFocus,
  };
}
