import SiteNavbar from "@/components/navbar/SiteNavbar";
import HeroSection from "@/components/hero/HeroSection";
import HeroStatementStrip from "@/components/hero/HeroStatementStrip";
import ChronotypeIntroductionSection from "@/components/chronotype/ChronotypeIntroductionSection";
import dynamic from "next/dynamic";
import SitePreloader from "@/components/preloader/SitePreloader";

const ChronotypeOptimizationSection = dynamic(() => import("@/components/optimization/ChronotypeOptimizationSection"));
const DailyEnergyPillarsSection = dynamic(() => import("@/components/pillars/DailyEnergyPillarsSection"));
const BetterSleepBetterDaysSection = dynamic(() => import("@/components/better-sleep/BetterSleepBetterDaysSection"));
const WhySleepMattersSection = dynamic(() => import("@/components/why-sleep/WhySleepMattersSection"));
const UnderstandingSleepCyclesSection = dynamic(() => import("@/components/sleep-cycles/UnderstandingSleepCyclesSection"));
const CommonSleepDisordersSection = dynamic(() => import("@/components/sleep-disorders/CommonSleepDisordersSection"));
const WarningSignsSection = dynamic(() => import("@/components/warning-signs/WarningSignsSection"));
const SleepFactsSharingSection = dynamic(() => import("@/components/sleep-facts/SleepFactsSharingSection"));
const AdditionalGuidanceSection = dynamic(() => import("@/components/additional-guidance/AdditionalGuidanceSection"));
const FaqSection = dynamic(() => import("@/components/faq/FaqSection"));
const DisclaimerFooter = dynamic(() => import("@/components/footer/DisclaimerFooter"));

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <SitePreloader />
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
