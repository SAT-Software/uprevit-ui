"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiFileTextDuotone, PiImagesDuotone, PiLinkDuotone } from "react-icons/pi";

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
    description: "Symbols to be used with medical devices, labels, and labeling.",
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
          <span className="font-medium">Standards & Symbols</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Standards, symbols, and references for global compliance
          </h2>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            Centralize symbol guidance and ISO references in one place so teams
            can label confidently across markets.
          </p>
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
            <Tabs defaultValue="symbols" className="w-full">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 rounded-[10px] border border-border bg-background/80 p-6">
                <div>
                  <h3 className="text-xl font-semibold">Library explorer</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Switch between symbol guidance and ISO references without
                    losing context.
                  </p>
                </div>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="symbols">Symbol Library</TabsTrigger>
                  <TabsTrigger value="iso">ISO Documents</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="symbols" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
                  <div className="rounded-lg border border-border bg-background/90 p-6">
                    {symbols.map((symbol) => (
                      <div key={symbol.title}>
                        <div className="flex items-center gap-2">
                          <PiImagesDuotone className="size-6 text-primary" />
                          <h4 className="text-lg font-semibold">
                            {symbol.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {symbol.description}
                        </p>
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
                        <Button variant="outline" className="mt-6">
                          Browse symbol library
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-border bg-background/90 p-6">
                    <h4 className="text-lg font-semibold">Quick access</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Save time with the most requested symbol sets and
                      references.
                    </p>
                    <div className="mt-4 space-y-3">
                      {symbolHighlights.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
                        >
                          <span className="size-1.5 rounded-full bg-foreground/60" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="iso" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-6">
                  <div className="rounded-lg border border-border bg-background/90 p-6">
                    <div className="flex items-center gap-2">
                      <PiFileTextDuotone className="size-6 text-primary" />
                      <h4 className="text-lg font-semibold">
                        ISO Documents Repository
                      </h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Access the latest ISO standards used in medical device
                      labeling and compliance workflows.
                    </p>
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
                    <Button variant="outline" className="mt-6">
                      Request full ISO access
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border bg-background/90 p-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">Latest standards</h4>
                      <Badge variant="outline" className="text-xs">
                        Updated
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isoDocuments.map((doc) => (
                        <div
                          key={doc.title}
                          className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                        >
                          <h5 className="text-sm font-semibold">{doc.title}</h5>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {doc.description}
                          </p>
                          <Button variant="link" size="sm" className="mt-2 px-0">
                            View document
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
