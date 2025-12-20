import { Badge } from "@/components/ui/badge";
import { PiBoundingBoxDuotone, PiImageDuotone } from "react-icons/pi";
import { AutomatedRedliningCard } from "./AutomatedRedliningCard";
import { VersionControlCards } from "./VersionControlCards";
import { Worksteps } from "./Worksteps";
import { LabelDataTaggingCard } from "./LabelDataTaggingCard";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FeaturesSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant =
    mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-40 mb-20 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-8">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiBoundingBoxDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">Features</span>
        </Badge>
        <div className="w-full flex items-center justify-start text-2xl">
          <h2 className="text-5xl w-full font-medium">
            Turn raw data into Notified Body ready document
          </h2>
          <div className="mx-8 h-24 w-px bg-border" />
          <p className="font-semibold text-muted-foreground/60 mr-8 tracking-tighter leading-tight">
            Unify your data, Uprevit your workflow. Stop managing scattered
            source files and start managing results
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute bottom-0 -left-15 text-border/60 pointer-events-none hidden md:block rotate-0">
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
          <div className="absolute bottom-0 -right-15 text-border/60 pointer-events-none hidden md:block rotate-90">
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
          <div className="absolute -bottom-15 left-0 text-border/60 pointer-events-none hidden md:block rotate-180">
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
          <div className="absolute -bottom-15 right-0 text-border/60 pointer-events-none hidden md:block rotate-270">
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

          <div className="p-1 bg-accent rounded-[12px] max-w-6xl mx-auto border border-border">
            <div className="flex flex-col gap-1">
              <div className="flex w-full h-130 gap-1">
                <AutomatedRedliningCard />
                <VersionControlCards />
              </div>
              <div className="flex w-full h-130 gap-1">
                <Worksteps className="w-1/3" />
                <LabelDataTaggingCard className="w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
