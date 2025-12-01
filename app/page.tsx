"use client";

import HeroSection from "@/features/marketing/landing-page/HeroSection";
import MarketingHeader from "@/features/marketing/marketing-header";
import { Ripple } from "@/components/ui/ripple";
import Image from "next/image";
import HeroFeatureDemo from "@/features/marketing/landing-page/HeroFeatureDemo";
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
    speed: 55,
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
    speed: 50,
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
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-210 left-80 w-px h-screen bg-linear-to-b from-accent/40 from-10% to-accent to-90% z-55" />
      <div className="absolute top-210 right-80 w-px h-screen bg-linear-to-b from-accent/40 from-10% to-accent to-90% z-55" />
      <MarketingHeader />
      <div className="relative w-full">
        <Ripple items={items} />
        <HeroSection />
      </div>
      <div className="pointer-events-none w-full mx-auto -mt-60">
        <HeroFeatureCards />
        <HeroFeatureDemo />
      </div>
    </div>
  );
}
