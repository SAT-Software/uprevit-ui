"use client";

import MarketingHeader from "@/features/marketing/marketing-header";
import TemplatesSection from "@/features/resources/templates/TemplatesSection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="w-full pt-32">
        <TemplatesSection />
      </div>
      <div className="w-full">
        <FooterSection />
      </div>
    </div>
  );
}
