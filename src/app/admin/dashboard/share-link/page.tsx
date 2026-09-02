"use client";

import { useEffect, useState } from "react";
import { cachedFetch } from "@/lib/client-cache";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Link2, Copy, Check, Share2, Save } from "lucide-react";

export default function ShareLinkPage() {
  const router = useRouter();
  const [linkData, setLinkData] = useState<{ code: string; status: string } | null>(null);
  const [shareMessageTemplate, setShareMessageTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    cachedFetch("/api/admin-portal").then((d: any) => {
      const s = d.stats ?? {};
      if (s.orgUniqueCode) {
        setLinkData({ code: s.orgUniqueCode, status: s.orgLinkStatus ?? "none" });
      }
      if (s.shareMessageTemplate) {
        setShareMessageTemplate(s.shareMessageTemplate);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const domain = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = linkData ? `${domain}/${linkData.code}` : "";

  const getShareText = () => {
    const defaultMsg = "Check out this sleep chronotype assessment:";
    const msg = shareMessageTemplate.trim() || defaultMsg;
    return `${msg}\n${fullUrl}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSystemShare = async () => {
    const text = getShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Sleep Chronotype Assessment", text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveTemplate = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/admin-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_share_template", template: shareMessageTemplate }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSaveMsg(data.error || "Failed to save");
      } else {
        setSaveMsg("Saved!");
      }
    } catch {
      setSaveMsg("Failed to save");
    }
    setSaving(false);
  };

  return (
    <DashboardShell title="Share Link"><>
      <button type="button" onClick={() => router.push("/admin/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>{loading ? (
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      ) : (
        <div className="max-w-[640px]">
          {linkData ? (
            <div className="p-[24px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-[10px] mb-[20px]">
                <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
                  <Link2 size={18} stroke="#35319B" />
                </div>
                <div>
                  <h3 className="m-0 text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Shareable Organization Link</h3>
                  <p className="m-0 text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>
                    Share this link with participants to join your organization
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[10px] p-[16px] rounded-xl mb-[12px]" style={{ background: "rgba(53,49,155,0.04)", border: "1.5px solid rgba(53,49,155,0.12)" }}>
                <code className="flex-1 text-[14px] font-mono font-semibold break-all" style={{ color: "#35319B" }}>{fullUrl}</code>
                <button type="button" onClick={handleCopy}
                  className="flex items-center justify-center w-[38px] h-[38px] rounded-lg border-none cursor-pointer transition-all shrink-0"
                  style={{ background: copied ? "rgba(46,125,50,0.1)" : "rgba(53,49,155,0.08)" }}>
                  {copied ? <Check size={16} stroke="#2E7D32" /> : <Copy size={16} stroke="#35319B" />}
                </button>
              </div>
              {copied && <p className="m-0 text-[12px] font-medium mb-[12px]" style={{ color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>Copied to clipboard!</p>}

              <div className="flex items-center gap-[12px] mb-[20px]">
                <span className="text-[11px] font-semibold px-[10px] py-[4px] rounded-full" style={{
                  background: linkData.status === "active" ? "rgba(46,125,50,0.1)" : "rgba(211,47,47,0.1)",
                  color: linkData.status === "active" ? "#2E7D32" : "#D32F2F",
                  fontFamily: "Poppins, sans-serif",
                }}>
                  {linkData.status === "active" ? "Active" : "Paused"}
                </span>
                <span className="text-[11px] font-medium" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                  Code: <strong style={{ color: "#555" }}>{linkData.code}</strong>
                </span>
              </div>

              <div className="mb-[20px]">
                <label className="block text-[12px] font-semibold uppercase tracking-[0.04em] mb-[6px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                  Share Message Template
                </label>
                <textarea
                  value={shareMessageTemplate}
                  onChange={(e) => setShareMessageTemplate(e.target.value)}
                  placeholder={`Hello! Please take our sleep chronotype assessment here:`}
                  rows={3}
                  className="w-full p-[12px] text-[14px] rounded-xl border-none outline-none transition-all"
                  style={{ fontFamily: "Poppins, sans-serif", border: "1.5px solid #D5D5D5", resize: "vertical" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#35319B"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(53,49,155,0.08)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <p className="m-0 text-[11px] mt-[4px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                  Leave blank for default message. The link will be appended automatically.
                </p>
              </div>

              <div className="p-[16px] rounded-xl mb-[16px]" style={{ background: "#F8F9FF", border: "1.5px solid rgba(53,49,155,0.12)" }}>
                <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.04em] mb-[8px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Preview</p>
                <p className="m-0 text-[13px] whitespace-pre-wrap" style={{ color: "#333", fontFamily: "Poppins, sans-serif", lineHeight: 1.6 }}>
                  {getShareText()}
                </p>
              </div>

              <div className="flex items-center gap-[10px] mb-[16px]">
                <button type="button" onClick={handleSystemShare}
                  className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-lg border-none cursor-pointer transition-all text-[13px] font-semibold"
                  style={{ background: "#35319B", color: "#FFF", fontFamily: "Poppins, sans-serif" }}>
                  <Share2 size={14} /> Share
                </button>
                <button type="button" onClick={handleCopy}
                  className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-lg border-none cursor-pointer transition-all text-[13px] font-semibold"
                  style={{ background: "#F5F5F5", color: "#333", fontFamily: "Poppins, sans-serif", border: "1px solid #E0E0E0" }}>
                  <Copy size={14} /> Copy
                </button>
              </div>

              <button type="button" onClick={handleSaveTemplate} disabled={saving}
                className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-lg border-none cursor-pointer transition-all text-[13px] font-semibold"
                style={{ background: saving ? "#AAA" : "#35319B", color: "#FFF", fontFamily: "Poppins, sans-serif" }}>
                <Save size={14} /> {saving ? "Saving..." : "Save Template"}
              </button>
              {saveMsg && <span className="ml-[10px] text-[13px] font-medium" style={{ color: saveMsg === "Saved!" ? "#2E7D32" : "#D32F2F", fontFamily: "Poppins, sans-serif" }}>{saveMsg}</span>}
            </div>
          ) : (
            <div className="p-[24px] rounded-[16px] text-center" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <Link2 size={40} stroke="#CCC" strokeWidth={1.5} />
              <p className="m-0 mt-[12px] text-[13px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                No organization link created yet. Ask your super admin to generate one.
              </p>
            </div>
          )}
        </div>
      )}
      </></DashboardShell>
  );
}