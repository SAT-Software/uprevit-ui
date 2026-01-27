"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiCheckCircleDuotone, PiClockDuotone, PiWrenchDuotone } from "react-icons/pi";

const upcomingTools = [
  {
    title: "Label Generator",
    description: "Create compliant medical device labels with automatic symbol inclusion and regulatory validation.",
    status: "In Development",
  },
  {
    title: "Compliance Checker",
    description: "Automated validation of your labels against FDA, EU MDR, and other regulatory requirements.",
    status: "Planned",
  },
  {
    title: "Symbol Library Manager",
    description: "Organize and manage your organization's symbol library with version control and approval workflows.",
    status: "Planned",
  },
];

const toolkitBenefits = [
  "Automated compliance checks and approvals",
  "Reusable symbol and template libraries",
  "Faster audit preparation for labeling teams",
  "Built-in guidance tied to standards",
];

const rolloutSteps = [
  {
    title: "Private beta",
    description: "Early access for teams who want to co-design the workflows.",
  },
  {
    title: "Core releases",
    description: "Label generator + compliance checker shipped in waves.",
  },
  {
    title: "Team rollout",
    description: "Add symbol management and advanced audit reports.",
  },
];

export default function ToolkitsPlaceholder() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-12 mb-24 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-10 px-4">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <span className="font-medium">Toolkits</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Free compliance tools, built with labeling teams
          </h2>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            We are building a suite of free tools to reduce manual compliance
            work and keep every label aligned to evolving regulations.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg">Join the waitlist</Button>
          <Button size="lg" variant="outline">
            Request early access
          </Button>
        </div>
      </div>

      <div className="relative w-full mb-16">
        <div className="max-w-6xl mx-auto relative px-4">
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={180}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-7.5 -right-22.5"
            rotation={90}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-top-15 -right-15"
            rotation={90}
          />

          <div className="p-1 bg-accent border-border border rounded-[12px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-1">
              <div className="rounded-[10px] border border-border bg-foreground text-background p-6">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-background/40 text-background/80"
                  >
                    Coming soon
                  </Badge>
                  <span className="text-xs text-background/70">
                    3 tools in pipeline
                  </span>
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
                  className="mt-6 border-background/40 text-background hover:bg-background hover:text-foreground"
                >
                  Notify me on launch
                </Button>
              </div>
              <div className="rounded-[10px] border border-border bg-background/80 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <PiClockDuotone className="size-5 text-foreground/60" />
                  Rollout plan
                </div>
                <div className="mt-4 space-y-4">
                  {rolloutSteps.map((step, index) => (
                    <div key={step.title} className="flex gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full border border-border text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{step.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg border border-border bg-background/80 p-4">
                  <p className="text-xs text-muted-foreground">Current focus</p>
                  <p className="text-sm font-semibold">Label Generator beta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-medium">
            What&apos;s coming next
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Follow each release and decide where you want early access. Every
            tool is free and purpose-built for medical device compliance.
          </p>
        </div>
        <div className="p-1 bg-accent border-border border rounded-[12px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {upcomingTools.map((tool) => (
              <div
                key={tool.title}
                className="rounded-[10px] border border-border bg-background/80 p-6 transition-colors hover:bg-accent/40"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {tool.status}
                  </Badge>
                  <PiWrenchDuotone className="size-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{tool.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <PiCheckCircleDuotone className="size-4" />
                  Free for early adopters
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
