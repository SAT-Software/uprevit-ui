"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import { ArrowRight02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.45, bounce: 0 };

const TABS = [
  { label: "Product Info", slug: "product-info", progress: 86, nav: 96 },
  { label: "Compliance", slug: "compliance", progress: 72, nav: 74 },
  { label: "Label Components", slug: "label-components", progress: 64, nav: 104 },
  { label: "Symbols & Graphics", slug: "symbols-graphics", progress: 92, nav: 112 },
  { label: "Product Specs", slug: "product-specs", progress: 58, nav: 84 },
  { label: "Operational Params", slug: "operational-params", progress: 44, nav: 98 },
  { label: "Label Tags", slug: "label-tags", progress: 78, nav: 68 },
] as const;

const BAR = "rounded-full bg-[#6A6A6A40] dark:bg-foreground/22";
const BAR_STRONG = "rounded-full bg-[#171717CC] dark:bg-foreground/75";
const BAR_SOFT = "rounded-full bg-[#6A6A6A24] dark:bg-foreground/12";
const LINE = "border-[#EFEFEF] dark:border-edge-1";
const CARD = "overflow-hidden rounded-[10px] border border-[#E9E9E9] bg-white dark:border-edge-2 dark:bg-surface-2";

function useTabCycle(enabled: boolean) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || !inView) return;
    const id = setInterval(() => setTick((value) => value + 1), 3400);
    return () => clearInterval(id);
  }, [enabled, inView]);

  return [ref, tick] as const;
}

function PageHeader({
  titleWidth,
  subtitleWidth,
  action,
}: {
  titleWidth: number;
  subtitleWidth: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className={cn("h-2 max-w-full", BAR_STRONG)} style={{ width: titleWidth }} />
        <span className={cn("h-1 max-w-full", BAR_SOFT)} style={{ width: subtitleWidth }} />
      </div>
      {action}
    </div>
  );
}

function SolidButton({ width = 62, muted = false }: { width?: number; muted?: boolean }) {
  return (
    <span
      className={cn(
        "h-5 shrink-0 rounded-[5px]",
        muted ? "bg-foreground/25 dark:bg-foreground/20" : "bg-foreground",
      )}
      style={{ width }}
    />
  );
}

function OutlineButton({ width = 52 }: { width?: number }) {
  return (
    <span
      className="h-5 shrink-0 rounded-[5px] border border-[#E4E4E4] bg-white dark:border-edge-2 dark:bg-surface-3/40"
      style={{ width }}
    />
  );
}

function TableToolbar() {
  return (
    <div className={cn("flex shrink-0 items-center justify-between gap-2 border-b px-2.5 py-2", LINE)}>
      <div className="flex items-center gap-1.5">
        <span className="flex h-[18px] w-28 items-center gap-1.5 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAFA] px-2 dark:border-edge-2 dark:bg-surface-3/40">
          <span className="size-2 rounded-full border border-[#6A6A6A55] dark:border-foreground/30" />
          <span className={cn("h-1 w-14", BAR_SOFT)} />
        </span>
        <span className="size-[18px] rounded-[5px] border border-[#E5E5E5] dark:border-edge-2" />
      </div>
      <span className="size-[18px] rounded-[5px] border border-[#E5E5E5] dark:border-edge-2" />
    </div>
  );
}

function TableFooter({ countWidth = 48 }: { countWidth?: number }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-between border-t px-2.5 py-1.5", LINE)}>
      <span className={cn("h-1", BAR_SOFT)} style={{ width: countWidth }} />
      <div className="flex items-center gap-1">
        <span className="size-3.5 rounded-[4px] border border-[#E5E5E5] dark:border-edge-2" />
        <span className="flex size-3.5 items-center justify-center rounded-[4px] border border-foreground/25 bg-[#F5F5F5] font-mono text-[7px] text-foreground dark:bg-surface-3">
          1
        </span>
        <span className="size-3.5 rounded-[4px] border border-[#E5E5E5] dark:border-edge-2" />
      </div>
    </div>
  );
}

function ProductInfoView() {
  const fields = [
    [48, 72],
    [52, 42],
    [60, 66],
    [56, 46],
    [58, 62],
    [46, 74],
    [40, 58],
    [50, 38],
  ];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] border border-[#E6E6E6] bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-3/50">
              <span className="size-3 rounded-[3px] border-[1.4px] border-foreground/75" />
            </span>
            <div className="flex flex-col gap-1.5">
              <span className={cn("h-2 w-32", BAR_STRONG)} />
              <span className={cn("h-1 w-48 max-w-full", BAR_SOFT)} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[46, 34, 62, 54].map((w, i) => (
              <span
                key={i}
                className="flex h-4 items-center gap-1 rounded-[4px] border border-[#EAEAEA] bg-[#FAFAFA] px-1.5 dark:border-edge-2 dark:bg-surface-3/40"
              >
                {i === 1 && <span className="size-1 rounded-full bg-foreground/50" />}
                <span className={cn("h-1", BAR)} style={{ width: w }} />
              </span>
            ))}
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <OutlineButton width={38} />
          <OutlineButton width={48} />
          <OutlineButton width={42} />
        </div>
      </div>

      <div className={cn("flex min-h-0 flex-1 flex-col", CARD)}>
        <div className={cn("flex shrink-0 items-center justify-between border-b px-3 py-2", LINE)}>
          <span className={cn("h-1.5 w-24", BAR_STRONG)} />
          <div className="flex items-center gap-1.5">
            <OutlineButton width={68} />
            <SolidButton width={66} />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 divide-x divide-[#EFEFEF] dark:divide-edge-1">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col divide-y divide-[#EFEFEF] dark:divide-edge-1">
              {fields.filter((_, idx) => idx % 2 === col).map(([labelW, valW], row) => (
                <div key={row} className="flex flex-1 items-center gap-2.5 px-3 py-1.5">
                  <span className="size-5 shrink-0 rounded-[5px] border border-[#EAEAEA] bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-3/40" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className={cn("h-1", BAR_SOFT)} style={{ width: `${labelW}%` }} />
                    <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${valW}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={cn("border-t bg-[#FAFAFA] px-3 py-1 dark:bg-surface-3/30", LINE)}>
          <span className={cn("block h-1 w-14", BAR_SOFT)} />
        </div>
        <div className={cn("grid shrink-0 grid-cols-2 divide-x divide-[#EFEFEF] border-t dark:divide-edge-1", LINE)}>
          {[
            [48, 56],
            [54, 64],
          ].map(([labelW, valW], i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2">
              <span className="size-5 shrink-0 rounded-[5px] border border-[#EAEAEA] bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-3/40" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className={cn("h-1", BAR_SOFT)} style={{ width: `${labelW}%` }} />
                <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${valW}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplianceView() {
  const standards = [
    [62, 86, 68],
    [68, 82, 74],
    [58, 90, 62],
    [66, 84, 56],
    [54, 78, 66],
    [60, 88, 60],
  ];
  const flags = [
    "bg-[#22C55E55]",
    "bg-[#EF444455]",
    "bg-[#3B82F655]",
    "bg-[#EF444455]",
    "bg-[#3B82F655]",
    "bg-[#3B82F655]",
    "bg-[#17171738]",
    "bg-[#3B82F655]",
    "bg-[#3B82F655]",
    "bg-[#F59E0B66]",
    "bg-[#3B82F655]",
    "bg-[#22C55E55]",
  ];

  return (
    <div className="flex h-full flex-col gap-2.5">
      <PageHeader titleWidth={136} subtitleWidth={210} />

      <div className={cn("flex flex-[1.15] flex-col", CARD)}>
        <div className={cn("flex shrink-0 items-center justify-between border-b px-3 py-1.5", LINE)}>
          <span className={cn("h-1.5 w-24", BAR_STRONG)} />
          <SolidButton width={54} />
        </div>
        <div className="grid flex-1 grid-cols-2 sm:grid-cols-3">
          {standards.map(([t, d1, d2], i) => (
            <div
              key={i}
              className={cn(
                "flex items-start justify-between gap-2 border-b border-r p-2.5",
                LINE,
                i >= 4 && "hidden sm:flex",
              )}
            >
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <span className="mt-0.5 size-4 shrink-0 rounded-[4px] border border-[#E8E8E8] bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-3/40" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${t}%` }} />
                  <span className={cn("h-1", BAR_SOFT)} style={{ width: `${d1}%` }} />
                  <span className={cn("h-1", BAR_SOFT)} style={{ width: `${d2}%` }} />
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-1 sm:flex">
                <span className="size-3 rounded-[3px] border border-[#EAEAEA] dark:border-edge-2" />
                <span className="size-3 rounded-[3px] border border-[#EAEAEA] dark:border-edge-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col", CARD)}>
        <div className={cn("flex shrink-0 items-center justify-between border-b px-3 py-1.5", LINE)}>
          <span className={cn("h-1.5 w-16", BAR_STRONG)} />
          <OutlineButton width={64} />
        </div>
        <div className="grid flex-1 grid-cols-2 sm:grid-cols-4">
          {flags.map((tint, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 border-b border-r px-2.5 py-1.5",
                LINE,
                i >= 6 && "hidden sm:flex",
              )}
            >
              <span className={cn("h-2.5 w-3.5 shrink-0 rounded-[2px]", tint)} />
              <span className={cn("h-1 w-3 shrink-0", BAR_SOFT)} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className={cn("h-1.5 w-[72%]", BAR_STRONG)} />
                <span className={cn("h-1 w-[50%]", BAR_SOFT)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabelComponentsView() {
  const rows = [
    { tags: [24, 24], desc: 84, dim: 34, type: 32, dir: 28 },
    { tags: [28], desc: 76, dim: 34, type: 32, dir: 22 },
    { tags: [24, 26], desc: 88, dim: 30, type: 22, dir: 28 },
    { tags: [18], desc: 72, dim: 36, type: 32, dir: 10 },
    { tags: [22], desc: 82, dim: 32, type: 32, dir: 28 },
    { tags: [28], desc: 90, dim: 36, type: 22, dir: 22 },
  ];

  return (
    <div className="flex h-full flex-col gap-2.5">
      <PageHeader titleWidth={128} subtitleWidth={220} action={<SolidButton width={64} />} />
      <div className={cn("flex min-h-0 flex-1 flex-col", CARD)}>
        <TableToolbar />
        <div className={cn("grid shrink-0 grid-cols-[26px_74px_62px_1fr_44px] items-center gap-2 border-b bg-[#FAFAFA] px-2.5 py-1.5 sm:grid-cols-[26px_74px_62px_1fr_46px_42px_36px_14px] dark:bg-surface-3/30", LINE)}>
          <span className={cn("h-1 w-5", BAR_SOFT)} />
          <span className={cn("h-1 w-11", BAR_SOFT)} />
          <span className={cn("h-1 w-12", BAR_SOFT)} />
          <span className={cn("h-1 w-14", BAR_SOFT)} />
          <span className={cn("h-1 w-10", BAR_SOFT)} />
          <span className={cn("hidden h-1 w-9 sm:block", BAR_SOFT)} />
          <span className={cn("hidden h-1 w-8 sm:block", BAR_SOFT)} />
          <span className="hidden sm:block" />
        </div>
        <div className="flex flex-1 flex-col divide-y divide-[#EFEFEF] dark:divide-edge-1">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="grid flex-1 grid-cols-[26px_74px_62px_1fr_44px] items-center gap-2 px-2.5 sm:grid-cols-[26px_74px_62px_1fr_46px_42px_36px_14px]"
            >
              <span className="flex size-5 items-center justify-center rounded-[5px] border border-[#E8E8E8] bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-3/40">
                <span className="h-2 w-2.5 rounded-[1px] border border-[#6A6A6A55] dark:border-foreground/30" />
              </span>
              <span className="flex items-center gap-1">
                {row.tags.map((w, t) => (
                  <span
                    key={t}
                    className="h-3.5 rounded-[3px] border border-[#E8E8E8] bg-[#F7F7F7] px-1 dark:border-edge-2 dark:bg-surface-3/60"
                    style={{ width: w }}
                  />
                ))}
              </span>
              <span className="flex h-3.5 w-14 items-center rounded-[4px] border border-[#EAEAEA] bg-[#FAFAFA] px-1.5 dark:border-edge-2 dark:bg-surface-3/40">
                <span className={cn("h-1 w-full", BAR)} />
              </span>
              <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${row.desc}%` }} />
              <span className={cn("h-1", BAR)} style={{ width: row.dim }} />
              <span className={cn("hidden h-1 sm:block", BAR_SOFT)} style={{ width: row.type }} />
              <span className={cn("hidden h-1 sm:block", BAR_SOFT)} style={{ width: row.dir }} />
              <span className="hidden justify-end gap-0.5 sm:flex">
                <span className="size-0.5 rounded-full bg-foreground/35" />
                <span className="size-0.5 rounded-full bg-foreground/35" />
                <span className="size-0.5 rounded-full bg-foreground/35" />
              </span>
            </div>
          ))}
        </div>
        <TableFooter countWidth={56} />
      </div>
    </div>
  );
}

function MiniSymbolGlyph({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <span className="rounded-[2px] border border-foreground/75 px-0.5 font-mono text-[6px] font-semibold leading-[9px] text-foreground/80">
        MD
      </span>
    );
  }
  if (kind === 1) {
    return (
      <span className="rounded-[2px] border border-foreground/75 px-0.5 font-mono text-[6px] font-semibold leading-[9px] text-foreground/80">
        EO
      </span>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/75">
      {kind === 2 && (
        <>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M4.2 11.8L11.8 4.2" />
        </>
      )}
      {kind === 3 && (
        <>
          <path d="M4 2.5H12M4 13.5H12M5 2.5L8 8L11 2.5M5 13.5L8 8L11 13.5" />
        </>
      )}
      {kind === 4 && <path d="M2.5 13V7L6 9.5V7L9.5 9.5V4H13.5V13H2.5Z" />}
    </svg>
  );
}

function SymbolsGraphicsView() {
  const rows = [
    { name: 46, ref: 34, textPresent: true, labels: [22, 26, 16] },
    { name: 62, ref: 36, textPresent: true, labels: [22, 26] },
    { name: 58, ref: 34, textPresent: false, labels: [22, 20] },
    { name: 54, ref: 34, textPresent: true, labels: [22, 26, 16] },
    { name: 40, ref: 32, textPresent: false, labels: [22, 26, 28] },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader titleWidth={132} subtitleWidth={224} action={<SolidButton width={58} />} />

      <div className={cn("flex shrink-0 items-center gap-4 border-b", LINE)}>
        {[38, 44, 38, 56].map((w, i) => (
          <div key={i} className="relative pb-1.5">
            <span className={cn("block h-1.5", i === 0 ? BAR_STRONG : BAR_SOFT)} style={{ width: w }} />
            {i === 0 && <span className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-foreground" />}
          </div>
        ))}
      </div>

      <div className={cn("flex min-h-0 flex-1 flex-col", CARD)}>
        <TableToolbar />
        <div className={cn("grid shrink-0 grid-cols-[28px_1fr_48px_92px] items-center gap-2 border-b bg-[#FAFAFA] px-2.5 py-1.5 sm:grid-cols-[28px_1fr_56px_118px_14px] dark:bg-surface-3/30", LINE)}>
          <span className={cn("h-1 w-5", BAR_SOFT)} />
          <span className={cn("h-1 w-14", BAR_SOFT)} />
          <span className={cn("h-1 w-10", BAR_SOFT)} />
          <span className={cn("h-1 w-16", BAR_SOFT)} />
          <span className="hidden sm:block" />
        </div>
        <div className="flex flex-1 flex-col divide-y divide-[#EFEFEF] dark:divide-edge-1">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="grid flex-1 grid-cols-[28px_1fr_48px_92px] items-center gap-2 px-2.5 sm:grid-cols-[28px_1fr_56px_118px_14px]"
            >
              <span className="flex size-5 items-center justify-center rounded-[5px] border border-[#E5E5E5] bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-3/40">
                <MiniSymbolGlyph kind={idx} />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${row.name}%` }} />
                <span className={cn("h-1", BAR_SOFT)} style={{ width: `${row.ref}%` }} />
              </div>
              <span
                className={cn(
                  "flex h-4 w-7 items-center justify-center rounded-[4px] border",
                  row.textPresent
                    ? "border-primary/25 bg-primary/10 dark:border-primary/35 dark:bg-primary/20"
                    : "border-[#E8E8E8] bg-[#F5F5F5] dark:border-edge-2 dark:bg-surface-3/60",
                )}
              >
                <span className={cn("h-1 w-3 rounded-full", row.textPresent ? "bg-primary/70" : "bg-[#6A6A6A45]")} />
              </span>
              <span className="flex items-center gap-1">
                {row.labels.map((w, l) => (
                  <span
                    key={l}
                    className="h-3.5 rounded-[3px] border border-[#E8E8E8] bg-[#F7F7F7] dark:border-edge-2 dark:bg-surface-3/60"
                    style={{ width: w }}
                  />
                ))}
              </span>
              <span className="hidden justify-end gap-0.5 sm:flex">
                <span className="size-0.5 rounded-full bg-foreground/35" />
                <span className="size-0.5 rounded-full bg-foreground/35" />
                <span className="size-0.5 rounded-full bg-foreground/35" />
              </span>
            </div>
          ))}
        </div>
        <TableFooter countWidth={50} />
      </div>
    </div>
  );
}

function WorkbookChrome({
  saved,
  sheetWidths,
  children,
}: {
  saved: boolean;
  sheetWidths: [number, number, number];
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader
        titleWidth={saved ? 142 : 136}
        subtitleWidth={210}
        action={
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <span className="flex items-center gap-1 pr-1">
              <span className={cn("size-1.5 rounded-full", saved ? "bg-emerald-500" : "bg-amber-500")} />
              <span className={cn("h-1 w-10", BAR_SOFT)} />
            </span>
            <OutlineButton width={42} />
            <SolidButton width={40} muted={saved} />
          </div>
        }
      />

      <div className={cn("flex min-h-0 flex-1 flex-col", CARD)}>
        <div className={cn("flex shrink-0 items-center justify-between gap-2 border-b bg-[#FAFAFA] px-2.5 py-1.5 dark:bg-surface-3/30", LINE)}>
          <div className="flex items-center gap-1">
            {[16, 14, 14, 22, 16, 16].map((w, i) => (
              <span
                key={i}
                className={cn(
                  "h-4 rounded-[4px] border border-[#E6E6E6] bg-white dark:border-edge-2 dark:bg-surface-2",
                  i === 0 && "bg-[#EFEFEF] dark:bg-surface-3",
                )}
                style={{ width: w }}
              />
            ))}
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <span className="h-4 w-24 rounded-[4px] border border-[#E6E6E6] bg-white dark:border-edge-2 dark:bg-surface-2" />
            <span className="size-4 rounded-[4px] border border-[#E6E6E6] bg-white dark:border-edge-2 dark:bg-surface-2" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>

        <div className={cn("flex shrink-0 items-center gap-1 border-t bg-[#FAFAFA] px-2 py-1 dark:bg-surface-3/30", LINE)}>
          {sheetWidths.map((w, i) => (
            <span
              key={i}
              className={cn(
                "flex h-4 items-center rounded-[4px] px-2",
                i === 0
                  ? "border border-[#E5E5E5] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.03)] dark:border-edge-2 dark:bg-surface-2"
                  : "opacity-60",
              )}
            >
              <span className={cn("h-1", i === 0 ? BAR_STRONG : BAR_SOFT)} style={{ width: w }} />
            </span>
          ))}
          <span className="flex size-4 items-center justify-center rounded-[4px] border border-[#E6E6E6] font-mono text-[8px] text-muted-foreground dark:border-edge-2">
            +
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductSpecsView() {
  const rows = [
    { param: 76, spec: 54, unit: 40, tol: 52, method: 78, tint: "focus" },
    { param: 68, spec: 32, unit: 40, tol: 48, method: 72, tint: "none" },
    { param: 72, spec: 28, unit: 34, tol: 42, method: 76, tint: "none" },
    { param: 80, spec: 68, unit: 24, tol: 62, method: 80, tint: "blue" },
    { param: 74, spec: 26, unit: 34, tol: 44, method: 68, tint: "none" },
    { param: 64, spec: 46, unit: 22, tol: 50, method: 82, tint: "green" },
    { param: 70, spec: 64, unit: 24, tol: 48, method: 74, tint: "none" },
  ] as const;

  return (
    <WorkbookChrome saved={false} sheetWidths={[44, 52, 58]}>
      <div className={cn("grid shrink-0 grid-cols-[20px_1.3fr_1fr_0.5fr_0.9fr] border-b bg-[#F7F7F7] sm:grid-cols-[20px_1.3fr_1fr_0.45fr_0.85fr_1.1fr] dark:bg-surface-3/40", LINE)}>
        {["#", "Parameter", "Spec", "Unit", "Tol", "Method"].map((col, idx) => (
          <div
            key={col}
            className={cn(
              "flex h-5 items-center border-r px-2 last:border-r-0",
              LINE,
              idx === 5 && "hidden sm:flex",
            )}
          >
            <span className={cn("h-1", BAR)} style={{ width: idx === 0 ? 6 : 26 + (idx % 3) * 10 }} />
          </div>
        ))}
      </div>
      <div className={cn("grid shrink-0 grid-cols-[20px_1.3fr_1fr_0.5fr_0.9fr] border-b bg-[#FCFCFC] sm:grid-cols-[20px_1.3fr_1fr_0.45fr_0.85fr_1.1fr] dark:bg-surface-2", LINE)}>
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className={cn(
              "flex h-4 items-center border-r px-2 last:border-r-0",
              LINE,
              idx === 5 && "hidden sm:flex",
            )}
          >
            {idx > 0 && <span className={cn("h-1 w-8", BAR_SOFT)} />}
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col divide-y divide-[#EFEFEF] dark:divide-edge-1">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid flex-1 grid-cols-[20px_1.3fr_1fr_0.5fr_0.9fr] sm:grid-cols-[20px_1.3fr_1fr_0.45fr_0.85fr_1.1fr]"
          >
            <div className={cn("flex items-center justify-center border-r font-mono text-[8px] text-placeholder", LINE)}>
              {idx + 1}
            </div>
            <div className={cn("flex items-center border-r px-2", LINE)}>
              <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${row.param}%` }} />
            </div>
            <div
              className={cn(
                "relative flex items-center border-r px-2",
                LINE,
                row.tint === "focus" && "ring-1 ring-inset ring-foreground/85 bg-white dark:bg-surface-2",
                row.tint === "blue" && "bg-blue-500/[0.08] dark:bg-blue-400/15",
                row.tint === "green" && "bg-emerald-500/[0.08] dark:bg-emerald-400/15",
              )}
            >
              <span
                className={cn(
                  "h-1",
                  row.tint === "blue"
                    ? "rounded-full bg-blue-600/60 dark:bg-blue-300/70"
                    : row.tint === "green"
                      ? "rounded-full bg-emerald-600/60 dark:bg-emerald-300/70"
                      : BAR,
                )}
                style={{ width: `${row.spec}%` }}
              />
            </div>
            <div className={cn("flex items-center border-r px-2", LINE)}>
              <span className={cn("h-1", BAR_SOFT)} style={{ width: `${row.unit}%` }} />
            </div>
            <div className={cn("flex items-center border-r px-2 sm:border-r", LINE)}>
              <span className={cn("h-1", BAR)} style={{ width: `${row.tol}%` }} />
            </div>
            <div className="hidden items-center px-2 sm:flex">
              <span className={cn("h-1", BAR_SOFT)} style={{ width: `${row.method}%` }} />
            </div>
          </div>
        ))}
      </div>
    </WorkbookChrome>
  );
}

function OperationalParamsView() {
  const rows = [
    { param: 64, range: 52, storage: 48, unit: 34, status: "verified" },
    { param: 58, range: 48, storage: 54, unit: 46, status: "verified" },
    { param: 82, range: 50, storage: 16, unit: 30, status: "verified", focus: true },
    { param: 62, range: 36, storage: 16, unit: 54, status: "pending" },
    { param: 76, range: 26, storage: 16, unit: 48, status: "verified" },
    { param: 70, range: 64, storage: 46, unit: 36, status: "review" },
    { param: 66, range: 38, storage: 16, unit: 42, status: "verified" },
  ] as const;

  return (
    <WorkbookChrome saved sheetWidths={[56, 48, 52]}>
      <div className={cn("grid shrink-0 grid-cols-[20px_1.35fr_0.95fr_0.45fr_0.75fr] border-b bg-[#F7F7F7] sm:grid-cols-[20px_1.35fr_0.9fr_0.75fr_0.45fr_0.75fr] dark:bg-surface-3/40", LINE)}>
        {["#", "Parameter", "Range", "Storage", "Unit", "Status"].map((col, idx) => (
          <div
            key={col}
            className={cn(
              "flex h-5 items-center border-r px-2 last:border-r-0",
              LINE,
              idx === 3 && "hidden sm:flex",
            )}
          >
            <span className={cn("h-1", BAR)} style={{ width: idx === 0 ? 6 : 24 + (idx % 3) * 10 }} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col divide-y divide-[#EFEFEF] dark:divide-edge-1">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid flex-1 grid-cols-[20px_1.35fr_0.95fr_0.45fr_0.75fr] sm:grid-cols-[20px_1.35fr_0.9fr_0.75fr_0.45fr_0.75fr]"
          >
            <div className={cn("flex items-center justify-center border-r font-mono text-[8px] text-placeholder", LINE)}>
              {idx + 1}
            </div>
            <div className={cn("flex items-center border-r px-2", LINE)}>
              <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${row.param}%` }} />
            </div>
            <div
              className={cn(
                "flex items-center border-r px-2",
                LINE,
                "focus" in row && row.focus && "ring-1 ring-inset ring-foreground/85 bg-white dark:bg-surface-2",
              )}
            >
              <span className={cn("h-1", BAR)} style={{ width: `${row.range}%` }} />
            </div>
            <div className={cn("hidden items-center border-r px-2 sm:flex", LINE)}>
              <span className={cn("h-1", BAR_SOFT)} style={{ width: `${row.storage}%` }} />
            </div>
            <div className={cn("flex items-center border-r px-2", LINE)}>
              <span className={cn("h-1", BAR_SOFT)} style={{ width: `${row.unit}%` }} />
            </div>
            <div
              className={cn(
                "flex items-center px-2",
                row.status === "verified" && "bg-emerald-500/[0.08] dark:bg-emerald-400/15",
                row.status === "pending" && "bg-amber-500/[0.1] dark:bg-amber-400/15",
                row.status === "review" && "bg-blue-500/[0.08] dark:bg-blue-400/15",
              )}
            >
              <span
                className={cn(
                  "h-1.5 rounded-full",
                  row.status === "verified" && "w-[62%] bg-emerald-600/60 dark:bg-emerald-300/70",
                  row.status === "pending" && "w-[74%] bg-amber-600/65 dark:bg-amber-300/70",
                  row.status === "review" && "w-[56%] bg-blue-600/60 dark:bg-blue-300/70",
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </WorkbookChrome>
  );
}

function LabelTagsView() {
  const legendItems = [
    { color: "border-violet-500", width: 76, selected: false },
    { color: "border-blue-500", width: 82, selected: true },
    { color: "border-emerald-500", width: 68, selected: false },
    { color: "border-amber-500", width: 78, selected: false },
  ];
  const barcodeBars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2];

  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader titleWidth={92} subtitleWidth={204} action={<SolidButton width={54} />} />

      <div className={cn("flex shrink-0 items-center justify-between gap-2 border-b pb-1.5", LINE)}>
        <div className="flex items-center gap-3.5">
          {[28, 30, 38].map((w, i) => (
            <div key={i} className="relative pb-1">
              <span className={cn("block h-1.5", i === 0 ? BAR_STRONG : BAR_SOFT)} style={{ width: w }} />
              {i === 0 && <span className="absolute inset-x-0 bottom-[-6px] h-[1.5px] rounded-full bg-foreground" />}
            </div>
          ))}
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          {[true, false].map((activeCard, i) => (
            <span
              key={i}
              className={cn(
                "flex h-5 items-center gap-1.5 rounded-[5px] border px-1.5",
                activeCard
                  ? "border-foreground/25 bg-[#F7F7F7] dark:border-edge-3 dark:bg-surface-3/60"
                  : "border-[#EAEAEA] bg-white dark:border-edge-2 dark:bg-surface-2",
              )}
            >
              <span className="h-2.5 w-3.5 rounded-[2px] border border-[#D4D4D4] dark:border-edge-3" />
              <span className={cn("h-1 w-10", activeCard ? BAR_STRONG : BAR_SOFT)} />
            </span>
          ))}
          <SolidButton width={36} />
        </div>
      </div>

      <div className={cn("flex min-h-0 flex-1", CARD)}>
        <div className="relative flex min-w-0 flex-[2.1] flex-col bg-[#FAFAFA] dark:bg-surface-1/60">
          <div className={cn("flex shrink-0 items-center justify-between border-b bg-white px-2.5 py-1.5 dark:bg-surface-2", LINE)}>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-3.5 rounded-[3px] border border-[#EAEAEA] dark:border-edge-2" />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="size-3.5 rounded-[3px] border border-[#EAEAEA] dark:border-edge-2" />
              ))}
              <span className="size-3 rounded-full bg-violet-500" />
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-3">
            <div className="w-full max-w-[232px] rounded-[9px] border border-[#E6E6E6] bg-white p-2.5 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2">
              <div className="flex items-start justify-between gap-2 pb-2">
                <div className="flex flex-col gap-1">
                  <span className={cn("h-1.5 w-24", BAR_STRONG)} />
                  <span className={cn("h-1 w-32", BAR_SOFT)} />
                </div>
                <span className="flex h-4 w-14 shrink-0 items-center justify-center rounded-[4px] border border-violet-500/80 bg-violet-500/[0.06] px-1">
                  <span className="h-1 w-9 rounded-full bg-violet-600/55 dark:bg-violet-300/70" />
                </span>
              </div>

              <div className="grid grid-cols-[1.2fr_1fr] gap-1.5 border-t border-[#EFEFEF] pt-2 dark:border-edge-1">
                <div className="flex h-9 items-center justify-center gap-1 rounded-[5px] border border-blue-500/80 bg-blue-500/[0.06] px-1.5">
                  <span className="h-2.5 w-7 rounded-[2px] border border-foreground/55" />
                  <span className="h-2.5 w-3.5 rounded-[2px] border border-foreground/55" />
                  <span className="size-2.5 rounded-full border border-foreground/55" />
                </div>
                <div className="flex h-9 flex-col justify-center gap-1 rounded-[5px] border border-emerald-500/80 bg-emerald-500/[0.06] px-1.5">
                  <span className="h-1 w-[78%] rounded-full bg-emerald-700/45 dark:bg-emerald-300/60" />
                  <span className="h-1 w-[62%] rounded-full bg-emerald-700/35 dark:bg-emerald-300/50" />
                  <span className="h-1 w-[54%] rounded-full bg-emerald-700/25 dark:bg-emerald-300/40" />
                </div>
              </div>

              <div className="mt-1.5 flex h-8 items-center justify-center gap-[1.5px] rounded-[5px] border border-amber-500/80 bg-amber-500/[0.07] px-2.5">
                {barcodeBars.map((w, i) => (
                  <span
                    key={i}
                    className="h-4 bg-foreground/80"
                    style={{ width: w }}
                  />
                ))}
              </div>
            </div>

            <span className="absolute bottom-2 right-2 flex h-4 items-center rounded-[4px] border border-[#E5E5E5] bg-white px-1.5 font-mono text-[8px] text-muted-foreground dark:border-edge-2 dark:bg-surface-2">
              100%
            </span>
          </div>
        </div>

        <div className={cn("hidden flex-1 flex-col justify-between border-l bg-white p-2.5 sm:flex dark:bg-surface-2", LINE)}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-11", BAR_STRONG)} />
                <span className="flex size-3.5 items-center justify-center rounded-full bg-[#F2F2F2] font-mono text-[7px] text-muted-foreground dark:bg-surface-3">
                  4
                </span>
              </div>
              <OutlineButton width={28} />
            </div>
            {legendItems.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 rounded-[6px] border px-2 py-2",
                  item.selected
                    ? "border-[#DCDCDC] bg-[#F5F5F5] dark:border-edge-3 dark:bg-surface-3/70"
                    : "border-[#EFEFEF] bg-white dark:border-edge-1 dark:bg-surface-2",
                )}
              >
                <span className={cn("h-2.5 w-4 shrink-0 rounded-[3px] border-[1.5px]", item.color)} />
                <span className={cn("h-1.5", BAR_STRONG)} style={{ width: `${item.width}%` }} />
              </div>
            ))}
          </div>

          <div className={cn("flex items-center justify-between border-t pt-2", LINE)}>
            <div className="flex flex-col gap-1">
              <span className={cn("h-1.5 w-14", BAR_STRONG)} />
              <span className={cn("h-1 w-20", BAR_SOFT)} />
            </div>
            <span className="flex h-3.5 w-6 items-center justify-end rounded-full bg-foreground p-0.5">
              <span className="size-2.5 rounded-full bg-background" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_VIEWS = [
  ProductInfoView,
  ComplianceView,
  LabelComponentsView,
  SymbolsGraphicsView,
  ProductSpecsView,
  OperationalParamsView,
  LabelTagsView,
] as const;

function RecordBrowser({ reduceMotion }: { reduceMotion: boolean }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [ref, tick] = useTabCycle(!reduceMotion && picked === null && !isHovered && !isFocused);
  const active = picked ?? tick % TABS.length;
  const tab = TABS[active];
  const ActiveView = TAB_VIEWS[active];
  const stripRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const strip = stripRef.current;
    const button = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !button || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({
      left: button.offsetLeft - strip.clientWidth / 2 + button.offsetWidth / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      className="flex w-full flex-col rounded-[20px] border border-border bg-frame-surface px-1.5 pb-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_-18px_rgba(0,0,0,0.08)] sm:px-2 sm:pb-2 dark:border-edge-2 dark:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-3 px-1.5 pt-2 sm:px-2">
        <div aria-hidden="true" className="hidden shrink-0 gap-1.5 sm:flex">
          <span className="size-[9px] rounded-full bg-[#FF5F57]" />
          <span className="size-[9px] rounded-full bg-[#FEBC2E]" />
          <span className="size-[9px] rounded-full bg-[#28C840]" />
        </div>
        <div
          ref={stripRef}
          role="group"
          aria-label="Product record tabs"
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [mask-image:linear-gradient(90deg,#000_88%,transparent)] [scrollbar-width:none] lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => setPicked(index)}
                className="relative flex h-[26px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
              >
                {isActive && (
                  <motion.span
                    layoutId="record-tab-pill"
                    transition={{ type: "spring", duration: 0.22, bounce: 0 }}
                    className="absolute inset-0 rounded-full bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-3 dark:shadow-[0_0_0_1px_var(--edge-2)]"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative size-1.5 shrink-0 rounded-full transition-colors duration-200",
                    isActive ? "bg-foreground" : "bg-[#6A6A6A52] dark:bg-foreground/25",
                  )}
                />
                <span
                  className={cn(
                    "relative whitespace-nowrap font-ui text-[11px] font-medium leading-[15px] transition-colors duration-200",
                    isActive ? "text-foreground" : "text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
                  )}
                >
                  {item.label}
                </span>
                <Icon
                  icon={Cancel01Icon}
                  size={9}
                  strokeWidth={2.2}
                  className={cn("relative shrink-0 text-foreground", isActive ? "opacity-45" : "opacity-30")}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="flex items-center gap-2 p-1.5 sm:p-2">
        <div className="flex h-[26px] min-w-0 flex-1 items-center overflow-hidden rounded-[14px] bg-tile px-3">
          <span className="truncate font-mono text-[11px] leading-4 text-[#6A6A6A] dark:text-muted-foreground">
            <span className="hidden sm:inline">app.uprevit.com</span>/products/PX-2042/
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={tab.slug}
                className="inline-block text-foreground/80"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(3px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(3px)" }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {tab.slug}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-tile text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <Icon icon={ArrowRight02Icon} size={12} strokeWidth={2} />
        </span>
      </div>

      <div
        aria-hidden="true"
        className="flex h-[340px] overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white sm:h-[404px] dark:border-edge-2 dark:bg-surface-2"
      >
        <div className="hidden w-[212px] shrink-0 flex-col justify-between border-r border-[#EFEFEF] bg-[#FAFAFA] px-3.5 py-4 md:flex dark:border-edge-1 dark:bg-surface-1/50">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="size-5 shrink-0 rounded-sm bg-foreground" />
              <div className="flex flex-1 flex-col gap-[5px]">
                <span className="h-1.5 w-[72%] rounded-full bg-[#6A6A6A4D] dark:bg-foreground/25" />
                <span className={cn("h-1 w-[48%]", BAR_SOFT)} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {TABS.map((item, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    tabIndex={-1}
                    onClick={() => setPicked(index)}
                    className="relative flex h-[26px] cursor-pointer items-center justify-between px-2.5 text-left"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="record-tab-row"
                        transition={SPRING}
                        className="absolute inset-0 rounded-md bg-file-frame dark:bg-surface-3"
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 rounded-full transition-colors duration-300",
                          isActive ? "bg-foreground" : "bg-[#6A6A6A33] dark:bg-foreground/20",
                        )}
                      />
                      <span
                        className={cn(
                          "h-[5px] rounded-full transition-colors duration-300",
                          isActive ? "bg-foreground" : "bg-[#6A6A6A33] dark:bg-foreground/20",
                        )}
                        style={{ width: item.nav }}
                      />
                    </span>
                    <span
                      className={cn(
                        "relative size-1.5 rounded-full transition-colors duration-300",
                        isActive ? "bg-stage-released" : "bg-stage-released/45",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-card p-2.5 shadow-[inset_0_0_0_1px_rgba(23,23,23,0.06)] dark:bg-surface-3/60 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between">
              <span className="h-1 w-16 rounded-full bg-[#6A6A6A40] dark:bg-foreground/20" />
              <span className="font-mono text-[9px] leading-3 text-foreground tabular-nums">
                {tab.progress}%
              </span>
            </div>
            <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#6A6A6A1F] dark:bg-foreground/10">
              <motion.div
                className="h-full w-full origin-left rounded-full bg-foreground"
                initial={false}
                animate={{ scaleX: tab.progress / 100 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-4 sm:px-6 sm:py-5">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={tab.slug}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="h-full min-h-0"
            >
              <ActiveView />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function PlatformRecordTabsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="platform-records-heading" className="contents">
        <SectionHeader
          id="platform-records-heading"
          anchorId="records"
          title="Seven structured tabs."
          mutedTitle="One source of truth."
        >
          Every device record follows the same seven structured sections—from
          UDI and compliance standards to ISO symbols and annotated label
          tags—with live completion tracking per tab.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <DotsBackdrop className="opacity-30" />
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <RecordBrowser reduceMotion={reduceMotion} />
          </motion.div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
