"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Settings, Save, RotateCcw } from "lucide-react";

const STORAGE_KEY = "superadmin_settings";
const DEFAULTS = {
  platformName: "Chronotype",
  supportEmail: "support@chronotype.com",
  defaultOrgType: "Corporate",
};

export default function SuperAdminSettingsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setForm({ ...DEFAULTS, ...JSON.parse(stored) });
    } catch {}
    setLoaded(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      await new Promise((r) => setTimeout(r, 400));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const handleReset = () => {
    setForm(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!loaded) return null;

  return (
    <DashboardShell title="Platform Settings">
      <div className="rounded-[16px] p-[20px] md:p-[28px] max-w-[600px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col gap-[16px]">
          {[
            { label: "Platform Name", key: "platformName" as const, value: form.platformName },
            { label: "Support Email", key: "supportEmail" as const, value: form.supportEmail },
            { label: "Default Organization Type", key: "defaultOrgType" as const, value: form.defaultOrgType, options: ["Corporate", "Healthcare", "Education", "NGO", "Other"] },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-[12px] font-semibold mb-[5px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{f.label}</label>
              {f.options ? (
                <select value={f.value} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type="text" value={f.value} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }} />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[12px] mt-[20px]">
          <button type="button" onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-[8px] text-white text-[14px] font-semibold px-[24px] py-[12px] border-none cursor-pointer rounded-xl transition-all disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 4px 16px rgba(211,47,47,0.25)", fontFamily: "Poppins, sans-serif" }}
          >
            <Save size={16} stroke="white" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
          <button type="button" onClick={handleReset}
            className="inline-flex items-center gap-[6px] text-[13px] font-medium px-[16px] py-[10px] border-none cursor-pointer rounded-xl transition-all"
            style={{ color: "#888", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}
          >
            <RotateCcw size={14} /> Reset to Defaults
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
