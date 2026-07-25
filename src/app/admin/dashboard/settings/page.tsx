"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Settings, Save, Upload, Link } from "lucide-react";

interface OrgSettings {
  id: string;
  name: string;
  type: string;
  email: string;
  country: string;
  status: string;
  brandingLogo: string;
  brandingCompany: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin?action=org-settings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load settings");
        return r.json();
      })
      .then(setSettings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin?action=update_org_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settings.name,
          type: settings.type,
          email: settings.email,
          country: settings.country,
          brandingLogo: settings.brandingLogo,
          brandingCompany: settings.brandingCompany,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Organization Settings">
        <div className="flex items-center justify-center py-[60px]">
          <p className="text-[14px] text-[#888]">Loading...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!settings) {
    return (
      <DashboardShell title="Organization Settings">
        <div className="p-[20px] rounded-[16px]" style={{ background: "#FEE2E2" }}>
          <p className="text-[14px] text-[#DC2626]">Error: {error || "Failed to load organization settings"}</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Organization Settings">
      <div className="rounded-[16px] p-[20px] md:p-[28px] max-w-[600px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col gap-[16px]">
          {[
            { label: "Organization Name", key: "name", value: settings.name, type: "text" },
            { label: "Organization Type", key: "type", value: settings.type, type: "select", options: ["Corporate", "Healthcare", "Education", "NGO", "Other"] },
            { label: "Contact Email", key: "email", value: settings.email, type: "email" },
            { label: "Country", key: "country", value: settings.country, type: "text" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-[12px] font-semibold mb-[5px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{f.label}</label>
              {f.type === "select" ? (
                <select value={f.value} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}>
                  {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} value={f.value} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#35319B"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; }}
                />
              )}
            </div>
          ))}

          {/* Branding Section */}
          <div className="pt-[16px] mt-[8px]" style={{ borderTop: "1px solid #F0F0F0" }}>
            <p className="m-0 mb-[12px] text-[13px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#35319B" }}>Branding</p>
            <div className="flex flex-col gap-[12px]">
              <div>
                <label className="block text-[12px] font-semibold mb-[5px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Logo URL</label>
                <div className="flex items-center gap-[8px]">
                  {settings.brandingLogo ? (
                    <img src={settings.brandingLogo} alt="Logo preview" style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "32px", height: "32px", borderRadius: "4px", background: "#E5E7EB" }} />
                  )}
                  <input type="text" value={settings.brandingLogo} onChange={(e) => setSettings({ ...settings, brandingLogo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#35319B"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-[5px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Company Name (for branding)</label>
                <input type="text" value={settings.brandingCompany} onChange={(e) => setSettings({ ...settings, brandingCompany: e.target.value })}
                  placeholder="Your Company Name"
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#35319B"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; }}
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="m-0 mt-[12px] text-[13px] text-[#DC2626]">{error}</p>
        )}

        <button type="button" onClick={handleSave} disabled={saving}
          className="mt-[20px] inline-flex items-center gap-[8px] text-white text-[14px] font-semibold px-[24px] py-[12px] border-none cursor-pointer rounded-xl transition-all disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 16px rgba(53,49,155,0.25)", fontFamily: "Poppins, sans-serif" }}
        >
          <Save size={16} stroke="white" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </DashboardShell>
  );
}
