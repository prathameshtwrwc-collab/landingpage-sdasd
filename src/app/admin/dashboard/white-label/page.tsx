"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Save, X, AlertTriangle, CheckCircle, ImageIcon } from "lucide-react";

export default function WhiteLabelPage() {
  const { user, isLoading } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dbMissing, setDbMissing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/org-branding")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) { setCompanyName(d.companyName || ""); setLogoUrl(d.logoUrl || ""); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveBranding = async () => {
    setSaving(true);
    setError("");
    setDbMissing(false);
    try {
      const res = await fetch("/api/org-branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, logoUrl }),
      });
      const d = await res.json();
      if (d.dbMissing) { setDbMissing(true); }
      else if (d.error) { setError(d.error); }
      else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } catch { setError("Failed to save"); }
    setSaving(false);
  };

  const imageError = logoUrl && !logoUrl.match(/^(https?:\/\/)/i);

  return (
    <DashboardShell>
      <div className="mb-[20px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>White Label</span>
        <h1 className="m-0 text-[18px] font-bold mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
          Brand Your Organisation
        </h1>
        <p className="m-0 text-[13px] mt-[4px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
          Customise how your organisation appears to members on shared assessment links.
        </p>
      </div>

      {dbMissing && (
        <div className="mb-[16px] p-[14px] rounded-xl flex items-start gap-[10px]" style={{ background: "rgba(245,154,0,0.08)", border: "1px solid rgba(245,154,0,0.2)" }}>
          <AlertTriangle size={16} stroke="#F59A00" className="shrink-0 mt-[2px]" />
          <p className="m-0 text-[12px]" style={{ color: "#92400E", fontFamily: "Poppins, sans-serif" }}>
            Run <code style={{ background: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: "4px" }}>supabase/migration_branding.sql</code> in Supabase SQL Editor to enable branding persistence.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-[60px]"><div className="w-[24px] h-[24px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">

          {/* ── Settings ── */}
          <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
            <div className="mb-[20px]">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] mb-[4px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Brand / Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your organisation name"
                className="w-full px-[12px] py-[9px] text-[13px] rounded-lg outline-none" style={{ border: "1.5px solid #E0E0E0", fontFamily: "Poppins, sans-serif" }} />
            </div>

            <div className="mb-[20px]">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] mb-[4px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Logo URL</label>
              <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png"
                className="w-full px-[12px] py-[9px] text-[13px] rounded-lg outline-none" style={{ border: "1.5px solid #E0E0E0", fontFamily: "Poppins, sans-serif" }} />
              <p className="m-0 mt-[4px] text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                Paste a public URL to your logo image (PNG, SVG, or JPG).
              </p>
              {imageError && (
                <p className="m-0 mt-[4px] text-[11px]" style={{ color: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>
                  URL must start with https://
                </p>
              )}
            </div>

            {error && (
              <p className="m-0 mb-[12px] text-[12px]" style={{ color: "#D32F2F", fontFamily: "Poppins, sans-serif" }}>{error}</p>
            )}

            <div className="flex items-center gap-[10px]">
              <button type="button" onClick={saveBranding} disabled={saving || !companyName.trim()}
                className="flex items-center gap-[6px] text-white text-[13px] font-semibold px-[20px] py-[10px] border-none cursor-pointer rounded-xl transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 12px rgba(53,49,155,0.2)", fontFamily: "Poppins, sans-serif" }}>
                <Save size={15} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </button>
              <button type="button" onClick={() => { setCompanyName(""); setLogoUrl(""); }}
                className="flex items-center gap-[5px] text-[13px] font-medium px-[16px] py-[9px] rounded-xl border-none cursor-pointer transition-all"
                style={{ color: "#888", background: "#F5F5F5", fontFamily: "Poppins, sans-serif" }}>
                <X size={14} /> Cancel
              </button>
            </div>
          </div>

          {/* ── Preview Card ── */}
          <div className="rounded-[16px] p-[22px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[4px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Preview</h3>
            <p className="m-0 text-[11px] mb-[16px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
              Shown on shared assessment links
            </p>

            <div className="rounded-xl p-[20px] text-center" style={{ border: "1.5px solid #E0E0E0", background: "#FAFBFF" }}>
              {/* Logo */}
              {logoUrl ? (
                <div className="w-[80px] h-[80px] mx-auto mb-[12px] rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "#F5F5F5" }}>
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = "?"; }} />
                </div>
              ) : (
                <div className="w-[80px] h-[80px] mx-auto mb-[12px] rounded-xl flex items-center justify-center" style={{ background: "#F5F5F5" }}>
                  <ImageIcon size={28} stroke="#CCC" />
                </div>
              )}
              {/* Name */}
              <p className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                {companyName || "Your Organisation Name"}
              </p>
              <p className="m-0 mt-[4px] text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                Assessment by {companyName || "Your Organisation"}
              </p>
              <div className="mt-[14px] px-[20px] py-[10px] rounded-lg text-[12px]" style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", color: "#888" }}>
                <p className="m-0 font-semibold" style={{ color: "#35319B", fontFamily: "Poppins, sans-serif" }}>Sleep Chronotype Assessment</p>
                <p className="m-0 mt-[4px] text-[11px]">Discover your sleep-wake rhythm</p>
                <button type="button" className="mt-[10px] w-full text-white text-[13px] font-semibold py-[10px] border-none rounded-xl" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
