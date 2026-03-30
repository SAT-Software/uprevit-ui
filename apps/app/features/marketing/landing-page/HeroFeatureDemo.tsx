"use client";

import { Card } from "@uprevit/ui/components/ui/card";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
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
          <Card className="relative w-full aspect-video mx-auto border-border max-w-6xl overflow-hidden bg-background/50">
            <div className="absolute inset-0">
              {screenshots.map((src, idx) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    activeIndex === idx
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-0"
                  }`}
                >
                  <Image
                    src={src}
                    alt={featureNames[idx]}
                    fill
                    className="object-contain rounded-b-xl will-change-transform"
                    style={{
                      animation:
                        activeIndex === idx
                          ? "hero-feature-zoom-out 5.2s ease-out forwards"
                          : "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />

      <style jsx>{`
        @keyframes hero-feature-zoom-out {
          from {
            transform: scale(1.08);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
