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

export const dynamic = "force-dynamic";

export default function HomePage() {
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
