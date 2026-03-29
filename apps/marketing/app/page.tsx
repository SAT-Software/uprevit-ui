"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/features/marketing/landing-page/HeroSection";
import MarketingHeader from "@/features/marketing/marketing-header";
import { Ripple } from "@/components/ui/ripple";
import Image from "next/image";
// import HeroFeatureDemo from "@/features/marketing/landing-page/HeroFeatureDemo";
import HeroFeatureCards from "@/features/marketing/landing-page/HeroFeatureCards";
import DemoSection from "@/features/marketing/landing-page/DemoSection";
import ReportSection from "@/features/marketing/landing-page/ReportSection";
import FeaturesSection from "@/features/marketing/landing-page/FeaturesSection";
import FAQSection from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { ScrollProvider } from "@/lib/scroll-context";

const items = [
  {
    circleIndex: 0,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/CE.png"
          alt="CE Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 55,
    initialAngle: 0,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/MD.png"
          alt="MD Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    reverse: true,
    initialAngle: 180,
  },
  {
    circleIndex: 2,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/DMGPKG.png"
          alt="UDI Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    initialAngle: 90,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/2DBarcode.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 40,
    reverse: true,
    initialAngle: 160,
  },
  {
    circleIndex: 0,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/FDA.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 50,
    reverse: true,
    initialAngle: 180,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/DoNotReuse.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 35,
    initialAngle: 0,
  },
  {
    circleIndex: 2,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/UKCA.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 45,
    reverse: true,
    initialAngle: 200,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/ISO.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    reverse: true,
    initialAngle: 90,
  },
  {
    circleIndex: 4,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/WEEE-symbol.webp"
          alt="Barcode Graphic"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    initialAngle: 45,
  },
  {
    circleIndex: 0,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/Sterile.png"
          alt="CAS Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 45,
    initialAngle: 90,
  },
  {
    circleIndex: 0,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/IFU1.png"
          alt="DNR Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 45,
    reverse: true,
    initialAngle: 270,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/Importer.png"
          alt="EC-REP Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 50,
    initialAngle: 90,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/ISO.png"
          alt="IFU Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 45,
    reverse: true,
    initialAngle: 270,
  },
  {
    circleIndex: 2,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 dark:bg-neutral-500 border-foreground flex items-center justify-center">
        <Image
          src="/MFR.png"
          alt="Manufacturer Symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 55,
    initialAngle: 0,
  },
];

export default function Home() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollProvider>
      <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
        <MarketingHeader />
        <div className="relative w-full">
          <Ripple items={items} />
          <HeroSection />
        </div>
        <div className="relative pointer-events-none w-full mx-auto -mt-50 z-55">
          <div className="absolute inset-0 w-full max-w-6xl mx-auto pointer-events-none">
            <div className="absolute top-40 left-0 w-px h-10 bg-border/5 z-40" />
            <div className="absolute top-40 right-0 w-px h-10 bg-border/5 z-40" />
            <div className="absolute top-50 left-0 w-px h-10 bg-border/10 z-40" />
            <div className="absolute top-50 right-0 w-px h-10 bg-border/10 z-40" />
            <div className="absolute top-60 left-0 w-px h-10 bg-border/20 z-40" />
            <div className="absolute top-60 right-0 w-px h-10 bg-border/20 z-40" />
            <div className="absolute top-70 left-0 w-px h-10 bg-border/30 z-40" />
            <div className="absolute top-70 right-0 w-px h-10 bg-border/30 z-40" />
            <div className="absolute top-80 left-0 w-px h-10 bg-border/40 z-40" />
            <div className="absolute top-80 right-0 w-px h-10 bg-border/40 z-40" />
            <div className="absolute top-90 left-0 w-px h-10 bg-border/50 z-40" />
            <div className="absolute top-90 right-0 w-px h-10 bg-border/50 z-40" />
            <div className="absolute top-100 left-0 w-px bottom-0 bg-linear-to-b from-border/60 via-border/60 to-border/60 z-30" />
            <div className="absolute top-100 right-0 w-px bottom-0 bg-linear-to-b from-border/60 via-border/60 to-border/60 z-30" />
          </div>
          <HeroFeatureCards
            activeIndex={activeFeatureIndex}
            onActiveChange={setActiveFeatureIndex}
          />
          {/* <HeroFeatureDemo activeIndex={activeFeatureIndex} /> */}
          <DemoSection />
          <ReportSection />
          <FeaturesSection />
          <CTASection />
          <FAQSection />
          <FooterSection />
        </div>
      </div>
    </ScrollProvider>
  );
}
