export type ChronotypeReportViewModel = {
  participant: { name: string; firstName?: string; lastName?: string; email?: string; id?: string };
  organisation?: { name?: string; logoUrl?: string };
  report: { id?: string; assessmentDate?: string; assessmentId?: string };
  chronotype: { name: string; subtitle: string; description: string; illustrationSvg: string; wakeTime: string; focusWindow: string; bedtime: string };
  strengths: { text: string }[];
  watchOuts: { text: string }[];
  nextSteps: string[];
  timeline?: { time: string; label: string; desc: string }[];
  recommendations?: { title: string; description: string; category?: string }[];
  warnings?: string[];
  disclaimer?: string;
};

export type ReportData = {
  firstName?: string; lastName?: string; email?: string; chronotype: string;
  totalScore: number; larkScore: number; eagleScore: number; owlScore: number;
  summary?: string; orgName?: string;
};

type ChronoKey = "LARK" | "EAGLE" | "OWL";
function isChronoKey(v: string): v is ChronoKey {
  return v === "LARK" || v === "EAGLE" || v === "OWL";
}

const CHRONOTYPE_LABELS: Record<ChronoKey, string> = {
  LARK: "Lark (Morning Type)", EAGLE: "Eagle (Intermediate Type)", OWL: "Owl (Evening Type)",
};
const CHRONOTYPE_DESCRIPTIONS: Record<ChronoKey, { tagline: string; description: string }> = {
  LARK: { tagline: "Early to bed, early to rise \u2014 you own the morning.", description: "Larks naturally wake early and peak in the morning. You\u2019re most productive before noon and tend to wind down in the evening. Schedule important tasks early and use afternoons for lighter work." },
  EAGLE: { tagline: "Balanced and adaptable \u2014 you thrive at any hour.", description: "Eagles have a flexible rhythm that adapts well to most schedules. Your energy peaks midday, making you ideal for standard 9-to-5 routines. You can handle both morning meetings and evening social events with ease." },
  OWL: { tagline: "The night is your kingdom \u2014 you come alive after dark.", description: "Owls naturally peak in the evening and prefer later schedules. Your creativity and focus surge at night. You thrive with flexible schedules that allow you to sleep in and work when you\u2019re most alert." },
};
const CHRONOTYPE_PEAK_TIMES: Record<ChronoKey, { focus: string; creative: string; sleep: string }> = {
  LARK: { focus: "6:00 \u2013 9:00 AM", creative: "4:00 \u2013 6:00 PM", sleep: "9:30 PM" },
  EAGLE: { focus: "9:00 \u2013 11:00 AM", creative: "5:00 \u2013 7:00 PM", sleep: "10:45 PM" },
  OWL: { focus: "2:00 \u2013 5:00 PM", creative: "10:00 PM \u2013 1:00 AM", sleep: "12:30 AM" },
};
const CHRONOTYPE_BLUEPRINT: Record<ChronoKey, { window: string; need: string; cycle: string }> = {
  LARK: { window: "9:30 PM \u2013 5:30 AM", need: "7h 30m", cycle: "~90 min" },
  EAGLE: { window: "10:45 PM \u2013 6:30 AM", need: "7h 45m", cycle: "~96 min" },
  OWL: { window: "12:30 AM \u2013 8:30 AM", need: "8h 00m", cycle: "~100 min" },
};
const STRENGTHS: Record<ChronoKey, { text: string }[]> = {
  LARK: [{ text: "Daytime energy peaks before noon" }, { text: "Consistent early-morning wake-up" }, { text: "Strong focus in the early hours" }],
  EAGLE: [{ text: "Steady midday energy for deep work" }, { text: "Adaptable to most daily routines" }, { text: "Balanced social and work timing" }],
  OWL: [{ text: "Late-day creative focus" }, { text: "Comfortable with flexible schedules" }, { text: "Strong problem-solving at night" }],
};
const WATCH_OUTS: Record<ChronoKey, { text: string }[]> = {
  LARK: [{ text: "Evening social events drain energy quickly" }, { text: "Hard to stay awake past 10 PM" }, { text: "Weekend sleep drift disrupts rhythm" }],
  EAGLE: [{ text: "Rigid schedules can disrupt balance" }, { text: "Energy dips mid-afternoon" }, { text: "Can drift without a consistent routine" }],
  OWL: [{ text: "Early mornings feel physically costly" }, { text: "Morning fog and slow waking" }, { text: "Fixed schedules create sleep debt" }],
};
const NEXT_STEPS: Record<ChronoKey, string[]> = {
  LARK: ["Schedule important tasks before your noon peak", "Avoid caffeine after 2 PM to protect early sleep", "Wind down with dim lighting by 9 PM"],
  EAGLE: ["Block 10 AM \u2013 2 PM for your deepest focus", "Keep consistent wake and bed times for stability", "Use midday energy for physical activity"],
  OWL: ["Use bright light within 30 min of waking", "Avoid critical tasks before 9 AM if possible", "Build a consistent 30-min pre-sleep routine"],
};
const TIMELINES: Record<ChronoKey, { time: string; label: string; desc: string }[]> = {
  LARK: [
    { time: "5:30 AM", label: "Wake", desc: "Natural early rising" },
    { time: "6\u20139 AM", label: "Peak Focus", desc: "Deep work window" },
    { time: "12 PM", label: "Midday", desc: "Sustained energy" },
    { time: "4\u20136 PM", label: "Creative", desc: "Second wind" },
    { time: "8 PM", label: "Wind Down", desc: "Dim lights, relax" },
    { time: "9:30 PM", label: "Bedtime", desc: "Sleep window opens" },
  ],
  EAGLE: [
    { time: "6:30 AM", label: "Wake", desc: "Steady rise" },
    { time: "9\u201311 AM", label: "Peak Focus", desc: "Deep work window" },
    { time: "2 PM", label: "Midday Dip", desc: "Light tasks" },
    { time: "5\u20137 PM", label: "Creative", desc: "Evening creativity" },
    { time: "9 PM", label: "Wind Down", desc: "Begin relaxing" },
    { time: "10:45 PM", label: "Bedtime", desc: "Sleep window opens" },
  ],
  OWL: [
    { time: "8:30 AM", label: "Wake", desc: "Gradual morning" },
    { time: "2\u20135 PM", label: "Peak Focus", desc: "Deep work window" },
    { time: "12 PM", label: "Midday", desc: "Building energy" },
    { time: "10 PM\u20131 AM", label: "Creative", desc: "Peak creativity" },
    { time: "12 AM", label: "Wind Down", desc: "Dim lights, relax" },
    { time: "12:30 AM", label: "Bedtime", desc: "Sleep window opens" },
  ],
};

function safeStr(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function formatParticipantName(raw: string): string {
  if (!raw || raw === "Participant") return "Participant";
  return raw.split(/\s+/).map(part => {
    if (!part.length) return part;
    if (part.includes("-")) return part.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("-");
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join(" ");
}

function larkSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 120" fill="none" style="width:100%;height:100%">
    <ellipse cx="75" cy="68" rx="28" ry="22" fill="#FFEEDB" stroke="#ED8300" stroke-width="1.8"/>
    <circle cx="64" cy="56" r="16" fill="#FFEEDB" stroke="#ED8300" stroke-width="1.8"/>
    <circle cx="64" cy="56" r="4" fill="#ED8300" opacity="0.45"/>
    <path d="M68 52 L72 46 L76 52" stroke="#ED8300" stroke-width="1.6" fill="#ED8300" opacity="0.3" stroke-linejoin="round"/>
    <path d="M46 56 L36 46" stroke="#ED8300" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <path d="M56 46 L50 36" stroke="#ED8300" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
    <path d="M72 88 L80 96 L88 90" stroke="#ED8300" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56 88 Q64 94 88 86" stroke="#ED8300" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M60 44 L54 34 M68 42 L64 32" stroke="#ED8300" stroke-width="1.3" stroke-linecap="round" opacity="0.35"/>
    <path d="M46 60 L36 54" stroke="#ED8300" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    <path d="M38 52 L32 46" stroke="#ED8300" stroke-width="1.3" stroke-linecap="round" opacity="0.3"/>
    <path d="M76 46 L82 36" stroke="#ED8300" stroke-width="1.3" stroke-linecap="round" opacity="0.35"/>
  </svg>`;
}
function eagleSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 120" fill="none" style="width:100%;height:100%">
    <ellipse cx="75" cy="68" rx="28" ry="22" fill="#EDE9FE" stroke="#30268F" stroke-width="1.8"/>
    <circle cx="66" cy="56" r="16" fill="#EDE9FE" stroke="#30268F" stroke-width="1.8"/>
    <circle cx="66" cy="56" r="4" fill="#30268F" opacity="0.45"/>
    <path d="M52 58 Q44 44 36 42 Q48 48 56 46" stroke="#30268F" stroke-width="1.8" fill="#EDE9FE" stroke-linejoin="round"/>
    <path d="M82 58 Q90 44 98 42 Q86 48 78 46" stroke="#30268F" stroke-width="1.8" fill="#EDE9FE" stroke-linejoin="round"/>
    <path d="M60 48 L54 38" stroke="#30268F" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
    <path d="M72 48 L78 38" stroke="#30268F" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
    <path d="M34 48 L28 36" stroke="#30268F" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
    <path d="M100 48 L106 36" stroke="#30268F" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
    <path d="M70 54 L75 42 L80 54" stroke="#30268F" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
    <path d="M75 88 L75 100" stroke="#30268F" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M66 100 Q75 104 84 100" stroke="#30268F" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  </svg>`;
}
function owlSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 120" fill="none" style="width:100%;height:100%">
    <ellipse cx="75" cy="70" rx="30" ry="25" fill="#EDE9FE" stroke="#30268F" stroke-width="1.8"/>
    <circle cx="62" cy="60" r="14" fill="#F6F4FF" stroke="#30268F" stroke-width="1.5"/>
    <circle cx="88" cy="60" r="14" fill="#F6F4FF" stroke="#30268F" stroke-width="1.5"/>
    <circle cx="62" cy="60" r="6" fill="#30268F" opacity="0.5"/>
    <circle cx="88" cy="60" r="6" fill="#30268F" opacity="0.5"/>
    <path d="M62 84 Q75 92 88 84" stroke="#30268F" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56 44 L52 32" stroke="#30268F" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
    <path d="M94 44 L98 32" stroke="#30268F" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
    <path d="M48 48 L42 38 M102 48 L108 38" stroke="#30268F" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/>
    <circle cx="42" cy="42" r="5" stroke="#30268F" stroke-width="1.2" fill="#EDE9FE" opacity="0.45"/>
    <circle cx="108" cy="42" r="5" stroke="#30268F" stroke-width="1.2" fill="#EDE9FE" opacity="0.45"/>
    <path d="M70 48 L75 42 L80 48" stroke="#30268F" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>
    <path d="M75 94 L75 108" stroke="#30268F" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M66 108 Q75 112 84 108" stroke="#30268F" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  </svg>`;
}
function getChronotypeSvg(chronotype: string): string {
  if (chronotype === "LARK") return larkSvg();
  if (chronotype === "OWL") return owlSvg();
  return eagleSvg();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function safeFilename(name: string): string {
  return name.replace(/[\/\\:*?"<>|]/g, "").trim().slice(0, 80) || "participant";
}

export function buildReportHtml(data: ReportData): string {
  const key = isChronoKey(data.chronotype) ? data.chronotype : "EAGLE";
  const rawName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Participant";
  const name = formatParticipantName(rawName);
  const dateStr = formatDate(new Date());
  const subtitle = key === "LARK" ? "Morning Type" : key === "EAGLE" ? "Intermediate Type" : "Evening Type";
  const chronoName = CHRONOTYPE_LABELS[key].split(" (")[0];
  const descData = CHRONOTYPE_DESCRIPTIONS[key];
  const blueprint = CHRONOTYPE_BLUEPRINT[key];
  const peaks = CHRONOTYPE_PEAK_TIMES[key];
  const wakeTime = blueprint.window.split(" \u2013 ")[1] ?? "";
  const bedtime = blueprint.window.split(" \u2013 ")[0] ?? "";
  const strengths = STRENGTHS[key];
  const watchOuts = WATCH_OUTS[key];
  const nextSteps = NEXT_STEPS[key];
  const timeline = TIMELINES[key];
  const illustrationSvg = getChronotypeSvg(key);
  const reportId = "CHR-" + Date.now().toString(36).toUpperCase().slice(-6);

  const pageCss = `
.pdf-page {
  width: 794px; min-height: 1123px; height: 1123px;
  box-sizing: border-box; position: relative; overflow: hidden;
  background: #ffffff; padding: 40px 44px 42px;
  font-family: "Poppins", var(--font-poppins), 'Segoe UI', sans-serif; color: #17172b;
}
.pdf-content-width {
  width: 100%; max-width: 706px; margin-inline: auto;
}
.pdf-header {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 14px; border-bottom: 1px solid #dfdfe8; margin-bottom: 0;
}
.pdf-header-left {
  display: flex; align-items: center; gap: 8px;
}
.pdf-header-logo-text {
  font-size: 18px; font-weight: 700; color: #30268f;
  letter-spacing: -0.02em; line-height: 1.2;
}
.pdf-footer {
  position: absolute; bottom: 24px; left: 44px; right: 44px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 9.5px; color: #68697a;
  padding-top: 10px; border-top: 1px solid #dfdfe8;
}
.pdf-footer-left { max-width: 60%; }
.pdf-section-title {
  font-size: 15px; font-weight: 600; color: #17172b;
  margin: 0 0 10px 0; line-height: 1.3;
}
.pdf-body { font-size: 11.5px; font-weight: 400; color: #17172b; line-height: 1.5; }
.pdf-small { font-size: 9.5px; font-weight: 400; color: #68697a; line-height: 1.4; }
.pdf-micro { font-size: 8.5px; font-weight: 400; color: #68697a; line-height: 1.4; }
.pdf-label { color: #5f6072; }
.pdf-pill {
  display: inline-flex; align-items: center; width: fit-content;
  padding: 3px 10px; border-radius: 999px; font-size: 11px;
  font-weight: 500; line-height: 1.3;
}
.pdf-pill-orange { background: #fff8ef; color: #ed8300; border: 1px solid #f4d0a2; }
.pdf-pill-indigo { background: #f6f4ff; color: #30268f; border: 1px solid #dad5fa; }
.pdf-chronotype-title-block {
  display: flex; flex-direction: column; align-items: flex-start;
}
.pdf-chronotype-eyebrow {
  display: block; margin: 0 0 14px;
  font-size: 9.5px; font-weight: 600; color: #30268f;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.pdf-chronotype-name {
  display: block; margin: 0; padding: 0;
  font-size: 34px; font-weight: 700; line-height: 1; color: #17172b;
}
.pdf-chronotype-subtitle {
  display: inline-flex; align-items: center; width: fit-content;
  min-height: 28px; margin-top: 14px; padding: 5px 13px;
  line-height: 1; border-radius: 999px;
  font-size: 11px; font-weight: 500;
  background: #fff8ef; color: #ed8300; border: 1px solid #f4d0a2;
}
.pdf-chronotype-description {
  margin-top: 16px;
  font-size: 11.5px; line-height: 1.5; color: #68697a;
}
.pdf-hero {
  display: grid; grid-template-columns: minmax(0, 1.45fr) 190px;
  gap: 28px; align-items: center;
  min-height: 205px; padding: 24px 28px;
  background: #f8f8fb;
}
.pdf-hero-visual {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 14px; min-width: 0;
}
.pdf-hero-illustration { width: 150px; height: 120px; display: flex; align-items: center; justify-content: center; }
.pdf-metrics {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0; border: 1px solid #dfdfe8; border-width: 1px 0;
}
.pdf-metric {
  display: grid; grid-template-columns: 32px minmax(0, 1fr);
  align-items: center; gap: 12px; padding: 12px 22px;
}
.pdf-metric + .pdf-metric { border-left: 1px solid #dfdfe8; }
.pdf-metric-icon { width: 22px; height: 22px; } .pdf-metric-icon svg { width: 22px; height: 22px; }
.pdf-metric-copy { display: flex; flex-direction: column; justify-content: center; gap: 3px; }
.pdf-metric-value { font-size: 14px; font-weight: 600; color: #17172b; line-height: 1.3; }
.pdf-metric-label { font-size: 9.5px; color: #5f6072; line-height: 1.3; }
.pdf-insights-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px; align-items: stretch;
}
.pdf-insight-panel {
  display: flex; flex-direction: column; min-width: 0; padding: 18px;
}
.pdf-insight-heading { font-size: 14px; font-weight: 600; margin-bottom: 14px; }
.pdf-insight-list { display: grid; gap: 10px; }
.pdf-insight-item {
  display: grid; grid-template-columns: 14px minmax(0, 1fr);
  align-items: baseline; gap: 8px;
}
.pdf-insight-dot { font-size: 11px; flex-shrink: 0; }
.pdf-insight-text { font-size: 11.5px; line-height: 1.4; color: #17172b; }
.pdf-next-steps { padding: 16px 18px 18px; background: #f6f4ff; border: 1px solid #dad5fa; }
.pdf-next-steps-title { margin: 0 0 14px; }
.pdf-next-steps-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; }
.pdf-next-step {
  display: grid; grid-template-columns: 28px minmax(0, 1fr);
  align-items: start; gap: 10px; padding: 0 16px;
}
.pdf-next-step + .pdf-next-step { border-left: 1px solid #dad5fa; }
.pdf-next-step-number {
  display: grid; place-items: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: #30268f; color: #ffffff;
  font-size: 12px; font-weight: 600; line-height: 1;
  margin-top: 1px;
}
.pdf-next-step-text { font-size: 11.5px; line-height: 1.4; color: #17172b; }
.pdf-daily-rhythm {
  padding: 16px 18px 18px;
  background: #fafaff; border: 1px solid #e2e0f4; border-radius: 10px;
}
.pdf-daily-rhythm-title { margin: 0 0 18px; }
.pdf-timeline {
  display: grid; grid-template-columns: repeat(6, minmax(0, 1fr));
  position: relative;
}
.pdf-timeline-line {
  position: absolute; top: 5px; left: 8%; right: 8%;
  height: 2px; background: #e0ddf5; z-index: 0;
}
.pdf-timeline-item {
  display: grid; grid-template-rows: 12px auto auto auto;
  justify-items: center; text-align: center; row-gap: 5px; position: relative; z-index: 1;
}
.pdf-timeline-dot {
  width: 10px; height: 10px; border-radius: 50%;
  border: 2px solid #fff; box-sizing: content-box;
}
.pdf-timeline-time { font-size: 11.5px; font-weight: 600; color: #17172b; line-height: 1.2; white-space: nowrap; }
.pdf-timeline-label { font-size: 10px; font-weight: 500; color: #30268f; line-height: 1.3; }
.pdf-timeline-desc { font-size: 8.5px; color: #68697a; line-height: 1.3; }
.pdf-page-two-header {
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center; gap: 14px; min-height: 48px;
  border-bottom: 1px solid #dfdfe8;
}
.pdf-page-two-identity { display: flex; align-items: center; gap: 12px; }
.pdf-page-two-heading { margin: 26px 0 10px; font-size: 22px; font-weight: 700; line-height: 1.2; color: #17172b; }
.pdf-recommendations-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(142px, auto); column-gap: 30px; align-items: stretch;
}
.pdf-recommendation {
  display: grid; grid-template-columns: 34px minmax(0, 1fr);
  align-content: start; gap: 12px;
  padding: 18px 0; border-bottom: 1px solid #e2e2ea;
}
.pdf-recommendation-number {
  display: grid; place-items: center;
  width: 28px; height: 28px; border-radius: 8px;
  background: #f2efff; color: #30268f;
  font-size: 11px; font-weight: 600;
}
.pdf-recommendation-title { font-size: 13px; font-weight: 600; color: #17172b; margin-bottom: 5px; line-height: 1.35; }
.pdf-recommendation-desc { font-size: 11px; line-height: 1.5; color: #68697a; }
.pdf-important-notice {
  margin: 22px 0 0; padding: 14px 16px;
  background: #fff8ef; border: 1px solid #f4d0a2;
}
.pdf-important-notice-title {
  font-size: 11px; font-weight: 600; color: #ed8300; margin-bottom: 6px; line-height: 1.3;
}
.pdf-important-notice-body {
  font-size: 10px; line-height: 1.45; color: #68697a; margin: 0;
}
`;

  const headerBlock = `
<div class="pdf-header pdf-content-width">
  <div class="pdf-header-left">
    <div style="width:32px;height:32px;border-radius:8px;background:#30268f;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <span style="color:#fff;font-size:16px;font-weight:700;line-height:1">C</span>
    </div>
    <span class="pdf-header-logo-text">Chronotype</span>
  </div>
  ${data.orgName ? `<div style="display:flex;align-items:center;gap:8px"><span style="font-size:11px;font-weight:500;color:#68697a">${escapeHtml(data.orgName)}</span></div>` : ""}
</div>`;

  const footerBlock = (pageNum: number, totalPages: number) => `
<div class="pdf-footer">
  <div class="pdf-footer-left pdf-small">Wellness guidance only \u2014 not a medical diagnosis.</div>
  <div class="pdf-small">${escapeHtml(reportId)} \u00B7 Page ${pageNum} of ${totalPages}</div>
</div>`;

  const metadataBlock = `
<div class="pdf-content-width" style="display:grid;grid-template-columns:130px 145px minmax(0,1fr);column-gap:20px;align-items:start;margin-top:14px;margin-bottom:0">
  <div style="display:grid;grid-template-rows:auto auto;row-gap:6px">
    <div class="pdf-small" style="text-transform:uppercase;letter-spacing:0.04em">Prepared for</div>
    <div class="pdf-body" style="font-weight:600">${escapeHtml(name)}</div>
  </div>
  <div style="display:grid;grid-template-rows:auto auto;row-gap:6px">
    <div class="pdf-small" style="text-transform:uppercase;letter-spacing:0.04em">Assessment date</div>
    <div class="pdf-body">${dateStr}</div>
  </div>
  <div style="display:grid;grid-template-rows:auto auto;row-gap:6px">
    <div class="pdf-small" style="text-transform:uppercase;letter-spacing:0.04em">Report ID</div>
    <div class="pdf-body">${escapeHtml(reportId)}</div>
  </div>
</div>`;

  const heroBlock = `
<div class="pdf-hero pdf-content-width">
  <div class="pdf-chronotype-title-block">
    <span class="pdf-chronotype-eyebrow">YOUR CHRONOTYPE</span>
    <h1 class="pdf-chronotype-name">${escapeHtml(chronoName)}</h1>
    <span class="pdf-chronotype-subtitle">${escapeHtml(subtitle)}</span>
    <p class="pdf-chronotype-description">${escapeHtml(descData.description)}</p>
  </div>
  <div class="pdf-hero-visual">
    <div class="pdf-hero-illustration">${illustrationSvg}</div>
    <span class="pdf-pill pdf-pill-indigo">Peak focus \u00B7 ${peaks.focus}</span>
  </div>
</div>`;

  const svgSun = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#30268f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>';
  const svgBriefcase = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#30268f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>';
  const svgMoon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#30268f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 6 6 6 6 0 0 0-6 6 6 6 0 0 0-6-6 6 6 0 0 0 6-6Z"/><path d="M12 15v4"/><path d="M12 21v-2"/></svg>';

  const metricsBlock = `
<div class="pdf-metrics pdf-content-width">
  <div class="pdf-metric">
    <div class="pdf-metric-icon">${svgSun}</div>
    <div class="pdf-metric-copy">
      <div class="pdf-metric-value">${escapeHtml(wakeTime)}</div>
      <div class="pdf-metric-label">Ideal wake time</div>
    </div>
  </div>
  <div class="pdf-metric">
    <div class="pdf-metric-icon">${svgBriefcase}</div>
    <div class="pdf-metric-copy">
      <div class="pdf-metric-value">${escapeHtml(peaks.focus)}</div>
      <div class="pdf-metric-label">Best focus window</div>
    </div>
  </div>
  <div class="pdf-metric">
    <div class="pdf-metric-icon">${svgMoon}</div>
    <div class="pdf-metric-copy">
      <div class="pdf-metric-value">${escapeHtml(bedtime)}</div>
      <div class="pdf-metric-label">Ideal bedtime</div>
    </div>
  </div>
</div>`;

  const insightsBlock = `
<div class="pdf-insights-grid pdf-content-width">
  <div class="pdf-insight-panel" style="background:#f5faf7;border:1px solid #cce0d3">
    <div class="pdf-insight-heading" style="color:#18794e">Natural strengths</div>
    <div class="pdf-insight-list">
      ${strengths.map(s => `
      <div class="pdf-insight-item">
        <span class="pdf-insight-dot" style="color:#18794e">\u25CF</span>
        <span class="pdf-insight-text">${escapeHtml(s.text)}</span>
      </div>`).join("")}
    </div>
  </div>
  <div class="pdf-insight-panel" style="background:#fff8ef;border:1px solid #f4d0a2">
    <div class="pdf-insight-heading" style="color:#ed8300">Watch-outs</div>
    <div class="pdf-insight-list">
      ${watchOuts.map(w => `
      <div class="pdf-insight-item">
        <span class="pdf-insight-dot" style="color:#ed8300">\u25CF</span>
        <span class="pdf-insight-text">${escapeHtml(w.text)}</span>
      </div>`).join("")}
    </div>
  </div>
</div>`;

  const nextStepsBlock = `
<div class="pdf-next-steps pdf-content-width">
  <div class="pdf-section-title pdf-next-steps-title" style="margin-bottom:14px">Best next steps</div>
  <div class="pdf-next-steps-grid">
    ${nextSteps.slice(0, 3).map((step, i) => `
    <div class="pdf-next-step">
      <div class="pdf-next-step-number">${i + 1}</div>
      <span class="pdf-next-step-text">${escapeHtml(step)}</span>
    </div>`).join("")}
  </div>
</div>`;

  const timelineDots = timeline.map((t, i) => {
    const dotColor = i === 0 || i === 3 ? '#ed8300' : '#30268f';
    const shadowColor = dotColor;
    return `<div class="pdf-timeline-item">
      <div class="pdf-timeline-dot" style="background:${dotColor};box-shadow:0 0 0 1.5px ${shadowColor}"></div>
      <div class="pdf-timeline-time">${escapeHtml(t.time)}</div>
      <div class="pdf-timeline-label">${escapeHtml(t.label)}</div>
      <div class="pdf-timeline-desc">${escapeHtml(t.desc)}</div>
    </div>`;
  }).join("");

  const timelineBlock = `
<div class="pdf-daily-rhythm pdf-content-width">
  <div class="pdf-section-title pdf-daily-rhythm-title">Your daily rhythm</div>
  <div class="pdf-timeline">
    <div class="pdf-timeline-line"></div>
    ${timelineDots}
  </div>
</div>`;

  const page1 = `
<div class="pdf-page">
  <div class="pdf-content-width" style="display:flex;flex-direction:column;gap:18px">
    ${headerBlock}
    ${metadataBlock}
    ${heroBlock}
    ${metricsBlock}
    ${insightsBlock}
    ${nextStepsBlock}
    ${timelineBlock}
  </div>
  ${footerBlock(1, 2)}
</div>`;

  const recs: { category: string; title: string; description: string }[] = [
    { category: "Sleep Consistency", title: "Anchor Your Sleep Window", description: `Go to bed and wake up at consistent times within your ideal window (${blueprint.window}). Even on weekends, staying within 30 minutes of your target preserves your circadian rhythm.` },
    { category: "Energy Management", title: "Schedule Around Your Peak", description: `Your peak energy is ${peaks.focus}. Block this time for your most demanding cognitive work \u2014 deep focus, strategy, and creative tasks.` },
    { category: "Morning Routine", title: key === "LARK" ? "Protect Your Morning Advantage" : key === "OWL" ? "Use Morning Light Deliberately" : "Strengthen Your Circadian Anchor", description: key === "LARK" ? "Your morning clarity is your superpower. Avoid scheduling distractions before 10 AM." : key === "OWL" ? "Expose yourself to bright light within 30 minutes of waking to help shift your internal clock earlier." : "Get 15 minutes of sunlight within an hour of waking to reinforce your natural rhythm." },
    { category: "Wind Down", title: key === "OWL" ? "Reduce Late Stimulation" : "Wind Down Gradually", description: key === "OWL" ? "Dim lights and avoid screens 45 minutes before your target bedtime. Blue light delays melatonin production." : "Begin winding down 1 hour before your ideal bedtime. Lower lights, avoid screens, and try light reading or meditation." },
    { category: "Movement", title: key === "LARK" ? "Use Early Activity" : key === "EAGLE" ? "Use Afternoon Movement" : "Use Evening Movement", description: key === "LARK" ? "Morning exercise (6\u20138 AM) aligns perfectly with your peak cortisol and body temperature." : key === "EAGLE" ? "Afternoon workouts (2\u20134 PM) match your energy curve and avoid disrupting sleep." : "Light evening movement like walking or yoga (6\u20138 PM) helps transition without overstimulating." },
    { category: "Nutrition", title: "Time Your Meals", description: "Avoid heavy meals within 2 hours of bedtime. Your last caffeine should be at least 6 hours before your sleep window starts." },
  ];

  // True 3x2 grid order: [0,3,1,4,2,5]
  const gridOrder = [recs[0], recs[3], recs[1], recs[4], recs[2], recs[5]];
  const recIndices = [0, 3, 1, 4, 2, 5];

  const recommendationsBlock = `
<div class="pdf-recommendations-grid pdf-content-width">
  ${gridOrder.map((rec, idx) => {
    const realIdx = recIndices[idx];
    return `
  <div class="pdf-recommendation">
    <div class="pdf-recommendation-number">${realIdx + 1}</div>
    <div>
      <div class="pdf-recommendation-title">${escapeHtml(rec.title)}</div>
      <div class="pdf-recommendation-desc">${escapeHtml(rec.description)}</div>
    </div>
  </div>`;
  }).join("")}
</div>`;

  const noticeBlock = `
<div class="pdf-important-notice pdf-content-width">
  <div class="pdf-important-notice-title">Important notice</div>
  <p class="pdf-important-notice-body">This report reflects your sleep-wake preferences based on your assessment responses. It is not a medical diagnosis. Always consult your physician before making changes to your sleep or health routine. If you experience chronic fatigue, insomnia, or excessive daytime sleepiness, seek professional medical advice.</p>
</div>`;

  const page2Header = `
<div class="pdf-page-two-header pdf-content-width">
  <div class="pdf-page-two-identity">
    <div style="width:24px;height:24px;border-radius:6px;background:#30268f;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <span style="color:#fff;font-size:12px;font-weight:700;line-height:1">C</span>
    </div>
    <span style="font-size:13px;font-weight:600;color:#17172b">${escapeHtml(name)}</span>
    <span class="pdf-pill pdf-pill-orange" style="font-size:9.5px;padding:2px 10px;line-height:1.2">${escapeHtml(chronoName)}</span>
  </div>
  <div class="pdf-small" style="text-align:right">${escapeHtml(reportId)}</div>
</div>`;

  const page2 = `
<div class="pdf-page">
  <div class="pdf-content-width" style="display:flex;flex-direction:column;gap:0">
    ${page2Header}
    <h2 class="pdf-page-two-heading">Your personalised daily guidance</h2>
    ${recommendationsBlock}
    ${noticeBlock}
  </div>
  ${footerBlock(2, 2)}
</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Chronotype Report \u2014 ${escapeHtml(chronoName)}</title>
<style>
@page { margin: 0; size: A4; }
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }
${pageCss}
.pdf-render-root *, .pdf-render-root *::before, .pdf-render-root *::after {
  animation: none !important; transition: none !important; caret-color: transparent !important;
}
</style>
</head>
<body>
<div class="pdf-render-root">
${page1}
${page2}
</div>
</body>
</html>`;
}

export function buildReportViewModel(data: ReportData): ChronotypeReportViewModel {
  const key = isChronoKey(data.chronotype) ? data.chronotype : "EAGLE";
  const subtitle = key === "LARK" ? "Morning Type" : key === "EAGLE" ? "Intermediate Type" : "Evening Type";
  const chronoName = CHRONOTYPE_LABELS[key].split(" (")[0];
  const descData = CHRONOTYPE_DESCRIPTIONS[key];
  const blueprint = CHRONOTYPE_BLUEPRINT[key];
  const peaks = CHRONOTYPE_PEAK_TIMES[key];
  const wakeTime = blueprint.window.split(" \u2013 ")[1] ?? "";
  const bedtime = blueprint.window.split(" \u2013 ")[0] ?? "";
  return {
    participant: { name: [data.firstName, data.lastName].filter(Boolean).join(" ") || "Participant", firstName: data.firstName, lastName: data.lastName, email: data.email },
    organisation: data.orgName ? { name: data.orgName } : undefined,
    report: { id: "CHR-" + Date.now().toString(36).toUpperCase().slice(-6), assessmentDate: formatDate(new Date()) },
    chronotype: { name: chronoName, subtitle, description: descData.description, illustrationSvg: getChronotypeSvg(key), wakeTime, focusWindow: peaks.focus, bedtime },
    strengths: STRENGTHS[key], watchOuts: WATCH_OUTS[key], nextSteps: NEXT_STEPS[key], timeline: TIMELINES[key],
  };
}

export function buildReportFilename(data: ReportData): string {
  const name = safeFilename([data.firstName, data.lastName].filter(Boolean).join("-"));
  const date = new Date().toISOString().slice(0, 10);
  return `chronotype-report-${name || "participant"}-${date}.pdf`;
}
