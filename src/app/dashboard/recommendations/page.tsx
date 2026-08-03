"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cachedFetch } from "@/lib/client-cache";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useThemeDark } from "@/lib/use-theme-dark";
import { useConsult } from "@/components/consult/ConsultContext";
import { Stethoscope } from "lucide-react";

function ageToRange(age: unknown): string {
  const n = parseInt(String(age), 10);
  if (isNaN(n)) return "";
  if (n >= 5 && n <= 7) return "5 - 7";
  if (n > 7 && n <= 15) return "7 - 15";
  if (n > 15 && n <= 18) return "15 - 18";
  if (n > 18 && n <= 25) return "18 - 25";
  if (n > 25 && n <= 35) return "25 - 35";
  if (n > 35 && n <= 45) return "35 - 45";
  if (n > 45 && n <= 55) return "45 - 55";
  if (n > 55 && n <= 65) return "55 - 65";
  return "65+";
}

function toPrefill(m: Record<string, unknown>) {
  return {
    fname: String(m.first_name ?? ""),
    lname: String(m.last_name ?? ""),
    age: ageToRange(m.age),
    gender: String(m.gender ?? ""),
    maritalStatus: String(m.marital_status ?? ""),
    country: String(m.country ?? ""),
    state: String(m.location ?? m.state ?? ""),
    city: String(m.city ?? ""),
    pincode: String(m.pincode ?? ""),
    email: String(m.email ?? ""),
    phone: String(m.phone ?? ""),
  };
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const dark = useThemeDark();
  const { openPrefilled } = useConsult();
  const [member, setMember] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      cachedFetch<{ member: Record<string, unknown> | null }>(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((d) => { setMember(d.member ?? null); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const headingColor = dark ? "#E0E0E0" : "#171717";
  const mutedColor = dark ? "#8B8BA6" : "#667085";
  const panelBg = dark ? "#1A1A2E" : "#FFFFFF";
  const panelBorder = dark ? "#2A2A4A" : "#E6E8F0";

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Recommendations</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: headingColor, fontFamily: "Poppins, sans-serif" }}>Your Recommendations</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
          Loading your recommendations...
        </div>
      ) : (
        <div
          className="rounded-[18px] px-[20px] py-[36px] md:px-[32px] flex flex-col items-center text-center"
          style={{ background: panelBg, border: `1px solid ${panelBorder}`, boxShadow: dark ? "none" : "0 2px 12px rgba(23,23,23,0.05)", fontFamily: "Poppins, sans-serif" }}
        >
          <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-[18px]" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 8px 24px rgba(53,49,155,0.25)" }}>
            <Stethoscope size={30} color="#FFFFFF" />
          </div>

          <h2 className="m-0 text-[20px] font-bold leading-[1.3] max-w-[520px]" style={{ color: headingColor, fontFamily: "Poppins, sans-serif" }}>
            The specialists will consult you shortly
          </h2>

          <p className="m-0 mt-[10px] text-[13px] leading-[1.6] max-w-[460px]" style={{ color: mutedColor, fontFamily: "Poppins, sans-serif" }}>
            If you have not consulted a sleep specialist yet, please schedule it here.
          </p>

          <button
            type="button"
            onClick={() => openPrefilled(member ? toPrefill(member) : {})}
            className="mt-[24px] inline-flex items-center gap-[8px] px-[28px] py-[12px] rounded-xl border-none cursor-pointer text-white text-[14px] font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif", boxShadow: "0 6px 18px rgba(53,49,155,0.3)" }}
          >
            <Stethoscope size={16} />
            Schedule Consultation
          </button>
        </div>
      )}
    </DashboardShell>
  );
}
