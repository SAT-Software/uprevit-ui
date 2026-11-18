import { pageMetadata } from "@/lib/metadata";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import StandardsSymbolsSection from "@/features/resources/standards/StandardsSymbolsSection";

export const metadata = pageMetadata(
  "Medical Device Labeling Standards and Symbols",
  "Symbol guidance and ISO references in one place, so medical device teams can label confidently across global markets.",
  "/resources/standards-symbols",
  false,
);

export default function StandardsSymbolsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <main className="relative z-10 w-full pt-8 md:pt-24">
          <StandardsSymbolsSection />
        </main>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
