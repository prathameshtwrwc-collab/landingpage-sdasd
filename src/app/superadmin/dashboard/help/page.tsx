"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { HelpCircle, Mail, Loader2 } from "lucide-react";
import SuccessModal from "@/components/dialogs/SuccessModal";

const SUPERADMIN_ISSUE_TYPES = [
  "Admin / Organisation Support",
  "End User Support",
  "Technical Issue",
  "Dashboard / Data Issue",
  "Payment / Subscription",
  "Other",
];

export default function SuperadminHelpPage() {
  const router = useRouter();
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [requestCallback, setRequestCallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      alert("Please select an issue type and describe your issue.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          issue_type: issueType,
          description,
          request_callback: requestCallback,
          raised_by_role: "superadmin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSuccessMessage("Your request has been received. Our team will get back to you within 48 working hours.");
      setSuccessOpen(true);
      setIssueType("");
      setDescription("");
      setRequestCallback(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Help & Support">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[16px] p-[24px] md:p-[32px] mb-[24px] text-center"
          style={{ background: "linear-gradient(135deg, #35319B 0%, #5A55C0 100%)", color: "#FFFFFF" }}>
          <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] mx-auto mb-[16px] rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <HelpCircle size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-[24px] md:text-[32px] font-bold mb-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Need More Help?
          </h1>
          <p className="text-[14px] md:text-[16px] opacity-90 max-w-[600px] mx-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
            We're here to help. If you're facing an issue or need assistance, simply request a call back and our team will get in touch with you.
          </p>
        </div>

        <div className="rounded-[16px] p-[20px] md:p-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h2 className="text-[18px] md:text-[20px] font-bold mb-[4px] flex items-center gap-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#171717" }}>
            <Mail size={22} style={{ color: "#35319B" }} />
            Need More Help?
          </h2>
          <p className="text-[13px] md:text-[14px] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", color: "#666", lineHeight: "1.6" }}>
            We're here to help. If you're facing an issue or need assistance, simply request a call back and our team will get in touch with you.
          </p>
          <p className="text-[13px] md:text-[14px] mb-[20px]" style={{ fontFamily: "Poppins, sans-serif", color: "#666", lineHeight: "1.6" }}>
            Our team will get back to you within 48 working hours.
          </p>

          <div className="rounded-[12px] p-[16px] md:p-[20px]" style={{ background: "#F7F7FA", border: "1px solid #EFEFF5" }}>
            <h3 className="text-[15px] md:text-[16px] font-semibold mb-[12px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#171717" }}>
              Submit a Support Request
            </h3>

            <div className="mb-[12px]">
              <label className="text-[12px] font-medium mb-[6px] block" style={{ fontFamily: "Poppins, sans-serif", color: "#555" }}>Issue Type</label>
              <div className="relative">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full rounded-[10px] border-none p-[12px] text-[13px] md:text-[14px] appearance-none"
                  style={{ fontFamily: "Poppins, sans-serif", background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#171717", outline: "none" }}
                >
                  <option value="">Select issue type</option>
                  {SUPERADMIN_ISSUE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-[12px]">
              <label className="text-[12px] font-medium mb-[6px] block" style={{ fontFamily: "Poppins, sans-serif", color: "#555" }}>Describe Your Issue</label>
              <textarea
                placeholder="Describe your issue (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-[10px] border-none p-[12px] text-[13px] md:text-[14px] resize-y"
                style={{ fontFamily: "Poppins, sans-serif", background: "#FFFFFF", border: "1px solid #E5E7EB", color: "#171717", outline: "none" }}
              />
            </div>

            <div className="flex items-center justify-between mt-[12px]">
              <p className="text-[11px] m-0" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
                Message to appear when someone clicks Help — Internal use only
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-[6px] px-[20px] py-[10px] rounded-[10px] border-none cursor-pointer text-[13px] md:text-[14px] font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#35319B", color: "#FFFFFF", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        open={successOpen}
        title="Success"
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />
    </DashboardShell>
  );
}
