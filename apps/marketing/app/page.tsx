import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import HeroSection from "@/features/marketing/landing-page/HeroSection";
import StandardsSection from "@/features/marketing/landing-page/StandardsSection";
import ProblemSection from "@/features/marketing/landing-page/ProblemSection";
import SolutionSection from "@/features/marketing/landing-page/SolutionSection";
import HowItWorksSection from "@/features/marketing/landing-page/HowItWorksSection";
import FeaturesSection from "@/features/marketing/landing-page/FeaturesSection";
import RedlinesSection from "@/features/marketing/landing-page/RedlinesSection";
import ReportsSection from "@/features/marketing/landing-page/ReportsSection";
import GovernanceSection from "@/features/marketing/landing-page/GovernanceSection";
import FAQSection from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export default function Home() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <HeroSection />
        <TileSpacerRow />
        <StandardsSection />
        <TileSpacerRow />
        <ProblemSection />
        <TileSpacerRow />
        <SolutionSection />
        <TileSpacerRow />
        <HowItWorksSection />
        <TileSpacerRow />
        <FeaturesSection />
        <TileSpacerRow />
        <RedlinesSection />
        <TileSpacerRow />
        <ReportsSection />
        <TileSpacerRow />
        <GovernanceSection />
        <TileSpacerRow />
        <FAQSection />
        <TileSpacerRow />
        <CTASection />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
