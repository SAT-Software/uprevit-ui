"use client";

import MarketingHeader from "@/features/marketing/marketing-header";
import StandardsSymbolsSection from "@/features/resources/standards/StandardsSymbolsSection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export default function StandardsSymbolsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="w-full pt-32">
        <StandardsSymbolsSection />
      </div>
      <div className="w-full">
        <FooterSection />
      </div>
    </div>
  );
}
