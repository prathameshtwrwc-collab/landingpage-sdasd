"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { HelpCircle, MessageCircle, Mail, Phone, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";

const faqs = [
  {
    question: "How do I take the sleep assessment?",
    answer: "Go to the Chronotype section from the sidebar and click 'Start Assessment'. Answer all questions honestly for the most accurate results. The assessment takes about 10-15 minutes to complete.",
  },
  {
    question: "What is a chronotype?",
    answer: "Your chronotype is your natural sleep-wake preference. It determines whether you're a morning person (Lark), night owl (Owl), or somewhere in between (Eagle). Understanding your chronotype helps optimize your daily schedule.",
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

export default function HelpPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const supportEmail = "support@chronotype.com";
  const supportPhone = "+1 (555) 123-4567";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell title="Help & Support">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="rounded-[16px] p-[24px] md:p-[32px] mb-[24px] text-center"
          style={{ background: "linear-gradient(135deg, #35319B 0%, #5A55C0 100%)", color: "#FFFFFF" }}>
          <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] mx-auto mb-[16px] rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <HelpCircle size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-[24px] md:text-[32px] font-bold mb-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            How can we help you?
          </h1>
          <p className="text-[14px] md:text-[16px] opacity-90 max-w-[600px] mx-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
            Find answers to common questions or reach out to our support team for personalized assistance.
          </p>
        </div>

        {/* FAQ Section */}
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

        {/* Contact Support */}
        <div className="rounded-[16px] p-[20px] md:p-[24px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h2 className="text-[18px] md:text-[20px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#171717" }}>
            <Mail size={22} style={{ color: "#35319B" }} />
            Need More Help?
          </h2>
          <p className="text-[13px] md:text-[14px] mb-[20px]" style={{ fontFamily: "Poppins, sans-serif", color: "#666", lineHeight: "1.6" }}>
            Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div className="flex items-center gap-[12px] p-[16px] rounded-[12px]" style={{ background: "#F7F7FA", border: "1px solid #EFEFF5" }}>
              <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(53,49,155,0.08)", color: "#35319B" }}>
                <Mail size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium mb-[2px]" style={{ fontFamily: "Poppins, sans-serif", color: "#888" }}>Email Support</p>
                <p className="text-[13px] md:text-[14px] font-semibold truncate" style={{ fontFamily: "Poppins, sans-serif", color: "#171717" }}>{supportEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-[12px] p-[16px] rounded-[12px]" style={{ background: "#F7F7FA", border: "1px solid #EFEFF5" }}>
              <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(53,49,155,0.08)", color: "#35319B" }}>
                <Phone size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium mb-[2px]" style={{ fontFamily: "Poppins, sans-serif", color: "#888" }}>Phone Support</p>
                <p className="text-[13px] md:text-[14px] font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: "#171717" }}>{supportPhone}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-[12px] mt-[20px]">
            <button
              onClick={copyEmail}
              className="flex items-center justify-center gap-[8px] px-[20px] py-[12px] rounded-[10px] border-none cursor-pointer text-[13px] md:text-[14px] font-semibold transition-all"
              style={{ background: "#35319B", color: "#FFFFFF", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Email</>}
            </button>
            <a
              href={`mailto:${supportEmail}`}
              className="flex items-center justify-center gap-[8px] px-[20px] py-[12px] rounded-[10px] border-none cursor-pointer text-[13px] md:text-[14px] font-semibold no-underline transition-all"
              style={{ background: "rgba(53,49,155,0.08)", color: "#35319B", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              <ExternalLink size={16} />
              Open Email Client
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
