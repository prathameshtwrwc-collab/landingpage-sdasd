import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const supabase = await createClient();

    const { data: versions } = await supabase
      .from("assessment_versions")
      .select("id, name, description, version, status, created_at")
      .order("created_at", { ascending: false });

    if (!versions || versions.length === 0) {
      return NextResponse.json({ versions: [] }, { headers: CACHE_HEADERS });
    }

    const versionIds = versions.map((v) => v.id);

    // Batch-load all child rows in a handful of queries instead of the old
    // N+1 pattern (several queries per version + one per question).
    const [questionsRes, rulesRes, responsesRes] = await Promise.all([
      supabase
        .from("questions")
        .select("id, assessment_version_id, question_text, question_order, category, is_active")
        .in("assessment_version_id", versionIds)
        .order("question_order"),
      supabase
        .from("scoring_rules")
        .select("assessment_version_id, min_score, max_score, chronotype, label, description")
        .in("assessment_version_id", versionIds)
        .order("min_score"),
      supabase
        .from("assessments")
        .select("assessment_version_id")
        .eq("status", "COMPLETED")
        .in("assessment_version_id", versionIds),
    ]);

    const questions = questionsRes.data ?? [];
    const rules = rulesRes.data ?? [];
    const responses = responsesRes.data ?? [];

    const questionsByVersion = new Map<string, typeof questions>();
    for (const q of questions) {
      const list = questionsByVersion.get(q.assessment_version_id) ?? [];
      list.push(q);
      questionsByVersion.set(q.assessment_version_id, list);
    }

    const rulesByVersion = new Map<string, typeof rules>();
    for (const r of rules) {
      const list = rulesByVersion.get(r.assessment_version_id) ?? [];
      list.push(r);
      rulesByVersion.set(r.assessment_version_id, list);
    }

    const responseCounts = new Map<string, number>();
    for (const a of responses) {
      responseCounts.set(a.assessment_version_id, (responseCounts.get(a.assessment_version_id) ?? 0) + 1);
    }

    // Load options for every question in one batched query.
    const questionIds = questions.map((q) => q.id);
    const { data: options } = questionIds.length > 0
      ? await supabase
          .from("question_options")
          .select("question_id, id, option_text, option_value, option_order, lark_score, eagle_score, owl_score")
          .in("question_id", questionIds)
          .order("option_order")
      : { data: [] };

    const optionsByQuestion = new Map<string, typeof options>();
    for (const o of options ?? []) {
      const list = optionsByQuestion.get(o.question_id) ?? [];
      list.push(o);
      optionsByQuestion.set(o.question_id, list);
    }

    const enriched = versions.map((v) => {
      const qs = questionsByVersion.get(v.id) ?? [];
      const qCount = qs.length;
      return {
        ...v,
        questionCount: qCount,
        responseCount: responseCounts.get(v.id) ?? 0,
        scoringRules: rulesByVersion.get(v.id) ?? [],
        questions: qs.map((q) => ({ ...q, options: optionsByQuestion.get(q.id) ?? [] })),
      };
    });

    return NextResponse.json({ versions: enriched }, { headers: CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

const CACHE_HEADERS = { "Cache-Control": "private, max-age=30, stale-while-revalidate=120" };

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const supabase = await createClient();
    const body = await req.json();
    const action = body.action;

    if (action === "create_draft") {
      const { name, description, questions, scoringRules } = body;

      // Use max version, not count
      const { data: maxVersionData } = await supabase
        .from("assessment_versions")
        .select("version")
        .order("version", { ascending: false })
        .limit(1);

      const version = (maxVersionData?.[0]?.version ?? 0) + 1;

      const { data: av, error: avErr } = await supabase
        .from("assessment_versions")
        .insert({ name, description, version, status: "DRAFT" })
        .select("id")
        .single();

      if (avErr || !av) return NextResponse.json({ error: avErr?.message || "Failed" }, { status: 500 });

      const err = await insertQuestions(supabase, av.id, questions ?? []);
      if (err) return NextResponse.json({ error: err }, { status: 500 });

      const rulesErr = await insertScoringRules(supabase, av.id, scoringRules);
      if (rulesErr) return NextResponse.json({ error: rulesErr }, { status: 500 });

      return NextResponse.json({ success: true, versionId: av.id });
    }

    if (action === "update_draft") {
      const { versionId, name, description, questions, scoringRules } = body;

      // Only allow updating DRAFT versions
      const { data: existing } = await supabase
        .from("assessment_versions")
        .select("status")
        .eq("id", versionId)
        .single();

      if (!existing) return NextResponse.json({ error: "Version not found" }, { status: 404 });
      if (existing.status !== "DRAFT") return NextResponse.json({ error: "Only draft versions can be edited" }, { status: 400 });

      // Update name/description
      const { error: upErr } = await supabase
        .from("assessment_versions")
        .update({ name, description })
        .eq("id", versionId);
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

      // Delete old questions + options (CASCADE handles options)
      const { data: oldQs } = await supabase.from("questions").select("id").eq("assessment_version_id", versionId);
      if (oldQs && oldQs.length > 0) {
        await supabase.from("question_options").delete().in("question_id", oldQs.map((q) => q.id));
        await supabase.from("questions").delete().eq("assessment_version_id", versionId);
      }

      // Insert new questions + options
      const err = await insertQuestions(supabase, versionId, questions ?? []);
      if (err) return NextResponse.json({ error: err }, { status: 500 });

      // Replace scoring rules
      await supabase.from("scoring_rules").delete().eq("assessment_version_id", versionId);
      const rulesErr = await insertScoringRules(supabase, versionId, scoringRules);
      if (rulesErr) return NextResponse.json({ error: rulesErr }, { status: 500 });

      return NextResponse.json({ success: true, versionId });
    }

    if (action === "publish") {
      const { versionId } = body;

      // Validate
      const { count: qCount } = await supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("assessment_version_id", versionId);

      if (!qCount || qCount < 1) return NextResponse.json({ error: "At least one question is required" }, { status: 400 });

      const { data: questions } = await supabase
        .from("questions")
        .select("id")
        .eq("assessment_version_id", versionId);

      for (const q of questions ?? []) {
        const { count: oCount } = await supabase
          .from("question_options")
          .select("id", { count: "exact", head: true })
          .eq("question_id", q.id);
        if (!oCount || oCount < 1) return NextResponse.json({ error: "Every question must have at least one option" }, { status: 400 });

        const { data: opts } = await supabase
          .from("question_options")
          .select("option_text, lark_score, eagle_score, owl_score")
          .eq("question_id", q.id);

        for (const o of opts ?? []) {
          if (!o.option_text?.trim()) return NextResponse.json({ error: "Empty option text found" }, { status: 400 });
        }
      }

      // Check for existing active version
      const { data: activeVersion } = await supabase
        .from("assessment_versions")
        .select("id")
        .eq("status", "ACTIVE")
        .maybeSingle();

      // Archive existing active
      if (activeVersion && activeVersion.id !== versionId) {
        const { error: archErr } = await supabase
          .from("assessment_versions")
          .update({ status: "ARCHIVED" })
          .eq("id", activeVersion.id);
        if (archErr) return NextResponse.json({ error: archErr.message }, { status: 500 });
      }

      const { data: scoreRules } = await supabase
        .from("scoring_rules")
        .select("min_score, max_score, chronotype")
        .eq("assessment_version_id", versionId);

      if (!scoreRules || scoreRules.length === 0) {
        return NextResponse.json({ error: "No scoring rules defined. Add scoring rules before publishing." }, { status: 400 });
      }

      for (const r of scoreRules) {
        if (r.min_score === null || r.max_score === null) {
          return NextResponse.json({ error: "Scoring rules must have min and max scores" }, { status: 400 });
        }
      }

      // Check for overlap
      const sorted = [...scoreRules].sort((a, b) => (a.min_score ?? 0) - (b.min_score ?? 0));
      for (let i = 0; i < sorted.length - 1; i++) {
        if ((sorted[i].max_score ?? 0) >= (sorted[i + 1].min_score ?? 0)) {
          return NextResponse.json({ error: "Score ranges overlap. Adjust ranges before publishing." }, { status: 400 });
        }
      }

      // Check score range coverage.
      // A member selects exactly ONE option per question, so the true maximum
      // possible score is: for each question, take the highest of that question's
      // options' max-chronotype score, then sum across questions. Summing the max
      // of every option would over-count (e.g. 3 options × 11 questions × 3 = 99
      // instead of the real 33), causing false validation failures.
      const allOpts = await supabase
        .from("question_options")
        .select("question_id, lark_score, eagle_score, owl_score")
        .in("question_id", (questions ?? []).map((q) => q.id));

      const perQuestionMax = new Map<string, number>();
      for (const o of allOpts.data ?? []) {
        const optionMax = Math.max(o.lark_score ?? 0, o.eagle_score ?? 0, o.owl_score ?? 0);
        const current = perQuestionMax.get(o.question_id) ?? 0;
        if (optionMax > current) perQuestionMax.set(o.question_id, optionMax);
      }
      const maxPossible = Array.from(perQuestionMax.values()).reduce((sum, v) => sum + v, 0);
      const maxRule = Math.max(...scoreRules.map((r) => r.max_score ?? 0));
      const minRule = Math.min(...scoreRules.map((r) => r.min_score ?? 0));

      if (minRule > 0) {
        return NextResponse.json({ error: "Score ranges must cover 0 as minimum" }, { status: 400 });
      }
      if (maxRule < maxPossible) {
        return NextResponse.json({ error: `Score ranges don't cover maximum possible score (${maxPossible})` }, { status: 400 });
      }

      const { error: pubErr } = await supabase
        .from("assessment_versions")
        .update({ status: "ACTIVE" })
        .eq("id", versionId);

      if (pubErr) return NextResponse.json({ error: pubErr.message }, { status: 500 });

      return NextResponse.json({ success: true });
    }

    if (action === "archive") {
      const { versionId } = body;
      const { error } = await supabase.from("assessment_versions").update({ status: "ARCHIVED" }).eq("id", versionId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (action === "duplicate") {
      const { versionId } = body;
      const { data: orig } = await supabase.from("assessment_versions").select("*").eq("id", versionId).single();
      if (!orig) return NextResponse.json({ error: "Version not found" }, { status: 404 });

      // Compute the next version number as max(existing) + 1 (same as create_draft),
      // NOT orig.version + 1 — the source version number may already be taken by
      // another row, which would violate the version uniqueness constraint.
      const { data: maxVersionData } = await supabase
        .from("assessment_versions")
        .select("version")
        .order("version", { ascending: false })
        .limit(1);
      const nextVersion = (maxVersionData?.[0]?.version ?? 0) + 1;

      const { data: newV, error: newVErr } = await supabase
        .from("assessment_versions")
        .insert({ name: orig.name + " (Copy)", description: orig.description, version: nextVersion, status: "DRAFT" })
        .select("id")
        .single();
      if (!newV) return NextResponse.json({ error: newVErr?.message || "Failed to duplicate version" }, { status: 500 });

      const { data: oldQs, error: oldQsErr } = await supabase.from("questions").select("*").eq("assessment_version_id", versionId).order("question_order");
      if (oldQsErr) return NextResponse.json({ error: oldQsErr.message }, { status: 500 });

      for (const q of oldQs ?? []) {
        const { data: newQ, error: newQErr } = await supabase
          .from("questions")
          .insert({ assessment_version_id: newV.id, question_text: q.question_text, question_order: q.question_order, category: q.category, is_active: q.is_active })
          .select("id")
          .single();
        if (newQErr) return NextResponse.json({ error: newQErr.message }, { status: 500 });

        const { data: oldOpts, error: oldOptsErr } = await supabase.from("question_options").select("*").eq("question_id", q.id).order("option_order");
        if (oldOptsErr) return NextResponse.json({ error: oldOptsErr.message }, { status: 500 });

        for (const o of oldOpts ?? []) {
          const { error: newOptErr } = await supabase.from("question_options").insert({ question_id: newQ.id, option_text: o.option_text, option_value: o.option_value, option_order: o.option_order, lark_score: o.lark_score, eagle_score: o.eagle_score, owl_score: o.owl_score });
          if (newOptErr) return NextResponse.json({ error: newOptErr.message }, { status: 500 });
        }
      }

      const { data: oldRules } = await supabase.from("scoring_rules").select("*").eq("assessment_version_id", versionId);
      for (const r of oldRules ?? []) {
        const { error: newRuleErr } = await supabase.from("scoring_rules").insert({ assessment_version_id: newV.id, min_score: r.min_score, max_score: r.max_score, chronotype: r.chronotype, label: r.label, description: r.description });
        if (newRuleErr) return NextResponse.json({ error: newRuleErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, versionId: newV.id });
    }

    if (action === "save_rules") {
      const { versionId, rules } = body;
      await supabase.from("scoring_rules").delete().eq("assessment_version_id", versionId);
      for (const r of rules ?? []) {
        await supabase.from("scoring_rules").insert({ assessment_version_id: versionId, min_score: r.min_score, max_score: r.max_score, chronotype: r.chronotype, label: r.label || null, description: r.description || null });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "update_version") {
      const { versionId, name, description } = body;
      const { error } = await supabase.from("assessment_versions").update({ name, description }).eq("id", versionId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      const { versionId } = body;

      // Only DRAFT versions can be deleted. ACTIVE/ARCHIVED versions are
      // preserved for historical reporting and in-flight assessments.
      const { data: existing, error: existingErr } = await supabase
        .from("assessment_versions")
        .select("status")
        .eq("id", versionId)
        .single();

      if (existingErr || !existing) return NextResponse.json({ error: "Version not found" }, { status: 404 });
      if (existing.status !== "DRAFT") return NextResponse.json({ error: "Only draft versions can be deleted" }, { status: 400 });

      // Check for in-flight assessments referencing this version before deleting.
      const { count: inflight } = await supabase
        .from("assessments")
        .select("id", { count: "exact", head: true })
        .eq("assessment_version_id", versionId)
        .eq("status", "STARTED");

      if ((inflight ?? 0) > 0) {
        return NextResponse.json({ error: "Cannot delete: an assessment is in progress on this version" }, { status: 400 });
      }

      // The production FK constraints have no ON DELETE CASCADE, so delete
      // child rows explicitly in dependency order before the version row.
      const { data: qs } = await supabase.from("questions").select("id").eq("assessment_version_id", versionId);
      if (qs && qs.length > 0) {
        const { error: optErr } = await supabase.from("question_options").delete().in("question_id", qs.map((q) => q.id));
        if (optErr) return NextResponse.json({ error: optErr.message }, { status: 500 });
        const { error: qErr } = await supabase.from("questions").delete().eq("assessment_version_id", versionId);
        if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
      }

      const { error: ruleErr } = await supabase.from("scoring_rules").delete().eq("assessment_version_id", versionId);
      if (ruleErr) return NextResponse.json({ error: ruleErr.message }, { status: 500 });

      const { error: delErr } = await supabase.from("assessment_versions").delete().eq("id", versionId);
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

async function insertQuestions(supabase: Awaited<ReturnType<typeof createClient>>, versionId: string, questions: { text: string; category: string; isRequired: boolean; options: { text: string; larkScore: number; eagleScore: number; owlScore: number }[] }[]): Promise<string | null> {
  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi];
    const { data: qIns, error: qErr } = await supabase
      .from("questions")
      .insert({ assessment_version_id: versionId, question_text: q.text, question_order: qi + 1, category: q.category || null, is_active: q.isRequired !== false })
      .select("id")
      .single();
    if (qErr) return qErr.message;

    for (let oi = 0; oi < (q.options ?? []).length; oi++) {
      const o = q.options[oi];
      // Production DB has option_value NOT NULL — generate a letter (A, B, C, ...)
      // matching the seed convention. Falls back to the option text if it looks like
      // a value (e.g. "A", "B") to avoid collisions on re-save.
      let optionValue: string = String.fromCharCode(65 + oi);
      if (oi === 0 && /^[A-Za-z]{1,4}$/.test((o.text ?? "").trim())) {
        optionValue = o.text.trim();
      }
      const { error: oErr } = await supabase
        .from("question_options")
        .insert({ question_id: qIns.id, option_text: o.text, option_value: optionValue, option_order: oi + 1, lark_score: o.larkScore ?? 0, eagle_score: o.eagleScore ?? 0, owl_score: o.owlScore ?? 0 });
      if (oErr) return oErr.message;
    }
  }
  return null;
}

async function insertScoringRules(
  supabase: Awaited<ReturnType<typeof createClient>>,
  versionId: string,
  rules: { min_score: number | null; max_score: number | null; chronotype: string; label: string | null; description: string | null }[] | undefined
): Promise<string | null> {
  const list = Array.isArray(rules) ? rules : [];
  if (list.length === 0) return null;

  for (const r of list) {
    if (!r.chronotype) return "Scoring rule missing chronotype";
    const { error } = await supabase
      .from("scoring_rules")
      .insert({ assessment_version_id: versionId, min_score: r.min_score, max_score: r.max_score, chronotype: r.chronotype, label: r.label || null, description: r.description || null });
    if (error) return error.message;
  }
  return null;
}
