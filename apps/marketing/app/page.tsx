import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import HeroSection from "@/features/marketing/landing-page/HeroSection";
import StandardsSection from "@/features/marketing/landing-page/StandardsSection";
import ProblemSection from "@/features/marketing/landing-page/ProblemSection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export default function Home() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main className="contents">
        <HeroSection />
        <TileSpacerRow />
        <StandardsSection />
        <TileSpacerRow />
        <ProblemSection />
        <TileSpacerRow />
      </main>
      <div className="[&_footer]:mt-0">
        <FooterSection />
      </div>
    </TileGrid>
  );
}
