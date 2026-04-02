"use client";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  PiBookOpenDuotone,
  PiFilesDuotone,
  PiNewspaperDuotone,
  PiStackDuotone,
  PiWrenchDuotone,
} from "react-icons/pi";

const resources = [
  {
    id: "templates",
    title: "Templates",
    description:
      "Battle-tested checklists and templates built by regulatory experts to keep documentation audit-ready.",
    icon: PiFilesDuotone,
    href: "/resources/templates",
    meta: "Checklists, validation kits, naming guides",
    highlights: [
      "Gap assessments",
      "Validation templates",
      "Project timelines",
    ],
    cta: "Browse templates",
  },
  {
    id: "standards-symbols",
    title: "Standards & Symbols",
    description:
      "Centralized ISO references and standardized medical device symbols for global regulatory alignment.",
    icon: PiBookOpenDuotone,
    href: "/resources/standards-symbols",
    meta: "ISO library + symbol usage guidance",
    highlights: ["ISO 15223-1", "Device symbol library", "Usage references"],
    cta: "Explore standards",
  },
  {
    id: "blogs",
    title: "Blogs",
    description:
      "Expert analysis of regulatory shifts with clear, actionable takeaways for labeling teams.",
    icon: PiNewspaperDuotone,
    href: "/resources/blogs",
    meta: "Regulatory updates and field notes",
    highlights: [
      "FDA + EU MDR updates",
      "Implementation guides",
      "Release notes",
    ],
    cta: "Read insights",
  },
  {
    id: "toolkits",
    title: "Toolkits",
    description:
      "Free compliance tools to streamline labeling workflows, validation, and symbol management.",
    icon: PiWrenchDuotone,
    href: "/resources/toolkits",
    meta: "Free tools, rolling releases",
    highlights: ["Label generator", "Compliance checker", "Symbol manager"],
    cta: "See toolkits",
  },
];

// const resourcePillars = [
//   {
//     title: "Curated by regulatory experts",
//     description: "Practical resources shaped by real audits and label reviews.",
//   },
//   {
//     title: "Always aligned to standards",
//     description: "ISO, FDA, and EU MDR updates distilled for quick action.",
//   },
//   {
//     title: "Made to ship fast",
//     description: "Download-ready assets that plug into your workflows.",
//   },
// ];

export default function ResourcesHub() {
  const { resolvedTheme } = useTheme();
  const badgeVariant = resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-16 mb-24 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <div className="max-w-6xl mx-auto mb-10 px-2 md:px-2 lg:px-0">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiStackDuotone className="text-foreground/60" />
          <span className="font-medium">Resources</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-medium leading-tightest">
            The library built for labeling teams
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
            Templates, standards, and expert analysis organized into a single
            hub. Everything you need to move from draft to approved label with
            confidence.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources/standards-symbols">
              <PiBookOpenDuotone /> Explore standards
            </Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/resources/templates">
              <PiFilesDuotone />
              Browse templates
            </Link>
          </Button>
        </div>
        {/* <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {resourcePillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-border bg-background/70 p-5"
            >
              <p className="text-xs uppercase text-muted-foreground">Pillar</p>
              <h3 className="mt-2 text-base font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          ))}
        </div> */}
      </div>

      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative px-2 md:px-2 lg:px-0">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex h-full flex-col justify-between rounded-[10px] border border-border bg-background/80 p-4 md:p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 md:size-11 shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-foreground text-background">
                          <resource.icon className="size-4 md:size-5" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {resource.meta}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-foreground leading-relaxed">
                      {resource.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      {resource.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="size-1.5 rounded-full bg-foreground/60" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Updated regularly
                    </p>
                    <Button variant="outline" asChild>
                      <Link href={resource.href}>{resource.cta}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>
    </div>
  );
}
