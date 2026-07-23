"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteNavbar from "@/components/navbar/SiteNavbar";
import HeroSection from "@/components/hero/HeroSection";
import HeroStatementStrip from "@/components/hero/HeroStatementStrip";
import ChronotypeIntroductionSection from "@/components/chronotype/ChronotypeIntroductionSection";
import ChronotypeOptimizationSection from "@/components/optimization/ChronotypeOptimizationSection";
import DailyEnergyPillarsSection from "@/components/pillars/DailyEnergyPillarsSection";
import BetterSleepBetterDaysSection from "@/components/better-sleep/BetterSleepBetterDaysSection";
import WhySleepMattersSection from "@/components/why-sleep/WhySleepMattersSection";
import UnderstandingSleepCyclesSection from "@/components/sleep-cycles/UnderstandingSleepCyclesSection";
import CommonSleepDisordersSection from "@/components/sleep-disorders/CommonSleepDisordersSection";
import WarningSignsSection from "@/components/warning-signs/WarningSignsSection";
import SleepFactsSharingSection from "@/components/sleep-facts/SleepFactsSharingSection";
import AdditionalGuidanceSection from "@/components/additional-guidance/AdditionalGuidanceSection";
import FaqSection from "@/components/faq/FaqSection";
import DisclaimerFooter from "@/components/footer/DisclaimerFooter";
import { Moon, Home, Link2 } from "lucide-react";

export default function OrgCodeLandingPage() {
  const params = useParams();
  const orgCode = params.orgCode as string;
  const [linkStatus, setLinkStatus] = useState<"loading" | "active" | "deactivated" | "not_found">("loading");

  useEffect(() => {
    if (!orgCode) return;
    fetch(`/api/org-link-status?code=${encodeURIComponent(orgCode)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.exists) setLinkStatus("not_found");
        else if (!d.active) setLinkStatus("deactivated");
        else setLinkStatus("active");
      })
      .catch(() => setLinkStatus("not_found"));
  }, [orgCode]);

  if (linkStatus === "loading") {
    return (
      <main className="min-h-screen w-full bg-white flex items-center justify-center">
        <p className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</p>
      </main>
    );
  }

  if (linkStatus !== "active") {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center px-[20px]" style={{ background: "#FAFAFC", fontFamily: "Poppins, sans-serif" }}>
        <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-[24px]" style={{ background: linkStatus === "deactivated" ? "rgba(211,47,47,0.1)" : "rgba(53,49,155,0.06)" }}>
          {linkStatus === "deactivated" ? <Link2 size={32} stroke="#D32F2F" /> : <Moon size={32} stroke="#35319B" />}
        </div>
        <h1 className="m-0 text-[24px] font-bold text-center mb-[8px]" style={{ color: "#171717" }}>
          {linkStatus === "deactivated" ? "This Link Has Been Deactivated" : "Link Not Found"}
        </h1>
        <p className="m-0 text-[14px] leading-[1.6] text-center max-w-[400px] mb-[28px]" style={{ color: "#888" }}>
          {linkStatus === "deactivated"
            ? "The organization link you are trying to access is no longer active. Please contact your organization administrator for a new link."
            : "The link you are looking for does not exist or may have expired."}
        </p>
        <a href="/"
          className="inline-flex items-center gap-[8px] text-white text-[15px] font-semibold px-[32px] py-[13px] no-underline rounded-xl transition-all"
          style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 16px rgba(53,49,155,0.25)" }}>
          <Home size={16} stroke="white" /> Go to Homepage
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white">
      <SiteNavbar />
      <HeroSection />
      <HeroStatementStrip />
      <ChronotypeIntroductionSection />
      <ChronotypeOptimizationSection />
      <DailyEnergyPillarsSection />
      <BetterSleepBetterDaysSection />
      <WhySleepMattersSection />
      <UnderstandingSleepCyclesSection />
      <CommonSleepDisordersSection />
      <WarningSignsSection />
      <SleepFactsSharingSection />
      <AdditionalGuidanceSection />
      <FaqSection />
      <DisclaimerFooter />
    </main>
  );
}
