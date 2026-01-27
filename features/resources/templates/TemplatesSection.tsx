"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  PiCheckCircleDuotone,
  PiDownloadDuotone,
  PiFileTextDuotone,
} from "react-icons/pi";

const templateItems = [
  {
    title: "Gap Assessment Checklist - Basic",
    description:
      "Identify compliance gaps in your labeling process with a structured, audit-ready checklist.",
    type: "Checklist",
    tags: ["Checklist"],
    format: "PDF",
  },
  {
    title: "Validation Template (CSV)",
    description:
      "Structured template for validating label data and ensuring accuracy across systems.",
    type: "Validation",
    tags: ["Template", "Validation"],
    format: "CSV",
  },
  {
    title: "Project Timeline & Gantt Template",
    description:
      "Plan and track labeling initiatives with a ready-to-use timeline tracker.",
    type: "Template",
    tags: ["Template"],
    format: "XLSX",
  },
  {
    title: "Standard File Naming Nomenclatures",
    description:
      "Align teams on consistent naming conventions for medical device documentation.",
    type: "Guide",
    tags: ["Guide"],
    format: "PDF",
  },
];

const tags = ["All", "Checklist", "Template", "Guide", "Validation"];

const toolkitSteps = [
  {
    title: "Pick a template",
    description: "Filter by asset type and download in your preferred format.",
  },
  {
    title: "Customize for your workflow",
    description: "Adapt checklists and validation sheets to match internal SOPs.",
  },
  {
    title: "Share with reviewers",
    description: "Use structured assets to speed up reviews and approvals.",
  },
];

export default function TemplatesSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";
  const filteredTemplates =
    activeTag === "All"
      ? templateItems
      : templateItems.filter((item) => item.tags.includes(activeTag));

  return (
    <div className="w-full mt-12 mb-24 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-10 px-4">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <span className="font-medium">Templates</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Practical toolkits and templates built for audits
          </h2>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            Download ready-to-use assets created by regulatory experts. Stop
            rebuilding the basics and focus on quality review.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg">Download starter kit</Button>
          <Button size="lg" variant="outline">
            Request a custom pack
          </Button>
        </div>
      </div>

      <div className="relative w-full">
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
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-1">
              <div className="rounded-[10px] border border-border bg-background/80 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <PiCheckCircleDuotone className="size-5 text-foreground/60" />
                  Built for fast adoption
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Each template includes clear guidance so teams can align
                  quickly, reduce review cycles, and keep documentation
                  consistent.
                </p>
                <div className="mt-6 space-y-4">
                  {toolkitSteps.map((step, index) => (
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
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-background/80 p-3">
                    <p className="text-xs text-muted-foreground">Formats</p>
                    <p className="text-sm font-semibold">PDF, CSV, XLSX</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/80 p-3">
                    <p className="text-xs text-muted-foreground">Designed for</p>
                    <p className="text-sm font-semibold">Regulatory audits</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[10px] border border-border bg-background/80 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={activeTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTag(tag)}
                      className="rounded-full"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <PiFileTextDuotone className="size-5 text-primary" />
                            <h4 className="text-base font-semibold">
                              {item.title}
                            </h4>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {item.format}
                        </span>
                        <Button variant="outline" size="sm">
                          <PiDownloadDuotone className="mr-2 size-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
