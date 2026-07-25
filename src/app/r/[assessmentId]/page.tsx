"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const CHRONO_COLORS: Record<string, string> = { LARK: "#F59A00", EAGLE: "#35319B", OWL: "#7B68AE" };
const CHRONO_BG: Record<string, string> = { LARK: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", EAGLE: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", OWL: "linear-gradient(135deg, #F5F3FF, #EDE9FE)" };
const CHRONO_ICON: Record<string, string> = { LARK: "\u2600\uFE0F", EAGLE: "\uD83D\uDE09", OWL: "\uD83C\uDF19" };
const CHRONO_LABEL: Record<string, string> = { LARK: "Lion \u00B7 Morning Type", EAGLE: "Eagle \u00B7 Intermediate Type", OWL: "Owl \u00B7 Evening Type" };
const CHRONO_DESC: Record<string, string> = {
  LARK: "Your biology runs early. You wake naturally with the sun, and your mind is at its sharpest before noon.",
  EAGLE: "Your biology sits in the middle. You adapt well to most schedules with steady, balanced energy.",
  OWL: "Your biology leans later. You come alive when the day quiets down, with deeper creative focus toward evening.",
};

export default function SharedResultPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!assessmentId) return;
    fetch("/api/public-result/" + assessmentId)
      .then((r) => { if (!r.ok) throw new Error("404"); return r.json(); })
      .then(setData)
      .catch(() => setError(true));
  }, [assessmentId]);

  if (error) {
    return (
      <html lang="en"><body style={{ margin: 0, background: "#f8f9fc", fontFamily: "Poppins, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#333", fontWeight: 600 }}>Result Not Found</h2>
          <p style={{ color: "#888", fontSize: "14px" }}>This assessment result is not available or has expired.</p>
        </div>
      </body></html>
    );
  }

  if (!data) {
    return (
      <html lang="en"><body style={{ margin: 0, background: "#f8f9fc", fontFamily: "Poppins, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#aaa", fontSize: "14px" }}>Loading...</p>
      </body></html>
    );
  }

  const chrono = String(data.chronotype || "EAGLE");
  const color = CHRONO_COLORS[chrono] || "#35319B";
  const bg = CHRONO_BG[chrono] || CHRONO_BG.EAGLE;
  const icon = CHRONO_ICON[chrono] || "";
  const label = CHRONO_LABEL[chrono] || "";
  const desc = CHRONO_DESC[chrono] || "";
  const name = [String(data.firstName || ""), String(data.lastName || "")].filter(Boolean).join(" ") || "Someone";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{chrono} Chronotype - {name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="description" content={`${name} is a ${chrono} chronotype. ${desc}`} />
        <meta property="og:title" content={`${name} - ${chrono} Chronotype`} />
        <meta property="og:description" content={desc} />
      </head>
      <body style={{ margin: 0, background: "#f8f9fc", fontFamily: "Poppins, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "520px", width: "100%", background: "#fff", borderRadius: "20px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ height: "4px", background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
          <div style={{ padding: "32px 28px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{ fontSize: "48px", display: "block", marginBottom: "8px" }}>{icon}</span>
              <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Shared Result</span>
              <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#333", margin: "4px 0 0" }}>{name}</h1>
            </div>
            <div style={{ borderRadius: "16px", padding: "24px", marginBottom: "20px", background: bg, textAlign: "center" }}>
              <span style={{ display: "inline-block", fontSize: "13px", fontWeight: 600, padding: "6px 16px", borderRadius: "999px", color: "#fff", background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                {label}
              </span>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.6, margin: "14px 0 0" }}>{desc}</p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#444", margin: "0 0 12px" }}>Dimension Scores</p>
              {[
                { label: "Lark", score: Number(data.larkScore || 0), c: "#F59A00", max: 60 },
                { label: "Eagle", score: Number(data.eagleScore || 0), c: "#35319B", max: 60 },
                { label: "Owl", score: Number(data.owlScore || 0), c: "#7B68AE", max: 60 },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, width: "48px", textAlign: "right", color: s.c }}>{s.label}</span>
                  <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "#f0f0f0" }}>
                    <div style={{ height: "100%", borderRadius: "4px", width: `${Math.min(100, (s.score / s.max) * 100)}%`, background: `linear-gradient(90deg, ${s.c}, ${s.c}dd)` }} />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, width: "28px", textAlign: "right", color: s.c }}>{s.score}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(53,49,155,0.05)", textAlign: "center" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", margin: "0 0 2px" }}>Confidence</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "#35319B", margin: 0 }}>{String(data.confidenceScore || "—")}%</p>
              </div>
              <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(245,154,0,0.06)", textAlign: "center" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", margin: "0 0 2px" }}>Total Score</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "#F59A00", margin: 0 }}>{String(data.totalScore || "—")}</p>
              </div>
            </div>
            <div style={{ textAlign: "center", borderTop: "1px solid #eee", paddingTop: "16px" }}>
              <p style={{ fontSize: "11px", color: "#bbb", margin: 0, letterSpacing: "0.04em" }}>CHRONOTYPE Intelligence by WelcomeCure HealthTech</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
