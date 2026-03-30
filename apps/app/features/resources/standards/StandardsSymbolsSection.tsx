"use client";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import {
  PiBookOpenDuotone,
  PiFileTextDuotone,
  PiImagesDuotone,
  PiLinkDuotone,
} from "react-icons/pi";

const symbols = [
  {
    title: "Global Compliance Iconography",
    description:
      "Ensure universal understanding with standardized medical device symbols aligned to global guidance.",
    usage: "Reference sheets, cue cards, usage notes",
  },
];

const symbolHighlights = [
  "Packaging & transport handling",
  "Sterility and safety indicators",
  "UDI and traceability markers",
  "Region-specific compliance marks",
];

const isoDocuments = [
  {
    title: "ISO 15223-1:2021",
    description:
      "Symbols to be used with medical devices, labels, and labeling.",
  },
  {
    title: "ISO 7000:2014",
    description: "Graphical symbols for use on equipment - Registered symbols.",
  },
  {
    title: "ISO 7001:2008",
    description: "Public information symbols.",
  },
  {
    title: "ISO 7010:2019",
    description: "Graphical symbols - Safety colors and safety signs.",
  },
];

export default function StandardsSymbolsSection() {
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
          <PiBookOpenDuotone />
          <span className="font-medium">Standards & Symbols</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tightest">
            Standards, symbols, and references for global compliance
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            Centralize symbol guidance and ISO references in one place so teams
            can label confidently across markets.
          </p>
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
            <div className="flex flex-col gap-1">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 rounded-[10px] border border-border bg-background/80 p-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Standards & symbol library
                  </h2>
                  <p className=" text-sm text-muted-foreground">
                    One consolidated view for ISO guidance and symbol usage
                    references.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <div className="rounded-[10px] border border-border bg-background/90 p-6 w-full">
                  {symbols.map((symbol) => (
                    <div
                      key={symbol.title}
                      className="flex flex-col gap-4 justify-between h-full"
                    >
                      <div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold">
                              {symbol.title}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {symbol.description}
                          </p>
                        </div>
                        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4">
                          <PiLinkDuotone className="size-5 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {symbol.usage}
                          </span>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {symbolHighlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="rounded-lg border border-border bg-background/80 p-3 text-xs text-muted-foreground"
                            >
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-auto self-start">
                        Browse symbol library
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="rounded-[10px] flex flex-col gap-4 justify-between border border-border bg-background/90 p-6 w-full">
                  <div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold">
                          ISO Documents Repository
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Access the latest ISO standards used in medical device
                        labeling and compliance workflows.
                      </p>
                    </div>
                    <div className="mt-6 space-y-3">
                      {isoDocuments.slice(0, 2).map((doc) => (
                        <div
                          key={doc.title}
                          className="rounded-lg border border-border p-4"
                        >
                          <h5 className="text-sm font-semibold">{doc.title}</h5>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {doc.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-auto self-start">
                    Request full ISO access
                  </Button>
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
