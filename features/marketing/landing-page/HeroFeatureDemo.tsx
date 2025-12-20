"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (activeIndex !== displayIndex) {
      setOpacity(0);
      const timer = setTimeout(() => {
        setDisplayIndex(activeIndex);
        setOpacity(1);
      }, 3000); // Wait for transition out
      return () => clearTimeout(timer);
    }
  }, [activeIndex, displayIndex]);

  return (
    <div className="relative w-full mx-auto mt-20 mb-20 px-4 lg:px-0">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute -bottom-8 -left-22 text-border/60 pointer-events-none hidden md:block rotate-270">
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="58"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="0.8 3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute -bottom-15 -right-15 text-border/60 pointer-events-none hidden md:block rotate-180">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="58"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="0.8 3"
              strokeLinecap="round"
            />
          </svg>
        </div>

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
