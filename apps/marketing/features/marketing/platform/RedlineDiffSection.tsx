"use client";

import * as React from "react";
import { MotionConfig, motion } from "motion/react";
import { FileAddIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { usePlayback } from "@/features/marketing/landing-page/usePlayback";

const SPRING = { type: "spring" as const, duration: 0.45, bounce: 0 };

type DiffTone = "removed" | "updated" | "added";
type FilterKey = "all" | DiffTone;
type Part = string | { text: string };
type DiffCellData = { line: number; label: string; parts: Part[]; tone?: DiffTone } | null;

const TONE_STYLES: Record<
  DiffTone,
  { row: string; line: string; chip: string; text: string; marker: string; srLabel: string; strike?: boolean }
> = {
  removed: {
    row: "border-l-diff-removed/60 bg-diff-removed-soft/70",
    line: "text-diff-removed",
    chip: "bg-diff-removed-soft",
    text: "text-diff-removed",
    marker: "−",
    srLabel: "Removed:",
    strike: true,
  },
  updated: {
    row: "border-l-diff-updated/60 bg-diff-updated-soft/70",
    line: "text-diff-updated",
    chip: "bg-diff-updated-soft",
    text: "text-diff-updated",
    marker: "~",
    srLabel: "Updated:",
  },
  added: {
    row: "border-l-diff-added/60 bg-diff-added-soft/70",
    line: "text-diff-added",
    chip: "bg-diff-added-soft",
    text: "text-diff-added",
    marker: "+",
    srLabel: "Added:",
  },
};

const DIFF_ROWS: { left: DiffCellData; right: DiffCellData; kind?: DiffTone; delay: number }[] = [
  {
    left: { line: 1, label: "Device name", parts: ["IV Extension Set, 150 cm"] },
    right: { line: 1, label: "Device name", parts: ["IV Extension Set, 150 cm"] },
    delay: 0,
  },
  {
    left: { line: 2, label: "REF", parts: ["PX-2042"] },
    right: { line: 2, label: "REF", parts: ["PX-2042"] },
    delay: 0,
  },
  {
    left: {
      line: 3,
      label: "Sterilization",
      parts: ["Sterilized using", { text: "ethylene oxide" }],
      tone: "removed",
    },
    right: {
      line: 3,
      label: "Sterilization",
      parts: ["Sterilized using", { text: "irradiation" }],
      tone: "updated",
    },
    kind: "updated",
    delay: 0.45,
  },
  {
    left: { line: 4, label: "Shelf life", parts: ["Use within", { text: "3" }, "years"], tone: "removed" },
    right: { line: 4, label: "Shelf life", parts: ["Use within", { text: "5" }, "years"], tone: "updated" },
    kind: "updated",
    delay: 1.2,
  },
  {
    left: null,
    right: { line: 5, label: "Max. pressure", parts: [{ text: "325 kPa" }], tone: "added" },
    kind: "added",
    delay: 1.95,
  },
  {
    left: { line: 5, label: "Priming vol.", parts: [{ text: "2.1 mL" }], tone: "removed" },
    right: null,
    kind: "removed",
    delay: 2.7,
  },
  {
    left: { line: 6, label: "Latex", parts: ["Not made with natural rubber latex"] },
    right: { line: 6, label: "Latex", parts: ["Not made with natural rubber latex"] },
    delay: 0,
  },
  {
    left: { line: 7, label: "Storage", parts: ["Store between 5 °C and 40 °C"] },
    right: { line: 7, label: "Storage", parts: ["Store between 5 °C and 40 °C"] },
    delay: 0,
  },
];

const SUMMARY_FILTERS: { key: DiffTone; label: string; dot: string }[] = [
  { key: "updated", label: "2 updated", dot: "bg-stage-released" },
  { key: "added", label: "1 added", dot: "bg-stage-submitted" },
  { key: "removed", label: "1 removed", dot: "bg-destructive" },
];

const HATCH =
  "bg-subtle bg-[repeating-linear-gradient(135deg,rgba(23,23,23,0.04)_0px,rgba(23,23,23,0.04)_1px,transparent_1px,transparent_6px)] dark:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_6px)]";

function DiffCell({
  cell,
  on,
  delay,
  dimmed,
}: {
  cell: DiffCellData;
  on: boolean;
  delay: number;
  dimmed: boolean;
}) {
  if (!cell) {
    return (
      <div
        className={cn(
          "h-[32px] w-[424px] shrink-0 transition-opacity duration-200",
          HATCH,
          dimmed && "opacity-35",
        )}
      />
    );
  }
  const tone = cell.tone ? TONE_STYLES[cell.tone] : null;

  return (
    <div
      className={cn(
        "relative flex h-[32px] w-[424px] shrink-0 items-center gap-2.5 border-l-2 border-l-transparent pl-2.5 pr-3 transition-opacity duration-200",
        dimmed && "opacity-35",
      )}
    >
      {tone && (
        <motion.span
          aria-hidden="true"
          className={cn("absolute inset-y-0 -left-0.5 right-0 border-l-2", tone.row)}
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: on ? 0.35 : 0.22, delay: on ? delay : 0 }}
        />
      )}
      <span
        className={cn(
          "relative w-[22px] shrink-0 text-right font-mono text-[10px] font-medium leading-[14px] tabular-nums transition-colors duration-300",
          tone && on ? tone.line : "text-muted-foreground",
        )}
        style={{ transitionDelay: on ? `${delay}s` : "0s" }}
      >
        {tone && on && (
          <>
            <span aria-hidden="true" className="mr-0.5 font-semibold">
              {tone.marker}
            </span>
            <span className="sr-only">{tone.srLabel} </span>
          </>
        )}
        {cell.line}
      </span>
      <span className="relative w-[88px] shrink-0 whitespace-nowrap font-ui text-[11px] leading-[14px] text-muted-foreground">
        {cell.label}
      </span>
      <span className="relative flex min-w-0 items-center gap-[3px]">
        {cell.parts.map((part, index) =>
          typeof part === "string" ? (
            <span
              key={index}
              className="whitespace-nowrap font-ui text-[12px] leading-[18px] text-foreground"
            >
              {part}
            </span>
          ) : (
            <span
              key={index}
              className="relative whitespace-nowrap rounded-[3px] px-[3px] font-ui text-[12px] leading-[18px]"
            >
              <motion.span
                aria-hidden="true"
                className={cn("absolute inset-0 rounded-[3px]", tone?.chip)}
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.92 }}
                transition={on ? { ...SPRING, delay: delay + 0.1 } : { duration: 0.2 }}
              />
              <span
                className={cn(
                  "relative transition-colors duration-300",
                  on && tone ? tone.text : "text-foreground",
                )}
                style={{ transitionDelay: on ? `${delay + 0.1}s` : "0s" }}
              >
                {part.text}
              </span>
              {tone?.strike && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-[3px] top-1/2 h-px origin-left bg-destructive-strong"
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={
                    on
                      ? { duration: 0.34, ease: [0.645, 0.045, 0.355, 1], delay: delay + 0.22 }
                      : { duration: 0.15 }
                  }
                />
              )}
            </span>
          ),
        )}
      </span>
    </div>
  );
}

function RedlineDiffShowcase({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on] = usePlayback(reduceMotion, 11800);
  const [activeFilter, setActiveFilter] = React.useState<FilterKey>("all");
  const done = 3.25;

  const toggleFilter = (key: DiffTone) => {
    setActiveFilter((prev) => (prev === key ? "all" : key));
  };

  return (
    <ScaledCanvas ref={ref} width={1140} height={410} minScale={0.58} panX={570} panBelow={768} scrollable>
      <div className="absolute left-1/2 top-5 w-[864px] -translate-x-1/2 rounded-[18px] border border-foreground/5 bg-frame-surface p-[5px] shadow-[0_18px_38px_-18px_rgba(0,0,0,0.14)] dark:border-edge-1 dark:bg-surface-1/75">
        <div className="overflow-hidden rounded-[13px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-12 items-center gap-2.5 border-b border-border px-4 dark:border-edge-2">
            <Icon icon={FileAddIcon} size={15} strokeWidth={1.8} className="shrink-0 text-foreground" />
            <span className="flex min-w-0 flex-1 items-center gap-1.5 font-ui text-[13px] leading-4">
              <span className="font-semibold text-foreground">IV Extension Set</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Pouch label</span>
            </span>

            <span className="flex items-center gap-1.5" role="group" aria-label="Filter diff highlights">
              {SUMMARY_FILTERS.map((badge, index) => {
                const isSelected = activeFilter === badge.key;
                const isOtherSelected = activeFilter !== "all" && !isSelected;
                return (
                  <motion.button
                    key={badge.key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleFilter(badge.key)}
                    initial={false}
                    animate={
                      on
                        ? { opacity: isOtherSelected ? 0.45 : 1, scale: 1 }
                        : { opacity: 0, scale: 0.94 }
                    }
                    transition={on ? { ...SPRING, delay: done + index * 0.1 } : { duration: 0.2 }}
                    className={cn(
                      "inline-flex min-h-6 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] bg-card px-2 font-ui text-[11px] font-medium leading-4 text-foreground tabular-nums shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.03)] outline-none transition-[background-color,box-shadow,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle dark:bg-surface-2 dark:shadow-[inset_0_0_0_1px_var(--edge-3)]",
                      isSelected && "ring-1 ring-foreground/40",
                    )}
                  >
                    <span aria-hidden="true" className={cn("size-[5px] shrink-0 rounded-full", badge.dot)} />
                    {badge.label}
                  </motion.button>
                );
              })}
            </span>

            <span className="flex h-6 items-center rounded-[6px] bg-card px-1.5 font-mono text-[10px] font-semibold leading-3 text-foreground shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.03)] dark:bg-surface-2 dark:shadow-[inset_0_0_0_1px_var(--edge-3)]">
              EN
            </span>
          </div>

          <div className="flex border-b border-border bg-muted/40 dark:border-edge-2">
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <span className="rounded-[5px] bg-foreground/[0.06] px-1.5 font-mono text-[10px] leading-4 text-muted-foreground">
                v4
              </span>
              <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">
                Released 12 Mar 2026
              </span>
            </div>
            <span className="w-px shrink-0 bg-border dark:bg-edge-2" />
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <span className="rounded-[5px] bg-foreground px-1.5 font-mono text-[10px] leading-4 text-background">
                v5
              </span>
              <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">
                Draft, edited 2h ago
              </span>
            </div>
          </div>

          <div className="relative flex flex-col py-1.5">
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-foreground/[0.035] to-transparent"
                initial={false}
                animate={on ? { y: [-48, 268], opacity: [0, 1, 1, 0] } : { y: -48, opacity: 0 }}
                transition={
                  on
                    ? { duration: 1.35, ease: "linear", delay: 0.18 }
                    : { duration: 0 }
                }
              />
            )}
            {DIFF_ROWS.map((row, idx) => {
              const dimmed = activeFilter !== "all" && row.kind !== activeFilter;
              return (
                <div key={idx} className="flex">
                  <DiffCell cell={row.left} on={on} delay={row.delay} dimmed={dimmed} />
                  <span className="w-px shrink-0 bg-border dark:bg-edge-2" />
                  <DiffCell
                    cell={row.right}
                    on={on}
                    delay={row.delay > 0 ? row.delay + 0.16 : 0}
                    dimmed={dimmed}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

export default function RedlineDiffSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="redline-diff-heading" className="contents">
        <SectionHeader
          id="redline-diff-heading"
          anchorId="diff"
          title="Every edit highlighted."
          mutedTitle="Old and new in one view."
        >
          Inspect Added, Updated, and Removed values side by side across text,
          dimensions, and compliance fields—computed automatically from
          structured version data.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <RedlineDiffShowcase reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
