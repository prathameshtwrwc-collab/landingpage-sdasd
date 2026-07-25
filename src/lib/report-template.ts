export type ReportData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  chronotype: string;
  totalScore: number;
  larkScore: number;
  eagleScore: number;
  owlScore: number;
  summary?: string;
  orgName?: string;
};

const CHRONO_META: Record<string, { color: string; sleepWindow: string; peakEnergy: string; strength: string; rhythmType: string }> = {
  LARK:  { color: "#d88921", sleepWindow: "9 PM – 5 AM", peakEnergy: "6 AM – 10 AM", strength: "Morning Optimizer", rhythmType: "Early Chronotype" },
  EAGLE: { color: "#2469d8", sleepWindow: "10:30 PM – 6:30 AM", peakEnergy: "10 AM – 2 PM", strength: "Balanced Performer", rhythmType: "Intermediate Chronotype" },
  OWL:   { color: "#7c3aed", sleepWindow: "12 AM – 8 AM", peakEnergy: "6 PM – 10 PM", strength: "Evening Innovator", rhythmType: "Late Chronotype" },
};

function safeStr(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

export function buildReportHtml(data: ReportData): string {
  const meta = CHRONO_META[data.chronotype] || CHRONO_META.EAGLE;
  const c = meta.color;
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Participant";
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const maxScore = Math.max(data.larkScore, data.eagleScore, data.owlScore, 1);
  const pctLark = Math.round((data.larkScore / maxScore) * 100);
  const pctEagle = Math.round((data.eagleScore / maxScore) * 100);
  const pctOwl = Math.round((data.owlScore / maxScore) * 100);

  const bar = (label: string, pct: number, color: string) => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#667085;margin-bottom:4px">
        <span>${label}</span><span>${pct}%</span>
      </div>
      <div style="height:8px;background:#eef2f6;border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:4px"></div>
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Chronotype Report - ${data.chronotype}</title>
<style>
  @page { margin: 0; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: 210mm; min-height: 297mm; padding: 32px; position: relative; background: #fafaf7; overflow: hidden; }
  .footer { position: absolute; bottom: 16px; left: 32px; right: 32px; display: flex; justify-content: space-between; font-size: 10px; color: #98a2b3; border-top: 1px solid #e5e9f0; padding-top: 12px; }
  .card { background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e5e9f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
</style>
</head>
<body>

<!-- ═══════════════════════ PAGE 1 ═══════════════════════ -->
<div class="page">
  <div style="height:100%;display:flex;flex-direction:column">

    <!-- Hero -->
    <div style="border-radius:16px;padding:28px 32px;margin-bottom:24px;background:linear-gradient(135deg,#fff4d8,#eaf4ff,#eee8ff);display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:10px;height:10px;border-radius:50%;background:${c}"></div>
          <span style="font-size:11px;letter-spacing:0.15em;color:#667085;text-transform:uppercase">CHRONOTYPE ASSESSMENT REPORT</span>
        </div>
        <h1 style="font-size:28px;font-weight:600;color:#202638;margin:0 0 2px 0">${safeStr(data.chronotype)}</h1>
        <p style="font-size:14px;color:#667085;margin:0">${safeStr(meta.rhythmType)}</p>
      </div>
      <div style="text-align:right">
        <span style="font-size:36px;font-weight:700;color:${c}">${safeStr(data.totalScore)}</span>
        <p style="font-size:11px;color:#98a2b3;margin:0">Total Score</p>
      </div>
    </div>

    <!-- 4 insight cards -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:24px">
      ${[
        { label: "Strength", value: meta.strength },
        { label: "Energy Peak", value: meta.peakEnergy },
        { label: "Sleep Window", value: meta.sleepWindow },
        { label: "Rhythm Type", value: meta.rhythmType },
      ].map(card => `
        <div class="card" style="padding:14px 16px">
          <p style="font-size:10px;color:#98a2b3;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px 0">${card.label}</p>
          <p style="font-size:13px;font-weight:600;color:#202638;margin:0">${card.value}</p>
        </div>
      `).join("")}
    </div>

    <!-- Score breakdown + total -->
    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px;margin-bottom:24px">
      <div class="card">
        <h3 style="font-size:13px;font-weight:600;color:#202638;margin:0 0 16px 0">Score Breakdown</h3>
        ${bar("Lark", pctLark, "#d88921")}
        ${bar("Eagle", pctEagle, "#2469d8")}
        ${bar("Owl", pctOwl, "#7c3aed")}
      </div>
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="width:100px;height:100px;border-radius:50%;background:conic-gradient(${c} 0deg ${(data.totalScore / 60) * 360}deg, #eef2f6 ${(data.totalScore / 60) * 360}deg 360deg);display:flex;align-items:center;justify-content:center;margin-bottom:8px">
          <div style="width:80px;height:80px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center">
            <span style="font-size:28px;font-weight:700;color:${c}">${safeStr(data.totalScore)}</span>
          </div>
        </div>
        <p style="font-size:11px;color:#667085;margin:0">of 60 possible</p>
      </div>
    </div>

    <!-- What This Means -->
    <div class="card" style="margin-bottom:24px">
      <h3 style="font-size:13px;font-weight:600;color:#202638;margin:0 0 8px 0">What This Means</h3>
      <p style="font-size:13px;color:#667085;line-height:1.6;margin:0">${safeStr(data.summary || "Your results reflect your natural sleep-wake preference based on your responses.")}</p>
    </div>

    <!-- Sleep window + Peak energy -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      <div class="card">
        <p style="font-size:10px;color:#98a2b3;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px 0">Ideal Sleep Window</p>
        <p style="font-size:18px;font-weight:600;color:${c};margin:0">${meta.sleepWindow}</p>
      </div>
      <div class="card">
        <p style="font-size:10px;color:#98a2b3;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px 0">Peak Energy Hours</p>
        <p style="font-size:18px;font-weight:600;color:${c};margin:0">${meta.peakEnergy}</p>
      </div>
    </div>

    <!-- Daily rhythm timeline -->
    <div class="card" style="flex-shrink:0">
      <h3 style="font-size:13px;font-weight:600;color:#202638;margin:0 0 16px 0">Daily Rhythm Timeline</h3>
      <div style="display:flex;gap:0;position:relative;padding:0 8px">
        <div style="position:absolute;top:18px;left:16px;right:16px;height:2px;background:#e5e9f0;z-index:0"></div>
        ${[
          { time: meta.peakEnergy.split(" – ")[0] || "—", label: "Peak", desc: "Optimal focus" },
          { time: "12 PM", label: "Midday", desc: "Sustained energy" },
          { time: "3 PM", label: "Dip", desc: "Energy declines" },
          { time: meta.sleepWindow.split(" – ")[1] || "—", label: "Wind Down", desc: "Prepare for rest" },
        ].map((n, i) => `
          <div style="flex:1;text-align:center;position:relative;z-index:1">
            <div style="width:12px;height:12px;border-radius:50%;background:${i === 0 ? c : "#e5e9f0"};margin:0 auto 8px;border:2px solid ${i === 0 ? c : "#fff"}"></div>
            <p style="font-size:12px;font-weight:600;color:#202638;margin:0">${n.time}</p>
            <p style="font-size:10px;color:#98a2b3;margin:0">${n.label}</p>
            <p style="font-size:9px;color:#c0c7d2;margin:0">${n.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>

  </div>
  <div class="footer">
    <span>CHRONOTYPE Intelligence by WelcomeCure HealthTech</span>
    <span>Page 1 of 2</span>
  </div>
</div>

<!-- ═══════════════════════ PAGE 2 ═══════════════════════ -->
<div class="page">
  <div style="height:100%;display:flex;flex-direction:column">

    <!-- Page 2 header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #e5e9f0">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:8px;height:8px;border-radius:50%;background:${c}"></div>
        <span style="font-size:16px;font-weight:600;color:#202638">Personalized Guidance</span>
      </div>
      <span style="font-size:11px;color:#98a2b3">${name} · ${dateStr}</span>
    </div>

    <!-- Recommendations -->
    <div style="margin-bottom:24px;flex:1">
      <p style="font-size:13px;color:#667085;margin:0 0 16px 0">Based on your ${safeStr(data.chronotype)} chronotype, here are recommendations to align your routine with your natural rhythm.</p>

      <div style="display:flex;flex-direction:column;gap:12px">
        ${[
          { category: "Sleep Consistency", title: "Anchor Your Sleep Window", description: `Go to bed and wake up at consistent times within your ideal window (${meta.sleepWindow}). Even on weekends, staying within 30 minutes of your target preserves your circadian rhythm.` },
          { category: "Energy Management", title: "Schedule Around Your Peak", description: `Your peak energy is ${meta.peakEnergy}. Block this time for your most demanding cognitive work — deep focus, strategy, and creative tasks.` },
          { category: "Morning Routine", title: data.chronotype === "LARK" ? "Protect Your Morning Advantage" : data.chronotype === "OWL" ? "Use Morning Light Deliberately" : "Strengthen Your Circadian Anchor", description: data.chronotype === "LARK" ? "Your morning clarity is your superpower. Avoid scheduling distractions before 10 AM." : data.chronotype === "OWL" ? "Expose yourself to bright light within 30 minutes of waking to help shift your internal clock earlier." : "Get 15 minutes of sunlight within an hour of waking to reinforce your natural rhythm." },
          { category: "Wind Down", title: data.chronotype === "OWL" ? "Reduce Late Stimulation" : "Wind Down Gradually", description: data.chronotype === "OWL" ? "Dim lights and avoid screens 45 minutes before your target bedtime. Blue light delays melatonin production." : "Begin winding down 1 hour before your ideal bedtime. Lower lights, avoid screens, and try light reading or meditation." },
          { category: "Movement", title: data.chronotype === "LARK" ? "Use Early Activity" : data.chronotype === "EAGLE" ? "Use Afternoon Movement" : "Use Evening Movement", description: data.chronotype === "LARK" ? "Morning exercise (6–8 AM) aligns perfectly with your peak cortisol and body temperature." : data.chronotype === "EAGLE" ? "Afternoon workouts (2–4 PM) match your energy curve and avoid disrupting sleep." : "Light evening movement like walking or yoga (6–8 PM) helps transition without overstimulating." },
          { category: "Nutrition", title: "Time Your Meals", description: "Avoid heavy meals within 2 hours of bedtime. Your last caffeine should be at least 6 hours before your sleep window starts." },
        ].map(rec => `
          <div class="card" style="padding:16px 18px">
            <p style="font-size:10px;color:#98a2b3;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0">${rec.category}</p>
            <p style="font-size:14px;font-weight:600;color:#202638;margin:0 0 4px 0">${rec.title}</p>
            <p style="font-size:12px;color:#667085;line-height:1.5;margin:0">${rec.description}</p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Warning + Disclaimer -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card" style="padding:14px 16px;background:#fffbeb;border-color:#fde68a">
        <p style="font-size:10px;color:#92400e;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px 0;font-weight:600">⚠ Risk Notice</p>
        <p style="font-size:11px;color:#78350f;line-height:1.5;margin:0">This assessment is for informational purposes and does not diagnose sleep disorders. If you experience chronic fatigue, insomnia, or excessive daytime sleepiness, consult a healthcare professional.</p>
      </div>
      <div class="card" style="padding:14px 16px">
        <p style="font-size:10px;color:#98a2b3;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px 0;font-weight:600">Medical Disclaimer</p>
        <p style="font-size:11px;color:#667085;line-height:1.5;margin:0">This report reflects your sleep-wake preferences based on your assessment responses. It is not a medical diagnosis. Always consult your physician before making changes to your sleep or health routine.</p>
      </div>
    </div>

    <div style="text-align:center">
      <p style="font-size:10px;color:#98a2b3;margin:0">Powered by WelcomeCure HealthTech</p>
    </div>

  </div>
  <div class="footer">
    <span>CHRONOTYPE Intelligence by WelcomeCure HealthTech</span>
    <span>Page 2 of 2</span>
  </div>
</div>

</body></html>`;
}
