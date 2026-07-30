"use client";

import { MarketingSectionBadge } from "@/components/MarketingSectionBadge";
import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { useScrollSection } from "@/lib/scroll-context";
import { ModernTvIcon } from "@hugeicons/core-free-icons";
import Lottie from "lottie-react";
import uprevitMarketingVideo from "@/public/Uprevit-Marketing-Video.json";

export default function DemoSection() {
  const demoRef = useScrollSection("demo");

  return (
    <div ref={demoRef} className="w-full mt-40 mb-20">
      <div className="max-w-6xl mx-auto mb-8 relative px-2 md:px-2 lg:px-0">
        <MarketingSectionBadge icon={ModernTvIcon} label="Uprevit Demo" />

        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start text-2xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl md:w-1/2 font-medium mr-16 mb-4 md:mb-0">
            The FastTrack way to Global labeling compliance
          </h2>
          <div className="hidden lg:block mr-12 h-16 w-px bg-border" />
          <p className="text-base md:text-lg lg:text-xl font-normal text-muted-foreground/60">
            Command Your Labels <br /> Command Your Compliance
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative px-2 md:px-2 lg:px-0">
          {/* Bottom-left corner (medium size) */}
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={180}
            size="md"
          />
          {/* Bottom-right corner (medium size) */}
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-7.5 -right-22.5"
            rotation={90}
            size="md"
          />
          {/* Top-right corner (small size) */}
          <DecorativeCornerCircleCustom
            positionClassName="-top-15 -right-15"
            rotation={90}
          />

          <div className="p-1 bg-muted border-border border rounded-2xl shadow-bottom-lg">
            <Card className="aspect-auto mx-auto border-border overflow-hidden shadow-none">
              <CardContent className="p-0 overflow-hidden dark:hidden">
                <Lottie
                  animationData={uprevitMarketingVideo}
                  loop={true}
                  className="aspect-auto"
                />
              </CardContent>
              <CardContent className="p-0 overflow-hidden dark:block hidden">
                <Lottie
                  animationData={uprevitMarketingVideo}
                  loop={true}
                  className="aspect-auto"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
