"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import SuccessModal from "@/components/dialogs/SuccessModal";
import { useAuth } from "@/components/auth/AuthProvider";

const MEMBER_ISSUE_TYPES = [
  "Assessment Issue",
  "Technical Issue",
  "Result / Report Issue",
  "Other",
];

export default function HelpPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [requestCallback, setRequestCallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("chronotype_member_id");
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    if (!issueType) {
      alert("Please select an issue type.");
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
          raised_by_role: "member",
          member_id: memberId,
          email: user?.email,
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

  const faqs = [
    {
      question: "How do I take the sleep assessment?",
      answer: "Go to the Chronotype section from the sidebar and click &apos;Start Assessment&apos;. Answer all questions honestly for the most accurate results. The assessment takes about 10-15 minutes to complete.",
    },
    {
      question: "What is a chronotype?",
      answer: "Your chronotype is your natural sleep-wake preference. It determines whether you&apos;re a morning person (Lark), night owl (Owl), or somewhere in between (Eagle). Understanding your chronotype helps optimize your daily schedule.",
    },
    {
      question: "How often should I update my profile?",
      answer: "Update your profile whenever your sleep patterns change significantly, or at least once every 3 months to keep your recommendations accurate and relevant.",
    },
    {
      question: "Can I download my sleep reports?",
      answer: "Yes! Navigate to the Progress section and click the download button to get a detailed PDF report of your sleep patterns and recommendations.",
    },
    {
      question: "How do I change my notification settings?",
      answer: "Go to Settings from the sidebar and toggle your notification preferences. You can enable or disable email notifications, weekly tips, and goal reminders.",
    },
    {
      question: "Is my sleep data secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your personal health data. Your information is never shared with third parties without your explicit consent.",
    },
  ];

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
            We&apos;re here to help. If you&apos;re facing an issue or need assistance, simply request a call back and our team will get in touch with you.
          </p>
        </div>

        <div className="rounded-[16px] p-[20px] md:p-[24px] mb-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h2 className="text-[18px] md:text-[20px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#171717" }}>
            <MessageCircle size={22} style={{ color: "#35319B" }} />
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-[8px]">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-[12px] overflow-hidden" style={{ border: "1px solid #EFEFF5" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-[14px] md:p-[16px] bg-transparent border-none cursor-pointer text-left"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <span className="text-[13px] md:text-[14px] font-semibold pr-[12px]" style={{ color: "#171717", fontWeight: 600 }}>
                    {faq.question}
                  </span>
                  <span className="shrink-0" style={{ color: "#35319B" }}>
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-[14px] md:px-[16px] pb-[14px] md:pb-[16px]">
                    <p className="text-[12px] md:text-[13px] leading-[1.6]" style={{ fontFamily: "Poppins, sans-serif", color: "#555" }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[16px] p-[20px] md:p-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h2 className="text-[18px] md:text-[20px] font-bold mb-[4px] flex items-center gap-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#171717" }}>
            <HelpCircle size={22} style={{ color: "#35319B" }} />
            Need More Help?
          </h2>
          <p className="text-[13px] md:text-[14px] mb-[4px]" style={{ fontFamily: "Poppins, sans-serif", color: "#666", lineHeight: "1.6" }}>
            We&apos;re here to help. If you&apos;re facing an issue or need assistance, simply request a call back and our team will get in touch with you.
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
                  {MEMBER_ISSUE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none" }} />
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

            <div className="flex items-center gap-[8px] mb-[12px]">
              <input
                type="checkbox"
                id="request-callback"
                checked={requestCallback}
                onChange={(e) => setRequestCallback(e.target.checked)}
                className="w-[16px] h-[16px] rounded-[4px] cursor-pointer"
                style={{ accentColor: "#35319B" }}
              />
              <label htmlFor="request-callback" className="text-[13px] cursor-pointer" style={{ fontFamily: "Poppins, sans-serif", color: "#555" }}>
                Request a callback
              </label>
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
