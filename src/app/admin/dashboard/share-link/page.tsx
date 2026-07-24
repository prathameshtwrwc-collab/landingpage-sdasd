"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Link2, Copy, Check, ExternalLink } from "lucide-react";

export default function ShareLinkPage() {
  const [linkData, setLinkData] = useState<{ code: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin-portal").then((r) => r.json()).then((d) => {
        const s = d.stats ?? {};
        if (s.orgUniqueCode) {
          setLinkData({ code: s.orgUniqueCode, status: s.orgLinkStatus ?? "none" });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const domain = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = linkData ? `${domain}/${linkData.code}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell title="Share Link">
      {loading ? (
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

              <div className="flex items-center gap-[12px]">
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
    </DashboardShell>
  );
}
