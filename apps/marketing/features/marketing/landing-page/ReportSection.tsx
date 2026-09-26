"use client";

import { MarketingSectionBadge } from "@/components/MarketingSectionBadge";
import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { DecorativeCornerCircle } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { Archive01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { MediaPlayToggle } from "@/components/MediaPlayToggle";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export default function ReportSection() {
  const lightRef = useRef<HTMLVideoElement>(null);
  const darkRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  // null until the visitor toggles; defaults to their motion preference.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reduceMotion;

  useEffect(() => {
    for (const video of [lightRef.current, darkRef.current]) {
      if (!video) continue;
      if (playing) video.play().catch(() => setUserPlaying(false));
      else video.pause();
    }
  }, [playing]);

  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-6xl flex flex-col items-center mx-auto mb-8 px-2 md:px-2 lg:px-0">
        <MarketingSectionBadge icon={Archive01Icon} label="Report" />
        <div className="w-full flex flex-col gap-4 items-center justify-center text-2xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium">
            Extract powerful reports
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-normal text-muted-foreground w-full md:w-1/3 text-center">
            Get insights into your data with our powerful reporting tools
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative px-2 md:px-2 lg:px-0">
          {/* Bottom-left corner */}
          <DecorativeCornerCircle position="bottom-left" rotation={270} />
          {/* Bottom-right corner */}
          <DecorativeCornerCircle position="bottom-right" rotation={180} />
          {/* Top-left corner */}
          <DecorativeCornerCircle position="top-left" rotation={0} />
          {/* Top-right corner */}
          <DecorativeCornerCircle position="top-right" rotation={90} />

          <div className="p-1 bg-muted border-border border rounded-2xl shadow-bottom-lg max-w-6xl mx-auto">
            <Card className="aspect-16/8 mx-auto border-border max-w-6xl overflow-hidden shadow-none">
              <CardContent className="relative p-0 overflow-hidden">
                <video
                  ref={lightRef}
                  src="/Report-Light-Demo.mp4"
                  className="overflow-hidden rounded-xl dark:hidden"
                  aria-label="Report builder demo"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <video
                  ref={darkRef}
                  src="/Report-Dark-Demo.mp4"
                  className="hidden overflow-hidden rounded-xl dark:block"
                  aria-label="Report builder demo"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <MediaPlayToggle
                  playing={playing}
                  onToggle={() => setUserPlaying(!playing)}
                  label="report demo"
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
