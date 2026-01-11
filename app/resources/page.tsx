"use client";

import MarketingHeader from "@/features/marketing/marketing-header";
import ResourcesHub from "@/features/resources/ResourcesHub";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="w-full pt-32">
        <ResourcesHub />
      </div>
      <div className="w-full">
        <FooterSection />
      </div>
    </div>
  );
}
