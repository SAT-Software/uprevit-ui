"use client";

import Hero from "@/features/marketing/landing-page/hero";
import MarketingHeader from "@/features/marketing/marketing-header";
import { Ripple } from "@/components/ui/ripple";
import Image from "next/image";
import DemoSection from "@/features/marketing/landing-page/DemoSection";
import HeroFeatureCards from "@/features/marketing/landing-page/HeroFeatureCards";

const items = [
  {
    circleIndex: 0,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/CE-symbol.png"
          alt="CE Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 30,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/MD-symbol.png"
          alt="MD Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 25,
    reverse: true,
  },
  {
    circleIndex: 2,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/UDI-symbol.png"
          alt="UDI Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 20,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative h-8 w-36 border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/Barcode-graphic.webp"
          alt="Barcode Graphic"
          fill
          className="object-contain p-1"
        />
      </div>
    ),
    speed: 25,
    reverse: true,
  },
];

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <MarketingHeader />
      <div className="relative w-full">
        <Ripple items={items} />
        <Hero />
      </div>
      <HeroFeatureCards />
      <DemoSection />
    </div>
  );
}
