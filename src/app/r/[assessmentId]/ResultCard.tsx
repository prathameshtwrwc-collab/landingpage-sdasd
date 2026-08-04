import {
  Sunrise, Bird, MoonStar, SunMedium, BriefcaseBusiness,
  Zap, Target, UsersRound, Coffee, Moon, CalendarDays,
} from "lucide-react";
import {
  CHRONOTYPE_LABELS, CHRONOTYPE_DESCRIPTIONS, CHRONOTYPE_PEAK_TIMES,
  CHRONOTYPE_BLUEPRINT, type Chronotype,
} from "@/lib/chronotype-utils";
import type { PublicResultData } from "@/lib/queries/public-result";

const CHRONO_COLOR: Record<Chronotype, string> = { LARK: "#EE8300", EAGLE: "#30268F", OWL: "#7B68AE" };

const STRENGTHS: Record<Chronotype, { text: string; icon: typeof Zap }[]> = {
  LARK: [
    { text: "Daytime energy peaks before noon", icon: Zap },
    { text: "Consistent early-morning wake-up", icon: Sunrise },
    { text: "Strong focus in the early hours", icon: Target },
  ],
  EAGLE: [
    { text: "Steady midday energy for deep work", icon: Zap },
    { text: "Adaptable to most daily routines", icon: UsersRound },
    { text: "Balanced social and work timing", icon: Target },
  ],
  OWL: [
    { text: "Late-day creative focus", icon: Zap },
    { text: "Comfortable with flexible schedules", icon: UsersRound },
    { text: "Strong problem-solving at night", icon: Target },
  ],
};

const WATCH_OUTS: Record<Chronotype, { text: string; icon: typeof Zap }[]> = {
  LARK: [
    { text: "Evening social events drain energy quickly", icon: Coffee },
    { text: "Hard to stay awake past 10 PM", icon: Moon },
    { text: "Weekend sleep drift disrupts rhythm", icon: CalendarDays },
  ],
  EAGLE: [
    { text: "Rigid schedules can disrupt balance", icon: Coffee },
    { text: "Energy dips mid-afternoon", icon: Moon },
    { text: "Can drift without a consistent routine", icon: CalendarDays },
  ],
  OWL: [
    { text: "Early mornings feel physically costly", icon: Coffee },
    { text: "Morning fog and slow waking", icon: Moon },
    { text: "Fixed schedules create sleep debt", icon: CalendarDays },
  ],
};

const NEXT_STEPS: Record<Chronotype, string[]> = {
  LARK: ["Schedule important tasks before your noon peak", "Avoid caffeine after 2 PM to protect early sleep", "Wind down with dim lighting by 9 PM"],
  EAGLE: ["Block 10 AM – 2 PM for your deepest focus", "Keep consistent wake and bed times for stability", "Use midday energy for physical activity"],
  OWL: ["Use bright light within 30 min of waking", "Avoid critical tasks before 9 AM if possible", "Build a consistent 30-min pre-sleep routine"],
};

function isChronotype(v: string): v is Chronotype {
  return v === "LARK" || v === "EAGLE" || v === "OWL";
}

function formatDate(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function ChronotypeIllustration({ chrono }: { chrono: Chronotype }) {
  const color = CHRONO_COLOR[chrono];
  if (chrono === "LARK") return <Sunrise size={76} strokeWidth={1.4} stroke={color} aria-hidden="true" />;
  if (chrono === "OWL") return <MoonStar size={76} strokeWidth={1.4} stroke={color} aria-hidden="true" />;
  return <Bird size={76} strokeWidth={1.4} stroke={color} aria-hidden="true" />;
}

export default function SharedResultCard({ data }: { data: PublicResultData }) {
  const chrono = isChronotype(data.chronotype) ? data.chronotype : "EAGLE";
  const color = CHRONO_COLOR[chrono];
  const label = CHRONOTYPE_LABELS[chrono];
  const chronotypeName = label.split(" (")[0];
  const subtitle = chrono === "LARK" ? "Morning Type" : chrono === "EAGLE" ? "Intermediate Type" : "Evening Type";
  const desc = CHRONOTYPE_DESCRIPTIONS[chrono].description;
  const peaks = CHRONOTYPE_PEAK_TIMES[chrono];
  const blueprint = CHRONOTYPE_BLUEPRINT[chrono];
  // Prefer the member's actual selected inputs; fall back to the chronotype
  // template only when the answer is unavailable.
  const wakeTime = data.wakeTime ?? blueprint.window.split(" – ")[1] ?? "";
  const bedtime = data.bedtime ?? blueprint.window.split(" – ")[0] ?? "";
  const focusWindow = data.peakFocus ?? peaks.focus;
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Someone";
  const brandingCompany = data.brandingCompany || "";
  const brandingLogo = data.brandingLogo || "";
  const completedDate = formatDate(data.completedAt);
  /* If the sharing member has a referral code, the "Take the Test" CTA must
     carry it so the visitor's assessment is attributed to this member. */
  const testLink = data.referralCode
    ? `/?ref=${encodeURIComponent(data.referralCode)}`
    : "/";

  return (
    <div style={{
      maxWidth: "760px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "20px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      overflow: "hidden",
    }}>
      {/* Accent bar */}
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${color}, ${color}77)` }} />

      <div style={{ padding: "28px 24px" }}>
        {/* Branding */}
        {(brandingCompany || brandingLogo) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            {brandingLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandingLogo} alt={brandingCompany} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
            )}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#30268F" }}>{brandingCompany}</span>
          </div>
        )}

        {/* Hero */}
        <div className="r-hero" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(200px, 0.6fr)",
          alignItems: "center",
          gap: "24px",
          marginBottom: "18px",
        }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
              Shared Result
            </span>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#17172B", lineHeight: 1.15, margin: "0 0 8px" }}>
              {name}&apos;s chronotype is {chronotypeName}
            </h1>
            <span style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#EE8300",
              background: "#FFF8EF",
              border: "1px solid #F5CF9E",
            }}>
              {subtitle}
            </span>
            <p style={{ fontSize: "13px", color: "#66677A", lineHeight: 1.6, margin: "10px 0 0" }}>{desc}</p>
          </div>
          <div className="r-hero-visual" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "110px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChronotypeIllustration chrono={chrono} />
            </div>
            <span style={{
              display: "inline-flex",
              fontSize: "12px",
              fontWeight: 500,
              padding: "4px 12px",
              borderRadius: "999px",
              color: "#30268F",
              background: "#F6F4FF",
              border: "1px solid #D8D3FA",
            }}>
              Peak focus &middot; {focusWindow}
            </span>
          </div>
        </div>

        {/* Key schedule metrics */}
        <div className="r-metrics" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          border: "1px solid #E2E2EA",
          borderRadius: "12px",
          marginBottom: "14px",
        }}>
          {[
            { icon: SunMedium, label: "Ideal wake time", value: wakeTime, c: "#EE8300" },
            { icon: BriefcaseBusiness, label: "Best focus window", value: focusWindow, c: "#30268F" },
            { icon: MoonStar, label: "Ideal bedtime", value: bedtime, c: "#30268F" },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: "grid",
              gridTemplateColumns: "44px minmax(0, 1fr)",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderLeft: i > 0 ? "1px solid #E2E2EA" : "none",
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `${item.c}0d`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.icon size={20} strokeWidth={1.75} stroke={item.c} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#17172B", lineHeight: 1.3, margin: 0 }}>{item.value}</p>
                <p style={{ fontSize: "11px", color: "#66677A", margin: "2px 0 0" }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & watch-outs */}
        <div className="r-insights" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", marginBottom: "14px" }}>
          <div style={{ padding: "14px 16px", borderRadius: "12px", background: "#F5FBF7", border: "1px solid #C9DFD1" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#18794E", margin: "0 0 8px" }}>Natural strengths</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {STRENGTHS[chrono].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid rgba(24,121,78,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.icon size={14} strokeWidth={1.75} stroke="#18794E" />
                  </span>
                  <span style={{ fontSize: "12px", lineHeight: 1.4, color: "#17172B" }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "14px 16px", borderRadius: "12px", background: "#FFF8EF", border: "1px solid #F5CF9E" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#EE8300", margin: "0 0 8px" }}>Watch-outs</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {WATCH_OUTS[chrono].map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid rgba(238,131,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <w.icon size={14} strokeWidth={1.75} stroke="#EE8300" />
                  </span>
                  <span style={{ fontSize: "12px", lineHeight: 1.4, color: "#17172B" }}>{w.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best next steps */}
        <div style={{ padding: "14px 16px", borderRadius: "12px", background: "#F6F4FF", border: "1px solid #D8D3FA", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#30268F", margin: "0 0 9px" }}>Best next steps</p>
          <div className="r-next-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
            {NEXT_STEPS[chrono].map((tip, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "26px minmax(0, 1fr)", alignItems: "start", gap: "8px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#30268F", color: "#fff", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "11.5px", lineHeight: 1.45, color: "#17172B" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Take the test CTA */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "20px",
          borderRadius: "14px",
          marginBottom: "16px",
          background: `linear-gradient(135deg, ${color}14, ${color}08)`,
          border: `1px solid ${color}33`,
          textAlign: "center",
        }}>
          <p style={{ fontSize: "17px", fontWeight: 700, color: "#17172B", margin: 0, lineHeight: 1.3 }}>
            Wanna know your chronotype?
          </p>
          <p style={{ fontSize: "12.5px", color: "#66677A", margin: 0, lineHeight: 1.5, maxWidth: "420px" }}>
            Take the 2-minute Sleep Chronotype Assessment and discover your natural sleep rhythm &mdash; just like {name.split(" ")[0] || "they"} did.
          </p>
          <a
            href={testLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "46px",
              padding: "0 28px",
              borderRadius: "12px",
              background: "#3B35A3",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 4px 14px rgba(59,53,163,0.35)",
            }}
          >
            Take the Test
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", borderTop: "1px solid #eee", paddingTop: "14px" }}>
          <p style={{ fontSize: "11px", color: "#999", margin: 0, letterSpacing: "0.04em" }}>
            {completedDate ? `Assessment completed on ${completedDate} &nbsp;&middot;&nbsp; ` : ""}
            {brandingCompany ? `${brandingCompany} Chronotype` : "CHRONOTYPE Intelligence by WelcomeCure HealthTech"}
          </p>
          <p style={{ fontSize: "10px", color: "#bbb", margin: "4px 0 0", letterSpacing: "0.04em" }}>
            Wellness guidance only &mdash; not a medical diagnosis.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .r-hero { grid-template-columns: 1fr !important; text-align: center !important; }
          .r-hero-visual { flex-direction: row !important; justify-content: center !important; }
          .r-metrics { grid-template-columns: 1fr !important; }
          .r-metrics > div { border-left: none !important; border-top: 1px solid #E2E2EA !important; }
          .r-metrics > div:first-child { border-top: none !important; }
          .r-insights { grid-template-columns: 1fr !important; }
          .r-next-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
