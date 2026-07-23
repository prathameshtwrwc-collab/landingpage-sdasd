import type { createClient } from "./server";

type DBClient = Awaited<ReturnType<typeof createClient>>;

// ─── Assessment Versions ────────────────────────────────────────
export async function getActiveAssessmentVersion(client: DBClient) {
  return client
    .from("assessment_versions")
    .select("id, name, version")
    .eq("status", "ACTIVE")
    .order("version", { ascending: false })
    .limit(1)
    .single();
}

// ─── Questions ──────────────────────────────────────────────────
export async function getQuestionsForVersion(
  client: DBClient,
  versionId: string
) {
  return client
    .from("questions")
    .select("id, question_text, question_order, category")
    .eq("assessment_version_id", versionId)
    .eq("is_active", true)
    .order("question_order");
}

// ─── Question Options ───────────────────────────────────────────
export async function getOptionsForQuestions(
  client: DBClient,
  questionIds: string[]
) {
  return client
    .from("question_options")
    .select("id, question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score")
    .in("question_id", questionIds)
    .order("option_order");
}

// ─── Members ────────────────────────────────────────────────────
export async function getMemberByEmail(client: DBClient, email: string) {
  return client
    .from("members")
    .select("*")
    .eq("email", email)
    .single();
}

export async function createMember(
  client: DBClient,
  data: {
    first_name: string;
    last_name: string;
    age: number;
    email: string;
    phone: string;
    gender?: string;
    country?: string;
    city?: string;
    pincode?: string;
    occupation?: string;
    organization_id?: string | null;
    source_type?: "ORGANIZATION" | "DIRECT" | "REFERRAL";
    referral_code?: string;
  }
) {
  return client.from("members").insert(data).select().single();
}

// ─── Assessments ────────────────────────────────────────────────
export async function createAssessment(
  client: DBClient,
  data: {
    member_id: string;
    organization_id?: string | null;
    assessment_version_id: string;
    ip_address?: string;
    user_agent?: string;
  }
) {
  return client.from("assessments").insert(data).select().single();
}

export async function completeAssessment(
  client: DBClient,
  assessmentId: string,
  timeTakenSeconds: number
) {
  return client
    .from("assessments")
    .update({ status: "COMPLETED", completed_at: new Date().toISOString(), time_taken_seconds: timeTakenSeconds })
    .eq("id", assessmentId);
}

// ─── Answers ────────────────────────────────────────────────────
export async function insertAnswers(
  client: DBClient,
  answers: { assessment_id: string; question_id: string; selected_option_id: string }[]
) {
  return client.from("assessment_answers").insert(answers);
}

// ─── Results ────────────────────────────────────────────────────
export async function insertChronotypeResult(
  client: DBClient,
  data: {
    assessment_id: string;
    member_id: string;
    organization_id?: string | null;
    chronotype: "LARK" | "EAGLE" | "OWL";
    total_score: number;
    confidence_score: number;
    lark_score: number;
    eagle_score: number;
    owl_score: number;
  }
) {
  return client.from("chronotype_results").insert(data).select().single();
}

export async function getLatestResultForMember(
  client: DBClient,
  memberId: string
) {
  return client
    .from("chronotype_results")
    .select("*, assessments!inner(assessment_version_id)")
    .eq("member_id", memberId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();
}

// ─── Recommendations ────────────────────────────────────────────
export async function getRecommendationsForChronotype(
  client: DBClient,
  chronotype: "LARK" | "EAGLE" | "OWL"
) {
  return client
    .from("recommendations")
    .select("*")
    .eq("chronotype", chronotype)
    .eq("is_active", true)
    .order("priority_order");
}

export async function assignRecommendations(
  client: DBClient,
  memberId: string,
  recommendationIds: string[]
) {
  return client.from("member_recommendations").insert(
    recommendationIds.map((rid) => ({ member_id: memberId, recommendation_id: rid }))
  );
}

// ─── Organization ────────────────────────────────────────────────
export async function getOrganizationByCode(client: DBClient, code: string) {
  return client
    .from("organization_links")
    .select("organization_id, organizations!inner(*)")
    .eq("unique_code", code)
    .eq("active", true)
    .single();
}

export async function getMemberAssessmentsWithResults(
  client: DBClient,
  memberId: string
) {
  return client
    .from("assessments")
    .select("*, chronotype_results(*)")
    .eq("member_id", memberId)
    .order("started_at", { ascending: false });
}

export async function getOrganizationMembers(
  client: DBClient,
  organizationId: string
) {
  return client
    .from("members")
    .select("id, first_name, last_name, email, chronotype_results(chronotype)")
    .eq("organization_id", organizationId);
}

export async function getOrganizationStats(
  client: DBClient,
  organizationId: string
) {
  const { count: totalMembers } = await client
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  const { count: completedAssessments } = await client
    .from("assessments")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("status", "COMPLETED");

  return { totalMembers, completedAssessments };
}
