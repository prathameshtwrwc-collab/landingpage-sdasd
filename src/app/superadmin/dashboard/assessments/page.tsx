"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ClipboardList, Plus, CheckCircle, AlertTriangle, Eye, Edit3, Copy, Archive, Send, X, ChevronDown, ChevronUp, GripVertical, RotateCcw, Shield, BookOpen } from "lucide-react";

type Question = { id?: string; text: string; category: string; isRequired: boolean; options: { text: string; larkScore: number; eagleScore: number; owlScore: number }[] };
type ScoringRule = { min_score: number | null; max_score: number | null; chronotype: string; label: string | null; description: string | null };
type Version = {
  id: string; name: string; description: string | null; version: number; status: string; created_at: string;
  questionCount: number; responseCount: number; scoringRules: ScoringRule[]; questions: (Question & { id: string } & { options: { id: string; option_text: string; lark_score: number; eagle_score: number; owl_score: number }[] })[];
};

interface ApiResponse { versions: Version[]; error?: string }

const CATEGORIES = ["Sleep Schedule", "Energy Patterns", "Evening Habits", "Morning Routine", "Focus & Productivity", "General"];

function emptyQuestion(): Question { return { text: "", category: "", isRequired: true, options: [{ text: "", larkScore: 0, eagleScore: 0, owlScore: 0 }] }; }

export default function SuperAdminAssessmentsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "builder" | "preview">("list");
  const [editVersionId, setEditVersionId] = useState<string | null>(null);
  const [vName, setVName] = useState("");
  const [vDesc, setVDesc] = useState("");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    { min_score: 0, max_score: 13, chronotype: "OWL", label: "Owl", description: "Evening preference" },
    { min_score: 14, max_score: 26, chronotype: "EAGLE", label: "Eagle", description: "Balanced preference" },
    { min_score: 27, max_score: 40, chronotype: "LARK", label: "Lark", description: "Morning preference" },
  ]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchVersions = useCallback(() => {
    setLoading(true);
    fetch("/api/admin-assessments")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchVersions(); }, [fetchVersions]);

  const showMsg = (type: "success" | "error", text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 4000); };

  const startNew = () => {
    setEditVersionId(null); setVName(""); setVDesc(""); setQuestions([emptyQuestion()]);
    setScoringRules([
      { min_score: 0, max_score: 13, chronotype: "OWL", label: "Owl", description: "Evening preference" },
      { min_score: 14, max_score: 26, chronotype: "EAGLE", label: "Eagle", description: "Balanced preference" },
      { min_score: 27, max_score: 40, chronotype: "LARK", label: "Lark", description: "Morning preference" },
    ]);
    setTab("builder");
  };

  const loadVersion = (v: Version) => {
    setEditVersionId(v.id); setVName(v.name); setVDesc(v.description ?? "");
    setQuestions(v.questions.map((q: Record<string, unknown>) => ({ text: q.question_text as string, category: (q.category as string) ?? "", isRequired: (q.is_active as boolean) ?? true, options: (q.options as Array<Record<string, unknown>>).map((o) => ({ text: o.option_text as string, larkScore: (o.lark_score as number) ?? 0, eagleScore: (o.eagle_score as number) ?? 0, owlScore: (o.owl_score as number) ?? 0 })) })));
    setScoringRules(v.scoringRules.length > 0 ? v.scoringRules : [
      { min_score: 0, max_score: 13, chronotype: "OWL", label: "Owl", description: "Evening preference" },
      { min_score: 14, max_score: 26, chronotype: "EAGLE", label: "Eagle", description: "Balanced preference" },
      { min_score: 27, max_score: 40, chronotype: "LARK", label: "Lark", description: "Morning preference" },
    ]);
    setTab("builder");
  };

  const saveDraft = async () => {
    if (!vName.trim()) { showMsg("error", "Assessment name is required"); return; }
    setSaving(true);

    // If editing existing draft, update it; otherwise create new
    const action = editVersionId ? "update_draft" : "create_draft";
    const body: Record<string, unknown> = { action, name: vName, description: vDesc, questions };

    if (editVersionId) body.versionId = editVersionId;

    const res = await fetch("/api/admin-assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (d.error) showMsg("error", d.error);
    else {
      showMsg("success", editVersionId ? "Draft updated!" : "Draft saved!");
      if (d.versionId && !editVersionId) setEditVersionId(d.versionId);
    }
    setSaving(false);
    fetchVersions();
  };

  const publishVersion = async (versionId?: string) => {
    const id = versionId || editVersionId;
    if (!id) return;
    setSaving(true);
    const res = await fetch("/api/admin-assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish", versionId: id }),
    });
    const d = await res.json();
    if (d.error) showMsg("error", d.error); else showMsg("success", "Assessment published!");
    setSaving(false); fetchVersions();
  };

  const archiveVersion = async (versionId: string) => {
    const res = await fetch("/api/admin-assessments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive", versionId }),
    });
    const d = await res.json();
    if (d.error) showMsg("error", d.error); else showMsg("success", "Version archived");
    fetchVersions();
  };

  const duplicateVersion = async (versionId: string) => {
    const res = await fetch("/api/admin-assessments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate", versionId }),
    });
    const d = await res.json();
    if (d.error) showMsg("error", d.error); else showMsg("success", "Version duplicated");
    fetchVersions();
  };

  const saveScoringRules = async (versionId: string) => {
    const res = await fetch("/api/admin-assessments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_rules", versionId, rules: scoringRules }),
    });
    const d = await res.json();
    if (d.error) showMsg("error", d.error); else showMsg("success", "Scoring rules saved");
  };

  const updateVersion = async (versionId: string) => {
    const res = await fetch("/api/admin-assessments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_version", versionId, name: vName, description: vDesc }),
    });
    const d = await res.json();
    if (d.error) showMsg("error", d.error); else showMsg("success", "Version updated");
    fetchVersions();
  };

  const totalScoreRange = questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => Math.max(o.larkScore, o.eagleScore, o.owlScore)), 0), 0);
  const validateMsg = (() => {
    if (questions.length < 1) return "At least one question required";
    for (const q of questions) {
      if (!q.text.trim()) return "All questions must have text";
      if (q.options.length < 1) return "Every question needs at least one option";
      for (const o of q.options) { if (!o.text.trim()) return "All options must have text"; }
    }
    const sorted = [...scoringRules].sort((a, b) => (a.min_score ?? 0) - (b.min_score ?? 0));
    if (sorted[0]?.min_score !== 0) return "Score ranges must start at 0";
    for (let i = 0; i < sorted.length - 1; i++) {
      if ((sorted[i].max_score ?? 0) >= (sorted[i + 1].min_score ?? 0)) return "Score ranges overlap";
    }
    if ((sorted[sorted.length - 1]?.max_score ?? 0) < totalScoreRange) return `Max score ${totalScoreRange} not covered by ranges`;
    return null;
  })();

  const versions = data?.versions ?? [];
  const activeVersion = versions.find((v) => v.status === "ACTIVE");

  return (
    <DashboardShell title="Assessment Versions">
      <div className="flex items-start justify-between flex-wrap gap-[12px] mb-[20px]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Assessments</span>
          <h1 className="m-0 text-[18px] font-bold mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
            {tab === "list" ? "Questionnaire Versions" : tab === "builder" ? "Assessment Builder" : "Preview"}
          </h1>
        </div>
        {tab === "list" && (
          <button type="button" onClick={startNew}
            className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-xl border-none cursor-pointer text-[12px] font-semibold text-white transition-colors"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
            <Plus size={15} /> New Version
          </button>
        )}
        {tab !== "list" && (
          <button type="button" onClick={() => setTab("list")}
            className="flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer"
            style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg> Back
          </button>
        )}
      </div>

      {activeVersion && tab === "list" && (
        <div className="mb-[16px] p-[14px] rounded-xl flex items-center gap-[10px]" style={{ background: "rgba(245,154,0,0.08)", border: "1px solid rgba(245,154,0,0.2)" }}>
          <AlertTriangle size={16} stroke="#F59A00" />
          <p className="m-0 text-[12px] leading-[1.4]" style={{ color: "#92400E", fontFamily: "Poppins, sans-serif" }}>
            Only one assessment version can be active at a time. Currently <strong>{activeVersion.name}</strong> v{activeVersion.version} is active. Publishing a new version will archive this one.
          </p>
        </div>
      )}

      {msg && (
        <div className="mb-[16px] p-[12px] rounded-xl text-[13px] flex items-center gap-[8px]" style={{ background: msg.type === "success" ? "rgba(46,125,50,0.08)" : "rgba(211,47,47,0.08)", color: msg.type === "success" ? "#2E7D32" : "#C62828" }}>
          {msg.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {msg.text}
        </div>
      )}

      {/* ═══════════════ LIST VIEW ═══════════════ */}
      {tab === "list" && (
        loading ? (
          <div className="flex items-center justify-center py-[60px]"><div className="w-[24px] h-[24px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" /></div>
        ) : versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[60px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <ClipboardList size={40} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No assessment versions yet</p>
            <button type="button" onClick={startNew} className="mt-[12px] px-[16px] py-[8px] rounded-xl border-none cursor-pointer text-[12px] font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>Create First Version</button>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {versions.map((v) => {
              const statusColors: Record<string, string> = { DRAFT: "#F59A00", ACTIVE: "#2E7D32", ARCHIVED: "#888" };
              const statusBg: Record<string, string> = { DRAFT: "rgba(245,154,0,0.08)", ACTIVE: "rgba(46,125,50,0.08)", ARCHIVED: "rgba(0,0,0,0.04)" };
              return (
                <div key={v.id} className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-start justify-between flex-wrap gap-[12px]">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-[10px] flex-wrap">
                        <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{v.name}</h3>
                        <span className="inline-block text-[10px] font-semibold uppercase px-[8px] py-[3px] rounded-full" style={{ color: statusColors[v.status] || "#888", background: statusBg[v.status] || "rgba(0,0,0,0.04)", fontFamily: "Poppins, sans-serif" }}>{v.status}</span>
                        <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>v{v.version}</span>
                      </div>
                      {v.description && <p className="m-0 mt-[4px] text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{v.description}</p>}
                      <div className="flex flex-wrap gap-x-[16px] gap-y-[4px] mt-[8px] text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                        <span>{v.questionCount} question{v.questionCount !== 1 ? "s" : ""}</span>
                        <span>{v.responseCount} response{v.responseCount !== 1 ? "s" : ""}</span>
                        <span>Created {new Date(v.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px] flex-wrap">
                      <button type="button" onClick={() => loadVersion(v)}
                        className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[6px] rounded-lg border-none cursor-pointer transition-colors"
                        style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                        <Eye size={13} /> View
                      </button>
                      <button type="button" onClick={() => loadVersion(v)}
                        className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[6px] rounded-lg border-none cursor-pointer transition-colors"
                        style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                        <Edit3 size={13} /> Edit
                      </button>
                      <button type="button" onClick={() => duplicateVersion(v.id)}
                        className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[6px] rounded-lg border-none cursor-pointer transition-colors"
                        style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                        <Copy size={13} /> Duplicate
                      </button>
                      {v.status === "DRAFT" && (
                        <button type="button" onClick={() => publishVersion(v.id)}
                          className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[6px] rounded-lg border-none cursor-pointer text-white transition-colors"
                          style={{ background: "linear-gradient(135deg, #2E7D32, #43A047)", fontFamily: "Poppins, sans-serif" }}>
                          <Send size={13} /> Publish
                        </button>
                      )}
                      {v.status !== "ARCHIVED" && v.status !== "ACTIVE" && (
                        <button type="button" onClick={() => archiveVersion(v.id)}
                          className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[6px] rounded-lg border-none cursor-pointer transition-colors"
                          style={{ color: "#888", background: "rgba(0,0,0,0.04)", fontFamily: "Poppins, sans-serif" }}>
                          <Archive size={13} /> Archive
                        </button>
                      )}
                    </div>
                  </div>
                  {v.scoringRules.length > 0 && (
                    <div className="flex flex-wrap gap-[8px] mt-[12px] pt-[12px]" style={{ borderTop: "1px solid #F5F5F5" }}>
                      {v.scoringRules.map((r, i) => (
                        <span key={i} className="text-[10px] font-medium px-[8px] py-[3px] rounded-full" style={{
                          color: r.chronotype === "LARK" ? "#f4b54d" : r.chronotype === "EAGLE" ? "#354a82" : "#7B68AE",
                          background: r.chronotype === "LARK" ? "rgba(244,181,77,0.1)" : r.chronotype === "EAGLE" ? "rgba(53,74,130,0.1)" : "rgba(123,104,174,0.1)",
                          fontFamily: "Poppins, sans-serif",
                        }}>{r.chronotype}: {r.min_score}–{r.max_score}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ═══════════════ BUILDER VIEW ═══════════════ */}
      {tab === "builder" && (
        <div className="flex flex-col gap-[16px]">
          {/* Name & Description */}
          <div className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex flex-col md:flex-row gap-[12px]">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase mb-[4px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Assessment Name</label>
                <input type="text" value={vName} onChange={(e) => setVName(e.target.value)} placeholder="e.g. Sleep Chronotype Assessment"
                  className="w-full px-[12px] py-[9px] rounded-lg border text-[13px] outline-none" style={{ borderColor: "#E0E0E0", color: "#333", fontFamily: "Poppins, sans-serif" }} />
              </div>
              <div className="flex-[2]">
                <label className="block text-[11px] font-semibold uppercase mb-[4px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Description</label>
                <input type="text" value={vDesc} onChange={(e) => setVDesc(e.target.value)} placeholder="Brief description of this version"
                  className="w-full px-[12px] py-[9px] rounded-lg border text-[13px] outline-none" style={{ borderColor: "#E0E0E0", color: "#333", fontFamily: "Poppins, sans-serif" }} />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-[14px]">
              <h3 className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Questions ({questions.length})</h3>
              <button type="button" onClick={() => setQuestions([...questions, emptyQuestion()])}
                className="flex items-center gap-[5px] text-[12px] font-semibold px-[12px] py-[6px] rounded-lg border-none cursor-pointer"
                style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                <Plus size={14} /> Add Question
              </button>
            </div>
            <div className="flex flex-col gap-[12px]">
              {questions.map((q, qi) => (
                <div key={qi} className="rounded-xl p-[16px]" style={{ border: "1px solid #F0F0F0", background: "#FAFBFF" }}>
                  <div className="flex items-center gap-[8px] mb-[10px]">
                    <span className="flex items-center justify-center w-[24px] h-[24px] rounded-full text-[11px] font-bold" style={{ background: "rgba(53,49,155,0.1)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{qi + 1}</span>
                    <input type="text" value={q.text} onChange={(e) => { const qs = [...questions]; qs[qi].text = e.target.value; setQuestions(qs); }} placeholder="Enter question text"
                      className="flex-1 px-[10px] py-[7px] rounded-lg border text-[13px] outline-none" style={{ borderColor: "#E0E0E0", color: "#333", fontFamily: "Poppins, sans-serif" }} />
                    <select value={q.category} onChange={(e) => { const qs = [...questions]; qs[qi].category = e.target.value; setQuestions(qs); }}
                      className="px-[8px] py-[7px] rounded-lg border text-[11px] cursor-pointer outline-none" style={{ borderColor: "#E0E0E0", color: "#555", fontFamily: "Poppins, sans-serif", background: "#FFF" }}>
                      <option value="">Category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <label className="flex items-center gap-[4px] text-[11px] cursor-pointer shrink-0" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                      <input type="checkbox" checked={q.isRequired} onChange={(e) => { const qs = [...questions]; qs[qi].isRequired = e.target.checked; setQuestions(qs); }} />
                      Required
                    </label>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qi))}
                        className="flex items-center justify-center w-[28px] h-[28px] rounded-lg border-none cursor-pointer shrink-0"
                        style={{ color: "#D32F2F", background: "rgba(211,47,47,0.06)" }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {/* Options */}
                  <div className="ml-[32px] flex flex-col gap-[6px]">
                    {q.options.map((o, oi) => (
                      <div key={oi} className="flex items-center gap-[6px]">
                        <input type="text" value={o.text} onChange={(e) => { const qs = [...questions]; qs[qi].options[oi].text = e.target.value; setQuestions(qs); }} placeholder="Option text"
                          className="flex-1 px-[8px] py-[6px] rounded-lg border text-[12px] outline-none" style={{ borderColor: "#E8E8E8", color: "#333", fontFamily: "Poppins, sans-serif" }} />
                        <input type="number" value={o.larkScore} onChange={(e) => { const qs = [...questions]; qs[qi].options[oi].larkScore = Number(e.target.value); setQuestions(qs); }} placeholder="L"
                          className="w-[44px] px-[6px] py-[6px] rounded-lg border text-[11px] text-center outline-none" style={{ borderColor: "#E8E8E8", color: "#f4b54d", fontFamily: "Poppins, sans-serif" }} title="Lark score" />
                        <input type="number" value={o.eagleScore} onChange={(e) => { const qs = [...questions]; qs[qi].options[oi].eagleScore = Number(e.target.value); setQuestions(qs); }} placeholder="E"
                          className="w-[44px] px-[6px] py-[6px] rounded-lg border text-[11px] text-center outline-none" style={{ borderColor: "#E8E8E8", color: "#354a82", fontFamily: "Poppins, sans-serif" }} title="Eagle score" />
                        <input type="number" value={o.owlScore} onChange={(e) => { const qs = [...questions]; qs[qi].options[oi].owlScore = Number(e.target.value); setQuestions(qs); }} placeholder="O"
                          className="w-[44px] px-[6px] py-[6px] rounded-lg border text-[11px] text-center outline-none" style={{ borderColor: "#E8E8E8", color: "#7B68AE", fontFamily: "Poppins, sans-serif" }} title="Owl score" />
                        {q.options.length > 1 && (
                          <button type="button" onClick={() => { const qs = [...questions]; qs[qi].options = q.options.filter((_, j) => j !== oi); setQuestions(qs); }}
                            className="flex items-center justify-center w-[24px] h-[24px] rounded-lg border-none cursor-pointer shrink-0"
                            style={{ color: "#D32F2F", background: "rgba(211,47,47,0.06)" }}>
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => { const qs = [...questions]; qs[qi].options.push({ text: "", larkScore: 0, eagleScore: 0, owlScore: 0 }); setQuestions(qs); }}
                      className="flex items-center gap-[4px] text-[11px] font-medium ml-[8px] px-[8px] py-[4px] rounded-lg border-none cursor-pointer self-start"
                      style={{ color: "#888", background: "rgba(0,0,0,0.03)", fontFamily: "Poppins, sans-serif" }}>
                      <Plus size={12} /> Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Rules */}
          <div className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[12px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              Scoring Rules <span className="text-[11px] font-normal" style={{ color: "#AAA" }}>Max possible score: {totalScoreRange}</span>
            </h3>
            <div className="flex flex-col gap-[8px]">
              {scoringRules.map((r, i) => (
                <div key={i} className="flex items-center gap-[8px] flex-wrap">
                  <span className="text-[12px] font-semibold w-[50px]" style={{ color: r.chronotype === "LARK" ? "#f4b54d" : r.chronotype === "EAGLE" ? "#354a82" : "#7B68AE", fontFamily: "Poppins, sans-serif" }}>{r.chronotype}</span>
                  <input type="number" value={r.min_score ?? ""} onChange={(e) => { const rs = [...scoringRules]; rs[i].min_score = e.target.value ? Number(e.target.value) : null; setScoringRules(rs); }}
                    className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} placeholder="Min" />
                  <span className="text-[11px]" style={{ color: "#AAA" }}>to</span>
                  <input type="number" value={r.max_score ?? ""} onChange={(e) => { const rs = [...scoringRules]; rs[i].max_score = e.target.value ? Number(e.target.value) : null; setScoringRules(rs); }}
                    className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} placeholder="Max" />
                  <input type="text" value={r.label ?? ""} onChange={(e) => { const rs = [...scoringRules]; rs[i].label = e.target.value; setScoringRules(rs); }}
                    className="w-[100px] px-[8px] py-[6px] rounded-lg border text-[12px] outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} placeholder="Label" />
                </div>
              ))}
            </div>
            {/* Validation status */}
            <div className="mt-[12px] flex items-center gap-[8px] p-[10px] rounded-lg" style={{ background: validateMsg ? "rgba(211,47,47,0.06)" : "rgba(46,125,50,0.06)" }}>
              {validateMsg ? <AlertTriangle size={14} stroke="#D32F2F" /> : <CheckCircle size={14} stroke="#2E7D32" />}
              <span className="text-[12px]" style={{ color: validateMsg ? "#C62828" : "#2E7D32", fontFamily: "Poppins, sans-serif" }}>
                {validateMsg || "All checks passed — ready to publish"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-[10px] flex-wrap">
            <button type="button" onClick={async () => {
              if (editVersionId) await saveScoringRules(editVersionId);
              await saveDraft();
            }}
              className="flex items-center gap-[5px] px-[16px] py-[9px] rounded-xl border-none cursor-pointer text-[12px] font-semibold transition-colors"
              style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }} disabled={saving}>
              <RotateCcw size={14} /> {saving ? "Saving..." : editVersionId ? "Save Draft" : "Save as Draft"}
            </button>
            <button type="button" onClick={() => setTab("preview")}
              className="flex items-center gap-[5px] px-[16px] py-[9px] rounded-xl border-none cursor-pointer text-[12px] font-semibold transition-colors"
              style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
              <Eye size={14} /> Preview
            </button>
            <button type="button" onClick={async () => {
              if (editVersionId) await saveScoringRules(editVersionId);
              await publishVersion();
            }}
              disabled={!!validateMsg || saving || !editVersionId}
              className="flex items-center gap-[5px] px-[16px] py-[9px] rounded-xl border-none cursor-pointer text-[12px] font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2E7D32, #43A047)", fontFamily: "Poppins, sans-serif" }}>
              <Send size={14} /> {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ PREVIEW VIEW ═══════════════ */}
      {tab === "preview" && (
        <div className="rounded-[16px] p-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-[10px] mb-[20px]">
            <BookOpen size={20} stroke="#35319B" />
            <div>
              <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{vName || "Untitled Assessment"}</h3>
              <p className="m-0 text-[12px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{questions.length} questions · Preview mode</p>
            </div>
          </div>
          <div className="flex flex-col gap-[16px]">
            {questions.map((q, qi) => (
              <div key={qi} className="p-[16px] rounded-xl" style={{ border: "1px solid #F0F0F0" }}>
                <p className="m-0 text-[14px] font-semibold mb-[10px]" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>
                  {qi + 1}. {q.text || "(question text)"}
                  {q.category && <span className="ml-[8px] text-[10px] font-normal px-[6px] py-[2px] rounded-full" style={{ background: "rgba(53,49,155,0.06)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>{q.category}</span>}
                </p>
                <div className="flex flex-col gap-[6px]">
                  {q.options.map((o, oi) => (
                    <label key={oi} className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-lg cursor-pointer" style={{ background: "#F8F9FF" }}>
                      <input type="radio" name={`preview-${qi}`} className="accent-[#35319B]" />
                      <span className="text-[13px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{o.text || "(option)"}</span>
                      {o.larkScore !== 0 && <span className="text-[10px] ml-auto" style={{ color: "#f4b54d" }}>L:{o.larkScore}</span>}
                      {o.eagleScore !== 0 && <span className="text-[10px]" style={{ color: "#354a82" }}>E:{o.eagleScore}</span>}
                      {o.owlScore !== 0 && <span className="text-[10px]" style={{ color: "#7B68AE" }}>O:{o.owlScore}</span>}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-[20px] p-[14px] rounded-lg" style={{ background: "rgba(53,49,155,0.04)" }}>
            <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Scoring ranges: {scoringRules.map((r) => `${r.chronotype} ${r.min_score}–${r.max_score}`).join(" · ")}</span>
            <span className="text-[12px] font-semibold" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>Max score: {totalScoreRange}</span>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
