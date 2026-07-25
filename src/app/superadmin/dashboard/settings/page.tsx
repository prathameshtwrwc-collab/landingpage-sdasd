"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Settings, Save, RotateCcw, Globe, Shield, FileText, Bell, Database, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

type SettingsData = {
  platform: { name: string; supportEmail: string; defaultOrgType: string; timezone: string; currency: string };
  scoring: { maxPossibleScore: number; owlMin: number; owlMax: number; eagleMin: number; eagleMax: number; larkMin: number; larkMax: number };
  assessment: { defaultQuestionsCount: number; requireEmail: boolean; allowAnonymous: boolean };
  notifications: { newOrgAlert: boolean; newMemberAlert: boolean; dailyDigest: boolean; adminEmail: string };
};

type Section = { key: keyof SettingsData; label: string; icon: React.ReactNode; desc: string };

const DEFAULTS: SettingsData = {
  platform: { name: "Chronotype", supportEmail: "support@chronotype.com", defaultOrgType: "Corporate", timezone: "UTC", currency: "USD" },
  scoring: { maxPossibleScore: 40, owlMin: 0, owlMax: 13, eagleMin: 14, eagleMax: 26, larkMin: 27, larkMax: 40 },
  assessment: { defaultQuestionsCount: 11, requireEmail: true, allowAnonymous: true },
  notifications: { newOrgAlert: true, newMemberAlert: true, dailyDigest: false, adminEmail: "" },
};

const SECTIONS: Section[] = [
  { key: "platform", label: "Platform", icon: <Globe size={18} />, desc: "General platform configuration" },
  { key: "scoring", label: "Scoring", icon: <Shield size={18} />, desc: "Chronotype scoring ranges and thresholds" },
  { key: "assessment", label: "Assessment", icon: <FileText size={18} />, desc: "Default assessment configuration" },
  { key: "notifications", label: "Notifications", icon: <Bell size={18} />, desc: "Alert and notification preferences" },
];

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dbMissing, setDbMissing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("platform");

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-settings");
      const d = await res.json();
      if (d.settings) { setSettings(d.settings); setDbMissing(!!d.dbMissing); }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSetting = <S extends keyof SettingsData>(section: S, field: keyof SettingsData[S], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const saveSection = async (section: keyof SettingsData) => {
    setSaving(true);
    try {
      await fetch("/api/admin-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: section, value: settings[section] }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setSaving(false); }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULTS);
  };

  const allSaved = async () => {
    setSaving(true);
    try {
      await Promise.all(
        (Object.keys(settings) as (keyof SettingsData)[]).map((key) =>
          fetch("/api/admin-settings", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: settings[key] }),
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {} finally { setSaving(false); }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-[60px]">
          <div className="w-[24px] h-[24px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Platform Settings">
      <div className="flex items-start justify-between flex-wrap gap-[12px] mb-[20px]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Settings</span>
          <h1 className="m-0 text-[18px] font-bold mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Platform Configuration</h1>
        </div>
        <div className="flex items-center gap-[8px]">
          <button type="button" onClick={resetToDefaults}
            className="flex items-center gap-[5px] text-[12px] font-semibold px-[14px] py-[8px] rounded-xl border-none cursor-pointer transition-colors"
            style={{ color: "#888", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}>
            <RotateCcw size={14} /> Reset All
          </button>
          <button type="button" onClick={allSaved} disabled={saving}
            className="flex items-center gap-[5px] text-[12px] font-semibold px-[16px] py-[8px] rounded-xl border-none cursor-pointer text-white transition-colors disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 12px rgba(53,49,155,0.2)", fontFamily: "Poppins, sans-serif" }}>
            <Save size={14} /> {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
          </button>
        </div>
      </div>

      {dbMissing && (
        <div className="mb-[16px] p-[14px] rounded-xl flex items-start gap-[10px]" style={{ background: "rgba(245,154,0,0.08)", border: "1px solid rgba(245,154,0,0.2)" }}>
          <AlertTriangle size={16} stroke="#F59A00" className="shrink-0 mt-[2px]" />
          <div>
            <p className="m-0 text-[12px] font-semibold" style={{ color: "#92400E", fontFamily: "Poppins, sans-serif" }}>Database table not found</p>
            <p className="m-0 mt-[4px] text-[12px]" style={{ color: "#92400E", fontFamily: "Poppins, sans-serif" }}>
              Run <code style={{ background: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: "4px" }}>supabase/migration_platform_settings.sql</code> in your Supabase SQL Editor to enable persistent storage. Settings are saved locally in the meantime.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[16px]">
        {/* ── Section Nav ── */}
        <div className="flex flex-col gap-[6px] lg:sticky lg:top-[88px] lg:self-start">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" onClick={() => setActiveSection(s.key)}
              className="w-full text-left flex items-center gap-[10px] px-[14px] py-[11px] rounded-xl border-none cursor-pointer transition-colors"
              style={{
                background: activeSection === s.key ? "rgba(53,49,155,0.08)" : "transparent",
                color: activeSection === s.key ? "#35319B" : "#555",
                fontFamily: "Poppins, sans-serif",
              }}>
              <span style={{ color: activeSection === s.key ? "#35319B" : "#AAA" }}>{s.icon}</span>
              <div>
                <p className="m-0 text-[13px] font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>{s.label}</p>
                <p className="m-0 text-[10px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{s.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Active Section Content ── */}
        <div className="lg:col-span-3">
          {activeSection === "platform" && (
            <SectionCard icon={<Globe size={20} />} title="Platform Settings" subtitle="General platform configuration" onSave={() => saveSection("platform")} saving={saving}>
              <Field label="Platform Name" value={settings.platform.name} onChange={(v) => updateSetting("platform", "name", v)} />
              <Field label="Support Email" value={settings.platform.supportEmail} onChange={(v) => updateSetting("platform", "supportEmail", v)} type="email" />
              <SelectField label="Default Organization Type" value={settings.platform.defaultOrgType} onChange={(v) => updateSetting("platform", "defaultOrgType", v)} options={["Corporate", "Healthcare", "Education", "NGO", "Government", "Other"]} />
              <SelectField label="Timezone" value={settings.platform.timezone} onChange={(v) => updateSetting("platform", "timezone", v)} options={["UTC", "US/Eastern", "US/Central", "US/Mountain", "US/Pacific", "Europe/London", "Europe/Paris", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Australia/Sydney"]} />
              <SelectField label="Currency" value={settings.platform.currency} onChange={(v) => updateSetting("platform", "currency", v)} options={["USD", "EUR", "GBP", "INR", "AED", "SGD", "AUD"]} />
            </SectionCard>
          )}

          {activeSection === "scoring" && (
            <SectionCard icon={<Shield size={20} />} title="Scoring Configuration" subtitle="Chronotype scoring ranges and maximum possible score" onSave={() => saveSection("scoring")} saving={saving}>
              <Field label="Max Possible Score" value={String(settings.scoring.maxPossibleScore)} onChange={(v) => updateSetting("scoring", "maxPossibleScore", Number(v))} type="number" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[8px]">
                <div className="p-[14px] rounded-xl" style={{ background: "rgba(244,181,77,0.06)" }}>
                  <p className="m-0 text-[11px] font-semibold uppercase mb-[8px]" style={{ color: "#f4b54d", fontFamily: "Poppins, sans-serif" }}>Lark</p>
                  <div className="flex items-center gap-[8px]">
                    <input type="number" value={settings.scoring.larkMin} onChange={(e) => updateSetting("scoring", "larkMin", Number(e.target.value))} className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} />
                    <span className="text-[11px]" style={{ color: "#AAA" }}>to</span>
                    <input type="number" value={settings.scoring.larkMax} onChange={(e) => updateSetting("scoring", "larkMax", Number(e.target.value))} className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} />
                  </div>
                </div>
                <div className="p-[14px] rounded-xl" style={{ background: "rgba(53,74,130,0.06)" }}>
                  <p className="m-0 text-[11px] font-semibold uppercase mb-[8px]" style={{ color: "#354a82", fontFamily: "Poppins, sans-serif" }}>Eagle</p>
                  <div className="flex items-center gap-[8px]">
                    <input type="number" value={settings.scoring.eagleMin} onChange={(e) => updateSetting("scoring", "eagleMin", Number(e.target.value))} className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} />
                    <span className="text-[11px]" style={{ color: "#AAA" }}>to</span>
                    <input type="number" value={settings.scoring.eagleMax} onChange={(e) => updateSetting("scoring", "eagleMax", Number(e.target.value))} className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} />
                  </div>
                </div>
                <div className="p-[14px] rounded-xl" style={{ background: "rgba(123,104,174,0.06)" }}>
                  <p className="m-0 text-[11px] font-semibold uppercase mb-[8px]" style={{ color: "#7B68AE", fontFamily: "Poppins, sans-serif" }}>Owl</p>
                  <div className="flex items-center gap-[8px]">
                    <input type="number" value={settings.scoring.owlMin} onChange={(e) => updateSetting("scoring", "owlMin", Number(e.target.value))} className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} />
                    <span className="text-[11px]" style={{ color: "#AAA" }}>to</span>
                    <input type="number" value={settings.scoring.owlMax} onChange={(e) => updateSetting("scoring", "owlMax", Number(e.target.value))} className="w-[60px] px-[8px] py-[6px] rounded-lg border text-[12px] text-center outline-none" style={{ borderColor: "#E0E0E0", fontFamily: "Poppins, sans-serif" }} />
                  </div>
                </div>
              </div>
              {/* Validation */}
              {(() => {
                const { larkMin, larkMax, eagleMin, eagleMax, owlMin, owlMax, maxPossibleScore } = settings.scoring;
                const issues: string[] = [];
                const sorted = [
                  { name: "Owl", min: owlMin, max: owlMax },
                  { name: "Eagle", min: eagleMin, max: eagleMax },
                  { name: "Lark", min: larkMin, max: larkMax },
                ].sort((a, b) => a.min - b.min);
                if (sorted[0]?.min !== 0) issues.push("Score ranges must start at 0");
                for (let i = 0; i < sorted.length - 1; i++) {
                  if (sorted[i].max >= sorted[i + 1].min) issues.push(`${sorted[i].name} and ${sorted[i + 1].name} ranges overlap`);
                }
                if ((sorted[sorted.length - 1]?.max ?? 0) < maxPossibleScore) issues.push(`Max score ${maxPossibleScore} not covered by ranges`);
                if (issues.length === 0) issues.push("Valid");
                return (
                  <div className="mt-[12px] p-[10px] rounded-lg flex items-center gap-[8px]" style={{ background: issues[0] === "Valid" ? "rgba(46,125,50,0.06)" : "rgba(211,47,47,0.06)" }}>
                    {issues[0] === "Valid" ? <CheckCircle size={14} stroke="#2E7D32" /> : <AlertTriangle size={14} stroke="#D32F2F" />}
                    <span className="text-[12px]" style={{ color: issues[0] === "Valid" ? "#2E7D32" : "#C62828", fontFamily: "Poppins, sans-serif" }}>
                      {issues[0] === "Valid" ? "All scoring ranges valid" : issues.join("; ")}
                    </span>
                  </div>
                );
              })()}
            </SectionCard>
          )}

          {activeSection === "assessment" && (
            <SectionCard icon={<FileText size={20} />} title="Assessment Defaults" subtitle="Default configuration for new assessments" onSave={() => saveSection("assessment")} saving={saving}>
              <Field label="Default Questions Count" value={String(settings.assessment.defaultQuestionsCount)} onChange={(v) => updateSetting("assessment", "defaultQuestionsCount", Number(v))} type="number" />
              <ToggleField label="Require Email" description="Require email address for assessment access" checked={settings.assessment.requireEmail} onChange={(v) => updateSetting("assessment", "requireEmail", v)} />
              <ToggleField label="Allow Anonymous" description="Allow anonymous assessment without login" checked={settings.assessment.allowAnonymous} onChange={(v) => updateSetting("assessment", "allowAnonymous", v)} />
            </SectionCard>
          )}

          {activeSection === "notifications" && (
            <SectionCard icon={<Bell size={20} />} title="Notification Preferences" subtitle="Configure platform alerts and digests" onSave={() => saveSection("notifications")} saving={saving}>
              <ToggleField label="New Organization Alert" description="Notify when a new organization registers" checked={settings.notifications.newOrgAlert} onChange={(v) => updateSetting("notifications", "newOrgAlert", v)} />
              <ToggleField label="New Member Alert" description="Notify when a new member joins any organization" checked={settings.notifications.newMemberAlert} onChange={(v) => updateSetting("notifications", "newMemberAlert", v)} />
              <ToggleField label="Daily Digest" description="Send a daily summary of platform activity" checked={settings.notifications.dailyDigest} onChange={(v) => updateSetting("notifications", "dailyDigest", v)} />
              <Field label="Admin Email" value={settings.notifications.adminEmail} onChange={(v) => updateSetting("notifications", "adminEmail", v)} type="email" placeholder="admin@example.com" />
            </SectionCard>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

/* ── Shared components ── */

function SectionCard({ icon, title, subtitle, children, onSave, saving }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode; onSave: () => void; saving: boolean }) {
  return (
    <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
            <span style={{ color: "#35319B", lineHeight: 0 }}>{icon}</span>
          </div>
          <div>
            <h3 className="m-0 text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{title}</h3>
            <p className="m-0 text-[11px] mt-[1px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{subtitle}</p>
          </div>
        </div>
        <button type="button" onClick={onSave} disabled={saving}
          className="flex items-center gap-[5px] text-[12px] font-semibold px-[14px] py-[7px] rounded-xl border-none cursor-pointer text-white transition-colors disabled:opacity-60"
          style={{ background: "#35319B", fontFamily: "Poppins, sans-serif" }}>
          <Save size={13} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="flex flex-col gap-[14px]">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] mb-[4px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-[12px] py-[9px] text-[13px] rounded-lg outline-none" style={{ border: "1.5px solid #E0E0E0", fontFamily: "Poppins, sans-serif", background: "#FFF" }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] mb-[4px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-[12px] py-[9px] text-[13px] rounded-lg outline-none cursor-pointer" style={{ border: "1.5px solid #E0E0E0", fontFamily: "Poppins, sans-serif", background: "#FFF" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ToggleField({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-[6px]">
      <div>
        <p className="m-0 text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{label}</p>
        <p className="m-0 text-[11px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{description}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className="relative w-[44px] h-[24px] rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0"
        style={{ background: checked ? "#35319B" : "#D5D5D5" }}>
        <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200"
          style={{ left: checked ? "23px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}
