export type ChronoKey = "LARK" | "EAGLE" | "OWL";

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

export type PdfReportViewModel = {
  participantName: string;
  participantEmail: string;
  orgName: string | null;
  reportId: string;
  assessmentDate: string;
  chronotypeKey: ChronoKey;
  chronotypeName: string;
  subtitle: string;
  description: string;
  wakeTime: string;
  focusWindow: string;
  bedtime: string;
  peakFocus: string;
  strengths: string[];
  watchOuts: string[];
  nextSteps: string[];
  timeline: { time: string; label: string; desc: string }[];
  recommendations: { title: string; description: string }[];
  accent: string;
};

function isChronoKey(v: string): v is ChronoKey {
  return v === "LARK" || v === "EAGLE" || v === "OWL";
}

const CHRONOTYPE_LABELS: Record<ChronoKey, string> = {
  LARK: "Lark",
  EAGLE: "Eagle",
  OWL: "Owl",
};

const CHRONOTYPE_SUBTITLES: Record<ChronoKey, string> = {
  LARK: "Morning Type",
  EAGLE: "Intermediate Type",
  OWL: "Evening Type",
};

const CHRONOTYPE_DESCRIPTIONS: Record<ChronoKey, string> = {
  LARK: "Larks naturally wake early and tend to perform best during the morning. Your strongest focus window is earlier in the day, while evenings are better suited to winding down.",
  EAGLE: "Eagles have a balanced, adaptable rhythm. Your energy peaks around midday, making you well suited to standard working hours and consistent daily routines.",
  OWL: "Owls naturally peak in the evening and prefer later schedules. Your creativity and focus are strongest at night, so flexible routines suit you best.",
};

const CHRONOTYPE_PEAK_TIMES: Record<ChronoKey, { focus: string; creative: string; sleep: string }> = {
  LARK: { focus: "6:00 – 9:00 AM", creative: "4:00 – 6:00 PM", sleep: "9:30 PM" },
  EAGLE: { focus: "9:00 – 11:00 AM", creative: "5:00 – 7:00 PM", sleep: "10:45 PM" },
  OWL: { focus: "2:00 – 5:00 PM", creative: "10:00 PM – 1:00 AM", sleep: "12:30 AM" },
};

const CHRONOTYPE_BLUEPRINT: Record<ChronoKey, { window: string; need: string; cycle: string }> = {
  LARK: { window: "9:30 PM – 5:30 AM", need: "7h 30m", cycle: "~90 min" },
  EAGLE: { window: "10:45 PM – 6:30 AM", need: "7h 45m", cycle: "~96 min" },
  OWL: { window: "12:30 AM – 8:30 AM", need: "8h 00m", cycle: "~100 min" },
};

const STRENGTHS: Record<ChronoKey, string[]> = {
  LARK: ["Daytime energy peaks before noon", "Consistent early-morning wake-up", "Strong focus in the early hours"],
  EAGLE: ["Steady midday energy for deep work", "Adaptable to most daily routines", "Balanced social and work timing"],
  OWL: ["Late-day creative focus", "Comfortable with flexible schedules", "Strong problem-solving at night"],
};

const WATCH_OUTS: Record<ChronoKey, string[]> = {
  LARK: ["Evening social events drain energy quickly", "Hard to stay awake past 10 PM", "Weekend sleep drift disrupts rhythm"],
  EAGLE: ["Rigid schedules can disrupt balance", "Energy dips mid-afternoon", "Can drift without a consistent routine"],
  OWL: ["Early mornings feel physically costly", "Morning fog and slow waking", "Fixed schedules create sleep debt"],
};

const NEXT_STEPS: Record<ChronoKey, string[]> = {
  LARK: ["Schedule important tasks before your noon peak", "Avoid caffeine after 2 PM to protect early sleep", "Wind down with dim lighting by 9 PM"],
  EAGLE: ["Block 10 AM – 2 PM for your deepest focus", "Keep consistent wake and bed times for stability", "Use midday energy for physical activity"],
  OWL: ["Use bright light within 30 min of waking", "Avoid critical tasks before 9 AM if possible", "Build a consistent 30-min pre-sleep routine"],
};

const TIMELINES: Record<ChronoKey, { time: string; label: string; desc: string }[]> = {
  LARK: [
    { time: "5:30 AM", label: "Wake", desc: "Natural early rising" },
    { time: "6–9 AM", label: "Peak Focus", desc: "Deep work window" },
    { time: "12 PM", label: "Midday", desc: "Sustained energy" },
    { time: "4–6 PM", label: "Creative", desc: "Second wind" },
    { time: "8 PM", label: "Wind Down", desc: "Dim lights, relax" },
    { time: "9:30 PM", label: "Bedtime", desc: "Sleep window opens" },
  ],
  EAGLE: [
    { time: "6:30 AM", label: "Wake", desc: "Steady rise" },
    { time: "9–11 AM", label: "Peak Focus", desc: "Deep work window" },
    { time: "2 PM", label: "Midday Dip", desc: "Light tasks" },
    { time: "5–7 PM", label: "Creative", desc: "Evening creativity" },
    { time: "9 PM", label: "Wind Down", desc: "Begin relaxing" },
    { time: "10:45 PM", label: "Bedtime", desc: "Sleep window opens" },
  ],
  OWL: [
    { time: "8:30 AM", label: "Wake", desc: "Gradual morning" },
    { time: "2–5 PM", label: "Peak Focus", desc: "Deep work window" },
    { time: "12 PM", label: "Midday", desc: "Building energy" },
    { time: "10 PM–1 AM", label: "Creative", desc: "Peak creativity" },
    { time: "12 AM", label: "Wind Down", desc: "Dim lights, relax" },
    { time: "12:30 AM", label: "Bedtime", desc: "Sleep window opens" },
  ],
};

function formatParticipantName(raw: string): string {
  if (!raw || raw.trim() === "") return "Participant";
  return raw
    .split(/\s+/)
    .map((part) => {
      if (!part.length) return part;
      if (part.includes("-")) {
        return part
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
          .join("-");
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function buildPdfReportViewModel(data: ReportData): PdfReportViewModel {
  const key = isChronoKey(data.chronotype) ? data.chronotype : "EAGLE";
  const blueprint = CHRONOTYPE_BLUEPRINT[key];
  const peaks = CHRONOTYPE_PEAK_TIMES[key];
  const wakeTime = blueprint.window.split(" – ")[1] ?? "";
  const bedtime = blueprint.window.split(" – ")[0] ?? "";

  const recCategories = [
    { category: "Sleep Consistency", title: "Anchor Your Sleep Window", description: `Go to bed and wake up at consistent times within your ideal window (${blueprint.window}). Even on weekends, staying within 30 minutes of your target preserves your circadian rhythm.` },
    { category: "Energy Management", title: "Schedule Around Your Peak", description: `Your peak energy is ${peaks.focus}. Block this time for your most demanding cognitive work — deep focus, strategy, and creative tasks.` },
    { category: "Morning Routine", title: key === "LARK" ? "Protect Your Morning Advantage" : key === "OWL" ? "Use Morning Light Deliberately" : "Strengthen Your Circadian Anchor", description: key === "LARK" ? "Your morning clarity is your superpower. Avoid scheduling distractions before 10 AM." : key === "OWL" ? "Expose yourself to bright light within 30 minutes of waking to help shift your internal clock earlier." : "Get 15 minutes of sunlight within an hour of waking to reinforce your natural rhythm." },
    { category: "Wind Down", title: key === "OWL" ? "Reduce Late Stimulation" : "Wind Down Gradually", description: key === "OWL" ? "Dim lights and avoid screens 45 minutes before your target bedtime. Blue light delays melatonin production." : "Begin winding down 1 hour before your ideal bedtime. Lower lights, avoid screens, and try light reading or meditation." },
    { category: "Movement", title: key === "LARK" ? "Use Early Activity" : key === "EAGLE" ? "Use Afternoon Movement" : "Use Evening Movement", description: key === "LARK" ? "Morning exercise (6–8 AM) aligns perfectly with your peak cortisol and body temperature." : key === "EAGLE" ? "Afternoon workouts (2–4 PM) match your energy curve and avoid disrupting sleep." : "Light evening movement like walking or yoga (6–8 PM) helps transition without overstimulating." },
    { category: "Nutrition", title: "Time Your Meals", description: "Avoid heavy meals within 2 hours of bedtime. Your last caffeine should be at least 6 hours before your sleep window starts." },
  ];

  return {
    participantName: formatParticipantName([data.firstName, data.lastName].filter(Boolean).join(" ")),
    participantEmail: data.email ?? "",
    orgName: data.orgName ?? null,
    reportId: "CHR-" + Date.now().toString(36).toUpperCase().slice(-6),
    assessmentDate: formatDate(new Date()),
    chronotypeKey: key,
    chronotypeName: CHRONOTYPE_LABELS[key],
    subtitle: CHRONOTYPE_SUBTITLES[key],
    description: CHRONOTYPE_DESCRIPTIONS[key],
    wakeTime,
    focusWindow: peaks.focus,
    bedtime,
    peakFocus: peaks.focus,
    strengths: STRENGTHS[key],
    watchOuts: WATCH_OUTS[key],
    nextSteps: NEXT_STEPS[key],
    timeline: TIMELINES[key],
    recommendations: recCategories,
    accent: key === "LARK" ? "#ED8300" : "#30268F",
  };
}

export function buildReportFilename(data: ReportData): string {
  const raw = [data.firstName, data.lastName].filter(Boolean).join("-") || "participant";
  const name = raw.replace(/[\/\\:*?"<>|]/g, "").trim().slice(0, 80) || "participant";
  const date = new Date().toISOString().slice(0, 10);
  return `chronotype-report-${name}-${date}.pdf`;
}
