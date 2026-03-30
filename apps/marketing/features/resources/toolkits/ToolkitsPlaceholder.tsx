"use client";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import {
  PiBinocularsDuotone,
  PiCheckCircleDuotone,
  PiClockDuotone,
  PiHourglassLowDuotone,
  PiWrenchDuotone,
} from "react-icons/pi";

const upcomingTools = [
  {
    title: "Label Generator",
    description:
      "Create compliant medical device labels with automatic symbol inclusion and regulatory validation.",
    status: "In Development",
  },
  {
    title: "Compliance Checker",
    description:
      "Automated validation of your labels against FDA, EU MDR, and other regulatory requirements.",
    status: "Planned",
  },
  {
    title: "Symbol Library Manager",
    description:
      "Organize and manage your organization's symbol library with version control and approval workflows.",
    status: "Planned",
  },
];

const toolkitBenefits = [
  "Automated compliance checks and approvals",
  "Reusable symbol and template libraries",
  "Faster audit preparation for labeling teams",
  "Built-in guidance tied to standards",
];

export default function ToolkitsPlaceholder() {
  const { resolvedTheme } = useTheme();
  const badgeVariant = resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-16 mb-24 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <div className="max-w-6xl mx-auto mb-10">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiWrenchDuotone />
          <span className="font-medium">Toolkits</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tightest">
            Free compliance tools, built with labeling teams
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            We are building a suite of free tools to reduce manual compliance
            work and keep every label aligned to evolving regulations.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg" variant="outline">
            <PiBinocularsDuotone />
            Request early access
          </Button>
          <Button size="lg">
            <PiHourglassLowDuotone />
            Join the waitlist
          </Button>
        </div>
      </div>

      <div className="relative w-full mb-40">
        <div className="max-w-6xl mx-auto relative">
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={270}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -right-15"
            rotation={180}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-top-15 -right-15"
            rotation={90}
          />

          <div className="p-1 bg-accent border-border border rounded-[12px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-1">
              <div className="rounded-[10px] border border-border bg-foreground text-background p-6">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-background/40 text-background/80"
                  >
                    Coming soon
                  </Badge>
                  {/* <span className="text-xs text-background/70">
                    3 tools in pipeline
                  </span> */}
                </div>
                <h3 className="mt-4 text-2xl font-semibold">
                  Build compliant labels without the manual chase
                </h3>
                <p className="mt-3 text-sm text-background/80">
                  Each toolkit is designed to remove repetitive work, improve
                  audit readiness, and keep teams aligned on regulatory
                  standards.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {toolkitBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-lg border border-background/20 bg-background/10 p-3 text-xs text-background/80"
                    >
                      {benefit}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-6 border-background/40 text-foreground hover:bg-background hover:text-foreground"
                >
                  Notify me on launch
                </Button>
              </div>
              <div className="rounded-[10px] border border-border bg-background/80 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold">
                    What&apos;s coming next
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track upcoming tools and claim early access.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {upcomingTools.map((tool) => (
                    <div
                      key={tool.title}
                      className="rounded-[10px] border border-border bg-background/90 p-3 transition-colors hover:bg-accent/40"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold">{tool.title}</h5>
                        <PiWrenchDuotone className="size-4 text-muted-foreground" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                      {/* <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {tool.status}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>
    </div>
  );
}
