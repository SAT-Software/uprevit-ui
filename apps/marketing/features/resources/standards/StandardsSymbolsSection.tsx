"use client";

import { MarketingSectionBadge } from "@/components/MarketingSectionBadge";
// import { Button } from "@uprevit/ui/components/ui/button";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { BookOpen02Icon } from "@hugeicons/core-free-icons";
// import { BookOpen02Icon, Link01Icon } from "@hugeicons/core-free-icons";
// import { Icon } from "@uprevit/ui/components/common/Icon";

// const symbols = [
//   {
//     title: "Global Compliance Iconography",
//     description:
//       "Ensure universal understanding with standardized medical device symbols aligned to global guidance.",
//     usage: "Reference sheets, cue cards, usage notes",
//   },
// ];

// const symbolHighlights = [
//   "Packaging & transport handling",
//   "Sterility and safety indicators",
//   "UDI and traceability markers",
//   "Region-specific compliance marks",
// ];

// const isoDocuments = [
//   {
//     title: "ISO 15223-1:2021",
//     description:
//       "Symbols to be used with medical devices, labels, and labeling.",
//   },
//   {
//     title: "ISO 7000:2014",
//     description: "Graphical symbols for use on equipment - Registered symbols.",
//   },
//   {
//     title: "ISO 7001:2008",
//     description: "Public information symbols.",
//   },
//   {
//     title: "ISO 7010:2019",
//     description: "Graphical symbols - Safety colors and safety signs.",
//   },
// ];

export default function StandardsSymbolsSection() {
  return (
    <div className="w-full mt-16 mb-24 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <div className="max-w-6xl mx-auto mb-10 px-2 md:px-2 lg:px-0">
        <MarketingSectionBadge icon={BookOpen02Icon} label="Standards & Symbols" />
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-medium leading-tightest">
            Standards, symbols, and references for global compliance
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-base md:text-lg font-normal text-muted-foreground/60 max-w-md leading-relaxed">
            Centralize symbol guidance and ISO references in one place so teams
            can label confidently across markets.
          </p>
        </div>
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

          <div className="p-1 bg-muted rounded-2xl border border-border shadow-bottom-lg">
            <div className="flex min-h-[28rem] items-center justify-center rounded-xl border border-border bg-background/80 shadow-none">
              <p className="text-2xl md:text-4xl lg:text-6xl font-normal text-muted-foreground/60 text-center">
                Coming soon...
              </p>
            </div>
          </div>

          {/* <div className="p-1 bg-muted rounded-2xl border border-border shadow-bottom-lg">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 rounded-xl border border-border bg-background/80 p-4 md:p-6 shadow-none">
                <div>
                  <h2 className="text-base md:text-lg font-semibold">
                    Standards & symbol library
                  </h2>
                  <p className="text-sm font-normal text-muted-foreground/60 leading-relaxed">
                    One consolidated view for ISO guidance and symbol usage
                    references.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <div className="rounded-xl border border-border bg-background/90 p-4 md:p-6 w-full shadow-none">
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
                          <p className="text-sm font-normal text-muted-foreground/60">
                            {symbol.description}
                          </p>
                        </div>
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3 md:p-4">
                          <Icon
                            icon={Link01Icon}
                            size={20}
                            strokeWidth={2}
                            className="text-muted-foreground shrink-0"
                          />
                          <span className="text-sm font-medium leading-snug">
                            {symbol.usage}
                          </span>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {symbolHighlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="rounded-xl border border-border bg-background/80 p-3 text-xs font-normal text-muted-foreground/60"
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

                <div className="rounded-xl flex flex-col gap-4 justify-between border border-border bg-background/90 p-4 md:p-6 w-full shadow-none">
                  <div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold">
                          ISO Documents Repository
                        </h4>
                      </div>
                      <p className="text-sm font-normal text-muted-foreground/60">
                        Access the latest ISO standards used in medical device
                        labeling and compliance workflows.
                      </p>
                    </div>
                    <div className="mt-6 space-y-3">
                      {isoDocuments.slice(0, 2).map((doc) => (
                        <div
                          key={doc.title}
                          className="rounded-xl border border-border p-4"
                        >
                          <h5 className="text-sm font-semibold">{doc.title}</h5>
                          <p className="mt-1 text-xs font-normal text-muted-foreground/60">
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
          </div> */}
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>
    </div>
  );
}
