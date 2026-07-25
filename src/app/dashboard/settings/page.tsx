"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Settings, Bell, Shield, User, Moon, Copy, Check, Share2 } from "lucide-react";

type Prefs = {
  emailNotifications: boolean;
  darkMode: boolean;
  weeklyTips: boolean;
  goalReminders: boolean;
};

const STORAGE_KEY = "chronotype_preferences";

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return { emailNotifications: true, darkMode: false, weeklyTips: true, goalReminders: true };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...{ emailNotifications: true, darkMode: false, weeklyTips: true, goalReminders: true }, ...JSON.parse(stored) };
  } catch {}
  return { emailNotifications: true, darkMode: false, weeklyTips: true, goalReminders: true };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [refCopied, setRefCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Apply dark mode on load and on toggle
  useEffect(() => {
    if (prefs.darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [prefs.darkMode]);

  // Also apply on initial mount from stored prefs
  useEffect(() => {
    const stored = loadPrefs();
    if (stored.darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const updatePref = (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const member = data?.member as Record<string, unknown> | undefined;
  const referralCode = member?.referral_code as string | null | undefined;

  return (
    <DashboardShell>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
          <Settings size={18} stroke="#35319B" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Settings</span>
          <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Account Settings</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">
          <p className="text-[14px] text-[#888]" style={{ fontFamily: "Poppins, sans-serif" }}>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          {/* ─── Profile ─── */}
          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              <User size={16} stroke="#35319B" /> Profile
            </h3>
            <div className="flex flex-col gap-[10px]">
              <div className="p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Name</p>
                <p className="m-0 text-[14px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                  {member ? `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() || "—" : "—"}
                </p>
              </div>
              <div className="p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Email</p>
                <p className="m-0 text-[14px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{user?.email ?? "—"}</p>
              </div>
              <div className="p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Role</p>
                <p className="m-0 text-[14px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{user?.role ?? (referralCode ? "Member" : "—")}</p>
              </div>
            </div>
          </div>

          {/* ─── Referral Link ─── */}
          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              <Share2 size={16} stroke="#F59A00" /> Referral Link
            </h3>
            {referralCode ? (
              <div>
                <p className="m-0 text-[12px] leading-[1.4] mb-[10px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                  Share this link with friends so they can discover their chronotype.
                </p>
                <code className="block w-full px-[12px] py-[10px] text-[13px] font-mono font-semibold rounded-lg truncate mb-[10px]" style={{ background: "#F5F5F5", color: "#35319B" }}>
                  {typeof window !== "undefined" ? window.location.origin + "/?ref=" + referralCode : referralCode}
                </code>
                <div className="flex gap-[8px]">
                  <button type="button" onClick={() => { navigator.clipboard.writeText((typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + referralCode); setRefCopied(true); setTimeout(() => setRefCopied(false), 2000); }}
                    className="flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[8px] rounded-lg border-none cursor-pointer transition-colors"
                    style={{ color: refCopied ? "#2E7D32" : "#35319B", background: refCopied ? "rgba(46,125,50,0.1)" : "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                    {refCopied ? <Check size={14} /> : <Copy size={14} />} {refCopied ? "Copied!" : "Copy"}
                  </button>
                  <button type="button" onClick={async () => {
                    const url = (typeof window !== "undefined" ? window.location.origin + "/?ref=" : "") + referralCode;
                    if (typeof navigator !== "undefined" && navigator.share) {
                      try { await navigator.share({ title: "Discover Your Chronotype", url }); return; } catch {}
                    }
                    await navigator.clipboard.writeText(url);
                    setRefCopied(true);
                    setTimeout(() => setRefCopied(false), 2000);
                  }}
                    className="flex items-center gap-[6px] text-[12px] font-semibold px-[14px] py-[8px] rounded-lg border-none cursor-pointer transition-colors"
                    style={{ color: "#35319B", background: "rgba(53,49,155,0.06)", fontFamily: "Poppins, sans-serif" }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            ) : (
              <p className="m-0 text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Complete an assessment to get your referral link.</p>
            )}
          </div>

          {/* ─── Preferences ─── */}
          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              <Bell size={16} stroke="#35319B" /> Preferences
            </h3>
            <div className="flex flex-col gap-[4px]">
              <ToggleRow label="Email Notifications" description="Receive assessment reminders and tips" checked={prefs.emailNotifications} onChange={(v) => updatePref("emailNotifications", v)} />
              <ToggleRow label="Weekly Tips" description="Get sleep tips delivered to your inbox" checked={prefs.weeklyTips} onChange={(v) => updatePref("weeklyTips", v)} />
              <ToggleRow label="Goal Reminders" description="Stay on track with your sleep goals" checked={prefs.goalReminders} onChange={(v) => updatePref("goalReminders", v)} />
              <ToggleRow label="Dark Mode" description="Use dark theme in the dashboard" checked={prefs.darkMode} onChange={(v) => updatePref("darkMode", v)} />
            </div>
            {saved && <p className="m-0 mt-[10px] text-[11px] text-[#2E7D32]" style={{ fontFamily: "Poppins, sans-serif" }}>Preferences saved</p>}
          </div>

          {/* ─── Account Info ─── */}
          <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              <Shield size={16} stroke="#35319B" /> Account Info
            </h3>
            <div className="flex flex-col gap-[10px]">
              <div className="p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Member ID</p>
                <p className="m-0 text-[13px] font-mono" style={{ color: "#555", fontFamily: "monospace" }}>{member?.id ? String(member.id).slice(0, 12) + "..." : "—"}</p>
              </div>
              <div className="p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Joined</p>
                <p className="m-0 text-[13px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                  {member?.created_at ? new Date(member.created_at as string).toLocaleDateString() : "—"}
                </p>
              </div>
              <div className="p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Assessments Completed</p>
                <p className="m-0 text-[13px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                  {data?.assessments ? (data.assessments as Record<string, unknown>[]).filter((a) => a.status === "COMPLETED").length : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-[8px]">
      <div>
        <p className="m-0 text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{label}</p>
        <p className="m-0 text-[11px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{description}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className="relative w-[44px] h-[24px] rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0"
        style={{ background: checked ? "#35319B" : "#D5D5D5" }}
      >
        <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200"
          style={{ left: checked ? "23px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
        />
      </button>
    </div>
  );
}
