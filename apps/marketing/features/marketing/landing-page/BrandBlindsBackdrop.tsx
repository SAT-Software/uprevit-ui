"use client";

import { cn } from "@uprevit/ui/lib/utils";
import GradientBlinds from "./GradientBlinds";

const BRAND_VIOLET = ["#C49EFF", "#7F22FE", "#2A0560"];

interface BrandBlindsBackdropProps {
  anchorX?: number;
  anchorY?: number;
  className?: string;
}

export function BrandBlindsBackdrop({
  anchorX = 0.5,
  anchorY = 0.5,
  className,
}: BrandBlindsBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-[#0B0716]",
        className,
      )}
    >
      <GradientBlinds
        gradientColors={BRAND_VIOLET}
        angle={20}
        blindCount={16}
        noise={0.12}
        spotlightRadius={0.6}
        spotlightOpacity={0.8}
        glow={0.25}
        shine={0.35}
        sway={0}
        gradientSpeed={0}
        clickEffect="none"
        idle="anchor"
        anchorX={anchorX}
        anchorY={anchorY}
        intro={false}
      />
    </div>
  );
}
