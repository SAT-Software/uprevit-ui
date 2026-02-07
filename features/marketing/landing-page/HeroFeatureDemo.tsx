"use client";

import { Card } from "@/components/ui/card";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";
import Image from "next/image";

const screenshots = [
  "/features/feature-0.png",
  "/features/feature-1.png",
  "/features/feature-2.png",
  "/features/feature-3.png",
  "/features/feature-4.png",
];

const featureNames = [
  "Labeling Standards",
  "Product Specifications",
  "Source Files",
  "Label Components",
  "Symbols-Graphics",
];

export default function HeroFeatureDemo({
  activeIndex,
}: {
  activeIndex: number;
}) {
  return (
    <div className="relative w-full mx-auto mt-20 mb-20 px-4 lg:px-0">
      <div className="max-w-6xl mx-auto relative">
        {/* Bottom-left corner (medium size) */}
        <DecorativeCornerCircleCustom
          positionClassName="-bottom-8 -left-22"
          rotation={270}
          size="md"
        />
        {/* Bottom-right corner (small size) */}
        <DecorativeCornerCircleCustom
          positionClassName="-bottom-15 -right-15"
          rotation={180}
        />

        <div className="p-1 bg-accent border-border border rounded-[12px] backdrop-blur-sm">
          <Card className="relative w-full aspect-16/9 mx-auto border-border max-w-6xl overflow-hidden bg-background/50">
            <div className="absolute inset-0">
              {screenshots.map((src, idx) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    activeIndex === idx
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 translate-y-4"
                  }`}
                >
                  <Image
                    src={src}
                    alt={featureNames[idx]}
                    fill
                    className="object-cover rounded-b-xl"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
    </div>
  );
}
