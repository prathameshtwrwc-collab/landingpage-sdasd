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

    if (!versions) return NextResponse.json({ versions: [] });

    const enriched = await Promise.all(versions.map(async (v) => {
      const { count: qCount } = await supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("assessment_version_id", v.id);

      const { count: respCount } = await supabase
        .from("assessments")
        .select("id", { count: "exact", head: true })
        .eq("assessment_version_id", v.id)
        .eq("status", "COMPLETED");

      const { data: rules } = await supabase
        .from("scoring_rules")
        .select("min_score, max_score, chronotype, label, description")
        .eq("assessment_version_id", v.id)
        .order("min_score");

      const { data: questions } = await supabase
        .from("questions")
        .select("id, question_text, question_order, category, is_active")
        .eq("assessment_version_id", v.id)
        .order("question_order");

      const questionsWithOptions = await Promise.all((questions ?? []).map(async (q) => {
        const { data: opts } = await supabase
          .from("question_options")
          .select("id, option_text, option_value, option_order, lark_score, eagle_score, owl_score")
          .eq("question_id", q.id)
          .order("option_order");
        return { ...q, options: opts ?? [] };
      }));

      return {
        ...v,
        questionCount: qCount ?? 0,
        responseCount: respCount ?? 0,
        scoringRules: rules ?? [],
        questions: questionsWithOptions,
      };
    }));

    return NextResponse.json({ versions: enriched });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const supabase = await createClient();
    const body = await req.json();
    const action = body.action;

    if (action === "create_draft") {
      const { name, description, questions } = body;

      const { count: maxVer } = await supabase
        .from("assessment_versions")
        .select("version", { count: "exact", head: true });

      const version = (maxVer ?? 0) + 1;

      const { data: av, error: avErr } = await supabase
        .from("assessment_versions")
        .insert({ name, description, version, status: "DRAFT" })
        .select("id")
        .single();

      if (avErr || !av) return NextResponse.json({ error: avErr?.message || "Failed" }, { status: 500 });

      for (let qi = 0; qi < (questions ?? []).length; qi++) {
        const q = questions[qi];
        const { data: qIns, error: qErr } = await supabase
          .from("questions")
          .insert({ assessment_version_id: av.id, question_text: q.text, question_order: qi + 1, category: q.category || null, is_active: q.isRequired !== false })
          .select("id")
          .single();
        if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });

        for (let oi = 0; oi < (q.options ?? []).length; oi++) {
          const o = q.options[oi];
          const { error: oErr } = await supabase
            .from("question_options")
            .insert({ question_id: qIns.id, option_text: o.text, option_value: o.value || null, option_order: oi + 1, lark_score: o.larkScore ?? 0, eagle_score: o.eagleScore ?? 0, owl_score: o.owlScore ?? 0 });
          if (oErr) return NextResponse.json({ error: oErr.message }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true, versionId: av.id });
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

      // Check score range coverage
      const allOpts = await supabase
        .from("question_options")
        .select("lark_score, eagle_score, owl_score")
        .in("question_id", (questions ?? []).map((q) => q.id));

      const maxPossible = (allOpts.data ?? []).reduce((sum, o) => sum + Math.max(o.lark_score ?? 0, o.eagle_score ?? 0, o.owl_score ?? 0), 0);
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

      const { data: newV } = await supabase
        .from("assessment_versions")
        .insert({ name: orig.name + " (Copy)", description: orig.description, version: (orig.version ?? 0) + 1, status: "DRAFT" })
        .select("id")
        .single();
      if (!newV) return NextResponse.json({ error: "Failed to duplicate" }, { status: 500 });

      const { data: oldQs } = await supabase.from("questions").select("*").eq("assessment_version_id", versionId).order("question_order");
      for (const q of oldQs ?? []) {
        const { data: newQ } = await supabase
          .from("questions")
          .insert({ assessment_version_id: newV.id, question_text: q.question_text, question_order: q.question_order, category: q.category, is_active: q.is_active })
          .select("id")
          .single();
        if (newQ) {
          const { data: oldOpts } = await supabase.from("question_options").select("*").eq("question_id", q.id).order("option_order");
          for (const o of oldOpts ?? []) {
            await supabase.from("question_options").insert({ question_id: newQ.id, option_text: o.option_text, option_value: o.option_value, option_order: o.option_order, lark_score: o.lark_score, eagle_score: o.eagle_score, owl_score: o.owl_score });
          }
        }
      }

      const { data: oldRules } = await supabase.from("scoring_rules").select("*").eq("assessment_version_id", versionId);
      for (const r of oldRules ?? []) {
        await supabase.from("scoring_rules").insert({ assessment_version_id: newV.id, min_score: r.min_score, max_score: r.max_score, chronotype: r.chronotype, label: r.label, description: r.description });
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

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
