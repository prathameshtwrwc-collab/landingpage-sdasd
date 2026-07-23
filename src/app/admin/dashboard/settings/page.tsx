"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [name, setName] = useState("My Organization");
  const [type, setType] = useState("Corporate");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardShell title="Organization Settings">
      <div className="rounded-[16px] p-[20px] md:p-[28px] max-w-[600px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col gap-[16px]">
          {[
            { label: "Organization Name", value: name, onChange: setName, type: "text" },
            { label: "Organization Type", value: type, onChange: setType, type: "select", options: ["Corporate", "Healthcare", "Education", "NGO", "Other"] },
            { label: "Contact Email", value: email, onChange: setEmail, type: "email" },
            { label: "Country", value: country, onChange: setCountry, type: "text" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-[12px] font-semibold mb-[5px] uppercase tracking-[0.04em]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>{f.label}</label>
              {f.type === "select" ? (
                <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}>
                  {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                  className="w-full px-[13px] py-[10px] text-[14px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#35319B"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; }}
                />
              )}
            </div>
          ))}
        </div>

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
