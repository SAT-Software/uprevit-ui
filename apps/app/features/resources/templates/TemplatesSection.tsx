"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  PiDownloadDuotone,
  PiFilesDuotone,
  PiTrayDuotone,
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
    description:
      "Adapt checklists and validation sheets to match internal SOPs.",
  },
  {
    title: "Share with teams",
    description: "Use structured assets to speed up collaboration and reviews.",
  },
];

export default function TemplatesSection() {
  const { resolvedTheme } = useTheme();
  const [activeTag, setActiveTag] = useState("All");
  const badgeVariant = resolvedTheme === "dark" ? "outline" : "white";
  const filteredTemplates =
    activeTag === "All"
      ? templateItems
      : templateItems.filter((item) => item.tags.includes(activeTag));

  return (
    <div className="w-full mt-16 mb-24 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <div className="max-w-6xl mx-auto mb-10">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiFilesDuotone />
          <span className="font-medium">Templates</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tightest">
            Practical templates built for speed
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            Download ready-to-use assets created by regulatory experts. Stop
            rebuilding the basics and focus on quality review.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg" variant="outline">
            <PiTrayDuotone />
            Request a custom pack
          </Button>
          <Button size="lg">
            <PiDownloadDuotone /> Download starter kit
          </Button>
        </div>
      </div>

      <div className="relative w-full">
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
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-1">
              <div className="rounded-[10px] flex flex-col gap-4 justify-between border border-border bg-background/80 p-6">
                <div>
                  <div>
                    <div className="flex items-center gap-2 text-base font-semibold">
                      Built for fast adoption
                    </div>
                    <p className=" text-sm text-muted-foreground">
                      Each template includes clear guidance so teams can align
                      quickly, reduce review cycles, and keep documentation
                      consistent.
                    </p>
                  </div>
                  <div className="mt-6 space-y-4">
                    {toolkitSteps.map((step, index) => (
                      <div key={step.title} className="flex gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full border border-border text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">
                            {step.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-background/80 p-3">
                    <p className="text-xs text-muted-foreground">Formats</p>
                    <p className="text-sm font-semibold">PDF, CSV, XLSX</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/80 p-3">
                    <p className="text-xs text-muted-foreground">
                      Designed for
                    </p>
                    <p className="text-sm font-semibold">Regulatory Affairs</p>
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
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredTemplates.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl flex flex-col justify-between gap-2 border border-border p-2 transition-colors hover:bg-accent/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {/* <PiFileTextDuotone className="size-5 text-primary" /> */}
                            <h4 className="text-sm font-semibold">
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
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>
    </div>
  );
}
