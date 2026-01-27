"use client";

import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import StandardsSymbolsSection from "@/features/resources/standards/StandardsSymbolsSection";

export default function StandardsSymbolsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <div className="relative z-10 w-full pt-24">
          <StandardsSymbolsSection />
        </div>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
