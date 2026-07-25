"use client";

import { useEffect, useState } from "react";
import { X, Mail, Calendar, MapPin, User, Tag, Activity, Shield, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface ModalProps {
  memberId: string;
  onClose: () => void;
}

export default function MemberDetailModal({ memberId, onClose }: ModalProps) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    fetch(`/api/member-detail?member_id=${encodeURIComponent(memberId)}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [memberId]);

  const m = data?.member as Record<string, unknown> | undefined;
  const org = data?.organization as Record<string, unknown> | null | undefined;
  const assessments = (data?.assessments ?? []) as Record<string, unknown>[];
  const chronoResults = (data?.chronotypeResults ?? []) as Record<string, unknown>[];
  const reports = (data?.reports ?? []) as Record<string, unknown>[];
  const activityLogs = (data?.activityLogs ?? []) as Record<string, unknown>[];
  const loginAudit = (data?.loginAudit ?? []) as Record<string, unknown>[];
  const answers = (data?.lastAssessmentAnswers ?? []) as Record<string, unknown>[];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto" style={{ background: "rgba(15,23,42,0.45)", paddingTop: "40px", paddingBottom: "40px" }} onClick={onClose}>
      <div className="w-full max-w-[720px] mx-4 rounded-[20px] overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[18px]" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="flex items-center gap-[10px]">
            <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)" }}>
              {m ? ((m.first_name as string)?.[0] ?? "?").toUpperCase() + ((m.last_name as string)?.[0] ?? "").toUpperCase() : "?"}
            </div>
            <div>
              <h3 className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                {m ? `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "Member" : "Loading..."}
              </h3>
              <p className="m-0 text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Member Details</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex items-center justify-center w-[32px] h-[32px] rounded-lg border-none cursor-pointer transition-colors" style={{ color: "#888", background: "rgba(0,0,0,0.04)" }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[60px]">
            <div className="w-[24px] h-[24px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
          </div>
        ) : !m ? (
          <div className="flex flex-col items-center justify-center py-[60px]">
            <p className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Member data not found</p>
          </div>
        ) : (
          <div className="px-[24px] py-[20px] flex flex-col gap-[20px] max-h-[65vh] overflow-y-auto">

            {/* ── Personal Info ── */}
            <Section title="Personal Information">
              <InfoGrid items={[
                { label: "First Name", value: m.first_name as string },
                { label: "Last Name", value: m.last_name as string },
                { label: "Email", value: m.email as string, icon: <Mail size={13} /> },
                { label: "Age", value: m.age != null ? String(m.age) : "—" },
                { label: "Gender", value: (m.gender as string) || "—" },
                { label: "Source", value: (m.source_type as string) || "—" },
                { label: "Referral Code", value: (m.referral_code as string) || "—" },
              ]} />
            </Section>

            {/* ── Location ── */}
            <Section title="Location">
              <InfoGrid items={[
                { label: "Country", value: (m.country as string) || "—", icon: <MapPin size={13} /> },
                { label: "State", value: (m.state as string) || "—" },
                { label: "City", value: (m.city as string) || "—" },
              ]} />
            </Section>

            {/* ── Organization ── */}
            {org && (
              <Section title="Organization">
                <InfoGrid items={[
                  { label: "Name", value: org.name as string },
                  { label: "Code", value: org.unique_code as string, icon: <Tag size={13} /> },
                  { label: "Type", value: org.organization_type as string },
                ]} />
              </Section>
            )}

            {/* ── Chronotype Results ── */}
            {chronoResults.length > 0 && (
              <Section title={`Chronotype Results (${chronoResults.length})`}>
                <div className="flex flex-col gap-[8px]">
                  {chronoResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-[10px] rounded-lg" style={{ background: "#F8F9FF" }}>
                      <div>
                        <span className="text-[12px] font-semibold" style={{
                          color: r.chronotype === "LARK" ? "#f4b54d" : r.chronotype === "EAGLE" ? "#354a82" : "#7B68AE",
                          fontFamily: "Poppins, sans-serif",
                        }}>{r.chronotype as string}</span>
                        <span className="text-[11px] ml-[8px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                          Score: {r.total_score as number} · Confidence: {r.confidence_score as number}%
                        </span>
                      </div>
                      <span className="text-[10px]" style={{ color: "#BBB", fontFamily: "Poppins, sans-serif" }}>
                        {r.generated_at ? new Date(r.generated_at as string).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Assessments ── */}
            {assessments.length > 0 && (
              <Section title={`Assessments (${assessments.length})`}>
                <div className="flex flex-col gap-[6px]">
                  {assessments.slice(0, 10).map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-[8px] rounded-lg" style={{ background: "#F8F9FF" }}>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[11px] font-semibold px-[6px] py-[2px] rounded" style={{
                          background: a.status === "COMPLETED" ? "rgba(46,125,50,0.1)" : "rgba(245,154,0,0.1)",
                          color: a.status === "COMPLETED" ? "#2E7D32" : "#F59A00",
                          fontFamily: "Poppins, sans-serif",
                        }}>{a.status as string}</span>
                        {a.time_taken_seconds != null && (
                          <span className="text-[10px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                            {Math.round((a.time_taken_seconds as number) / 60)} min
                          </span>
                        )}
                      </div>
                      <span className="text-[10px]" style={{ color: "#BBB", fontFamily: "Poppins, sans-serif" }}>
                        {a.completed_at ? new Date(a.completed_at as string).toLocaleDateString() : new Date(a.started_at as string).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Last Assessment Answers ── */}
            {answers.length > 0 && (
              <Section title={`Last Assessment Answers (${answers.length})`}>
                <div className="flex flex-col gap-[6px]">
                  {answers.map((a, i) => (
                    <div key={i} className="p-[8px] rounded-lg" style={{ background: "#F8F9FF" }}>
                      <p className="m-0 text-[11px] font-medium" style={{ color: "#444", fontFamily: "Poppins, sans-serif" }}>{a.question_text as string}</p>
                      <p className="m-0 text-[11px] mt-[2px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>→ {String(a.option_text)} (L:{Number(a.lark_score)} E:{Number(a.eagle_score)} O:{Number(a.owl_score)})</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Reports ── */}
            {reports.length > 0 && (
              <Section title={`Reports (${reports.length})`}>
                <div className="flex flex-col gap-[6px]">
                  {reports.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-[8px] rounded-lg" style={{ background: "#F8F9FF" }}>
                      <span className="text-[11px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                        <FileText size={12} className="inline mr-[4px]" />
                        {r.generated_at ? new Date(r.generated_at as string).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Activity Logs ── */}
            {activityLogs.length > 0 && (
              <Section title={`Activity Log (${activityLogs.length})`}>
                <div className="flex flex-col gap-[4px]">
                  {activityLogs.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-[6px] rounded-lg" style={{ background: "#FAFBFF" }}>
                      <div className="flex items-center gap-[6px]">
                        <Activity size={12} stroke="#AAA" />
                        <span className="text-[11px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{a.description as string || a.activity_type as string}</span>
                      </div>
                      <span className="text-[9px]" style={{ color: "#BBB", fontFamily: "Poppins, sans-serif" }}>
                        {a.created_at ? new Date(a.created_at as string).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Login Audit ── */}
            {loginAudit.length > 0 && (
              <Section title={`Login History (${loginAudit.length})`}>
                <div className="flex flex-col gap-[4px]">
                  {loginAudit.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-[6px] rounded-lg" style={{ background: "#FAFBFF" }}>
                      <div className="flex items-center gap-[6px]">
                        {a.success ? <CheckCircle size={12} stroke="#2E7D32" /> : <AlertTriangle size={12} stroke="#D32F2F" />}
                        <span className="text-[11px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                          {a.email as string || "—"} · {a.ip_address as string || "—"}
                        </span>
                      </div>
                      <span className="text-[9px]" style={{ color: "#BBB", fontFamily: "Poppins, sans-serif" }}>
                        {a.created_at ? new Date(a.created_at as string).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Audit Info ── */}
            <Section title="Audit Info">
              <InfoGrid items={[
                { label: "Member ID", value: (m.id as string)?.slice(0, 12) + "...", icon: <Tag size={13} /> },
                { label: "Created", value: m.created_at ? new Date(m.created_at as string).toLocaleString() : "—", icon: <Calendar size={13} /> },
                { label: "Referral Code", value: (m.referral_code as string) || "—", icon: <Tag size={13} /> },
              ]} />
            </Section>

          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shared Sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="m-0 text-[12px] font-semibold uppercase tracking-[0.06em] mb-[8px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{title}</h4>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string; icon?: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[8px]">
      {items.map((item, i) => (
        <div key={i} className="p-[10px] rounded-lg" style={{ background: "#F8F9FF" }}>
          <p className="m-0 flex items-center gap-[4px] text-[9px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
            {item.icon && <span style={{ lineHeight: 0 }}>{item.icon}</span>}
            {item.label}
          </p>
          <p className="m-0 mt-[2px] text-[12px] font-medium truncate" style={{ color: "#333", fontFamily: "Poppins, sans-serif" }}>{item.value || "—"}</p>
        </div>
      ))}
    </div>
  );
}
