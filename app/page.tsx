"use client";

import Hero from "@/features/marketing/landing-page/hero";
import MarketingHeader from "@/features/marketing/marketing-header";
import { Ripple } from "@/components/ui/ripple";

export default function Home() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center">
      <Ripple />
      <MarketingHeader />
      <Hero />
    </div>
  );
}
