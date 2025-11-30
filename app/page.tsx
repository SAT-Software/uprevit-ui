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
    speed: 35,
    initialAngle: 0,
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
    speed: 35,
    reverse: true,
    initialAngle: 180,
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
    speed: 35,
    initialAngle: 90,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/2D Barcode-graphic.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 35,
    reverse: true,
    initialAngle: 270,
  },
  {
    circleIndex: 0,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/FDA-logo.png"
          alt="Barcode Graphic"
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
    circleIndex: 1,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/RX-symbol.png"
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
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/UKCA-symbol.png"
          alt="Barcode Graphic"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 35,
    reverse: true,
    initialAngle: 270,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/ISO-logo.png"
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
      <div className="relative h-12 w-12 rounded-full border border-dashed bg-neutral-100 border-foreground flex items-center justify-center">
        <Image
          src="/UKCA-symbol.webp"
          alt="Barcode Graphic"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    initialAngle: 45,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-200 left-80 w-px h-screen bg-accent" />
      <div className="absolute top-200 right-80 w-px h-screen bg-accent" />
      <MarketingHeader />
      <div className="relative w-full">
        <Ripple items={items} />
        <Hero />
      </div>
      <div className="pointer-events-none max-w-7xl w-full mx-auto -mt-60">
        <HeroFeatureCards />
        <DemoSection />
      </div>
    </div>
  );
}
