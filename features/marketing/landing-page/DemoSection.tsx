"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiImageDuotone } from "react-icons/pi";

export default function DemoSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant =
    mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-6xl mx-auto mb-8 relative">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiImageDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">Uprevit Demo</span>
        </Badge>

        <div className="w-full flex items-center justify-start text-2xl">
          <h2 className="text-5xl w-1/2 font-medium mr-16">
            The FastTrack way to Global labeling compliance
          </h2>
          <div className="mr-12 h-16 w-px bg-border" />
          <p className="font-semibold text-muted-foreground/60">
            Command Your Labels. <br /> Command Your Compliance.
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute -bottom-15 -left-15 text-border/60 pointer-events-none hidden md:block rotate-180">
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
          <div className="absolute -bottom-7.5 -right-22.5 text-border/60 pointer-events-none hidden md:block rotate-90">
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
          <div className="absolute -top-15 -right-15 text-border/60 pointer-events-none hidden md:block rotate-90">
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

          <div className="p-1 bg-accent border-border border rounded-[12px]">
            <Card className="aspect-16/8 mx-auto border-border overflow-hidden">
              <CardContent className="p-0 overflow-hidden">
                <video
                  src="/uprevit-test-demo-1.mp4"
                  className="overflow-hidden rounded-[8px]"
                  autoPlay
                  loop
                  muted
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
