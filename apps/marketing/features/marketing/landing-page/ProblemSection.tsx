"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  Attachment01Icon,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { DotsBackdrop } from "./DotsBackdrop";
import { ScaledCanvas } from "./ScaledCanvas";
import { SectionHeader } from "./SectionHeader";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const IN_VIEW = { once: true, margin: "-80px" } as const;

function reveal(delay: number, y = 6) {
  return {
      initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: IN_VIEW,
    transition: { duration: 0.45, ease: EASE_OUT, delay },
  };
}

function useVisibleTicker(enabled: boolean, intervalMs: number) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || !inView) return;
    const id = setInterval(() => setTick((value) => value + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, inView, intervalMs]);

  return [ref, tick] as const;
}

function FileTile({
  top,
  badge,
  badgeClassName,
  children,
  delay,
}: {
  top: number;
  badge: string;
  badgeClassName: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: 0.45, ease: EASE_OUT, delay }}
      className="absolute left-[62px] flex rounded-[9px] rounded-tr-[14px] border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      style={{ top }}
    >
      <div className="flex h-[50px] w-10 shrink-0 flex-col gap-[3px] rounded-[7px] rounded-tr-[11px] bg-file-sheet px-[7px] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        {children}
      </div>
      <span
        className={cn(
          "absolute -left-2.5 bottom-2 rounded-[6px] border px-[5px] py-0.5 font-ui text-[10px] font-medium leading-3 text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:text-surface-0",
          badgeClassName,
        )}
      >
        {badge}
      </span>
    </motion.div>
  );
}

const CONNECTOR_PATHS = [
  "M104 42 C188 42 188 141 268 141",
  "M104 108 C188 108 188 141 268 141",
  "M104 174 C188 174 188 141 268 141",
  "M104 240 C188 240 188 141 268 141",
];

const CONNECTOR_DOTS = [
  [168, 70],
  [200, 129],
  [154, 224.5],
] as const;

const DOT_CYCLE = 8.4;
const DOT_TRAVEL = 1.7;
const DOT_RUNS = [
  { path: 1, start: 0 },
  { path: 3, start: 1.3 },
  { path: 0, start: 2.5 },
  { path: 2, start: 3.9 },
  { path: 3, start: 5.2 },
  { path: 1, start: 6.4 },
];

function dotTiming(start: number) {
  const s = start / DOT_CYCLE;
  const e = (start + DOT_TRAVEL) / DOT_CYCLE;
  const r = (n: number) => n.toFixed(4);
  return {
    motionTimes: `0;${r(s)};${r(e)};1`,
    opacityTimes: `0;${r(s)};${r(s + 0.025)};${r(e - 0.035)};${r(e)};1`,
  };
}

function SpreadsheetsVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });

  return (
    <div ref={ref} aria-hidden="true" className="relative h-[300px] shrink-0 overflow-hidden [mask-image:linear-gradient(#000_82%,transparent_100%)]">
      <svg
        width="436"
        height="300"
        viewBox="0 0 436 300"
        aria-hidden="true"
        className="absolute left-1 top-0 text-foreground"
      >
        {CONNECTOR_PATHS.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
        ))}
        {reduceMotion || !inView
          ? CONNECTOR_DOTS.map(([cx, cy]) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="5" fill="currentColor" fillOpacity={0.09} />
                <circle cx={cx} cy={cy} r="2.5" fill="currentColor" />
              </g>
            ))
          : DOT_RUNS.map((run) => {
              const timing = dotTiming(run.start);
              return (
                <g key={run.start} opacity="0">
                  <circle r="5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2.5" fill="currentColor" />
                  <animateMotion
                    path={CONNECTOR_PATHS[run.path]}
                    dur={`${DOT_CYCLE}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyPoints="0;0;1;1"
                    keyTimes={timing.motionTimes}
                    keySplines="0 0 1 1;0.45 0 0.25 1;0 0 1 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1;0;0"
                    keyTimes={timing.opacityTimes}
                    dur={`${DOT_CYCLE}s`}
                    repeatCount="indefinite"
                  />
                </g>
              );
            })}
      </svg>

      <FileTile
        top={13}
        badge=".xlsx"
        badgeClassName="border-[#04785733] bg-success"
        delay={0}
      >
        {[true, false, false, false].map((header, row) => (
          <div key={row} className="flex gap-0.5">
            {[0, 1, 2].map((cell) => (
              <span
                key={cell}
                className={cn(
                  "h-[5px] flex-1 rounded-[1px]",
                  header ? "bg-[#05966933]" : "bg-file-line",
                )}
              />
            ))}
          </div>
        ))}
      </FileTile>

      <FileTile
        top={79}
        badge=".docx"
        badgeClassName="border-[#1D4ED833] bg-info"
        delay={0.06}
      >
        <span className="h-1 w-[60%] rounded-full bg-[#6A6A6A4D]" />
        <span className="mt-0.5 h-[3px] w-[92%] rounded-full bg-file-line" />
        <span className="h-[3px] w-[80%] rounded-full bg-file-line" />
        <span className="h-[3px] w-[86%] rounded-full bg-file-line" />
        <span className="h-[3px] w-[70%] rounded-full bg-file-line" />
      </FileTile>

      <FileTile
        top={145}
        badge=".pdf"
        badgeClassName="border-[#B91C1C33] bg-destructive"
        delay={0.12}
      >
        <span className="h-3 w-full rounded-[2px] bg-[#E7000B14]" />
        <span className="mt-px h-[3px] w-[86%] rounded-full bg-file-line" />
        <span className="h-[3px] w-[92%] rounded-full bg-file-line" />
        <span className="h-[3px] w-[64%] rounded-full bg-file-line" />
      </FileTile>

      <FileTile
        top={211}
        badge=".csv"
        badgeClassName="border-[#0F766E33] bg-teal"
        delay={0.18}
      >
        {[true, false, false, false].map((header, row) => (
          <div key={row} className="mb-px flex gap-0.5">
            {[8, 10, 6].map((width) => (
              <span
                key={width}
                className={cn(
                  "h-[3px] rounded-full",
                  header ? "bg-[#14B8A666]" : "bg-foreground/10",
                )}
                style={{ width }}
              />
            ))}
          </div>
        ))}
      </FileTile>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={IN_VIEW}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.24 }}
        className="absolute left-[272px] top-[71px] flex rounded-[13px] border border-separator bg-file-frame p-[3px] shadow-[0_4px_6px_-1px_rgba(23,23,23,0.1),0_2px_4px_-2px_rgba(23,23,23,0.1)]"
      >
        <div className="flex w-36 shrink-0 flex-col gap-2.5 rounded-[10px] bg-card p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-surface-2">
          <div className="flex items-center gap-1.5">
            <span className="size-3.5 shrink-0 rounded-[4px] bg-foreground" />
            <div className="flex flex-1 flex-col gap-[3px]">
              <span className="h-[5px] w-[70%] rounded-full bg-[#6A6A6A4D]" />
              <span className="h-[3px] w-[45%] rounded-full bg-foreground/6" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="h-[3px] w-full rounded-full bg-foreground/6" />
            <span className="h-[3px] w-[84%] rounded-full bg-foreground/6" />
          </div>
          <svg
            width="120"
            height="18"
            viewBox="0 0 120 18"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground/60"
          >
            <path d="M4 2h10M4 16h10M5 2c0 4 4 5 4 7s-4 3-4 7M13 2c0 4-4 5-4 7s4 3 4 7" />
            <path transform="translate(-4.1 0)" d="M28 16V8l4 3V8l4 3V4h3v12z" />
            <path transform="translate(-2.2 0)" d="M52 3l7 13h-14z M52 8.5v3.5 M52 14v0.2" />
            <g transform="translate(-3.8 0)">
              <circle cx="74" cy="9" r="6.5" />
              <path d="M70 13l8-8" />
            </g>
            <g transform="translate(-5.4 0)">
              <rect x="88" y="3" width="16" height="12" rx="1.5" />
              <path d="M91 7h10M91 11h6" />
            </g>
            <path transform="translate(-2 0)" d="M112 2v9.6a2.6 2.6 0 1 0 2 0V2a1 1 0 0 0-2 0z" />
          </svg>
          <div className="flex items-center gap-2 border-t border-separator pt-0.5">
            <svg
              width="80"
              height="26"
              viewBox="0 0 80 26"
              aria-hidden="true"
              className="mt-2 text-foreground/70"
              fill="currentColor"
            >
              {[
                [0, 2], [3.5, 1], [6, 3], [10.5, 1], [13, 1.5], [16, 3],
                [20.5, 1], [23, 2], [27, 1], [29.5, 3], [34, 1.5], [37, 1],
                [39.5, 2], [43, 3], [47.5, 1], [50, 1.5], [53, 3], [57.5, 1],
                [60, 2], [64, 1], [66.5, 3], [71, 1.5], [74, 1], [76.5, 2],
              ].map(([x, w]) => (
                <rect key={x} x={x} y="0" width={w} height="26" />
              ))}
            </svg>
            <svg
              width="26"
              height="26"
              viewBox="0 0 13 13"
              aria-hidden="true"
              className="mt-2 text-foreground/70"
              fill="currentColor"
            >
              {[
                [0, 0, 1, 13], [0, 12, 13, 1], [2, 0, 1, 1], [4, 0, 1, 1],
                [6, 0, 1, 1], [8, 0, 1, 1], [10, 0, 1, 1], [12, 1, 1, 1],
                [12, 3, 1, 1], [12, 5, 1, 1], [12, 7, 1, 1], [12, 9, 1, 1],
                [2, 2, 2, 1], [5, 2, 1, 2], [8, 3, 2, 1], [3, 4, 1, 2],
                [6, 5, 2, 1], [9, 5, 1, 2], [2, 7, 2, 1], [5, 7, 1, 2],
                [7, 8, 2, 1], [10, 9, 1, 1], [2, 9, 1, 2], [4, 10, 2, 1],
                [7, 10, 1, 1], [9, 10, 2, 1],
              ].map(([x, y, w, h]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
              ))}
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

type DiffKind = "removed" | "added" | "updated";

type EditorLine = {
  bars: { width: number; tone?: "strong" | DiffKind }[];
  kind?: DiffKind;
  indent?: boolean;
};

const EDITOR_TABS: {
  name: string;
  dot: string;
  type: string;
  reviewers: string;
  summary: string;
  revealOrder: number[];
  lines: EditorLine[];
}[] = [
  {
    name: "IFU_v7.docx",
    dot: "bg-info",
    type: "docx",
    reviewers: "3 reviewers",
    summary: "14 edits · 1 unresolved",
    revealOrder: [2, 3, 5, 7],
    lines: [
      { bars: [{ width: 24, tone: "strong" }, { width: 30 }] },
      { bars: [{ width: 14 }, { width: 22 }, { width: 18 }, { width: 12 }] },
      { kind: "removed", bars: [{ width: 16 }, { width: 26, tone: "removed" }, { width: 10 }] },
      { kind: "added", bars: [{ width: 16 }, { width: 20, tone: "added" }, { width: 10 }] },
      { bars: [{ width: 20 }, { width: 28 }, { width: 14 }] },
      { kind: "updated", indent: true, bars: [{ width: 12 }, { width: 24, tone: "updated" }, { width: 16 }] },
      { indent: true, bars: [{ width: 18 }, { width: 22 }] },
      { kind: "removed", bars: [{ width: 10 }, { width: 18, tone: "removed" }] },
      { bars: [{ width: 26 }, { width: 12 }] },
      { bars: [{ width: 8 }] },
    ],
  },
  {
    name: "Label_EU.docx",
    dot: "bg-[#155EEF]",
    type: "docx",
    reviewers: "2 reviewers",
    summary: "6 edits · 2 unresolved",
    revealOrder: [4, 3, 6],
    lines: [
      { bars: [{ width: 34, tone: "strong" }] },
      { bars: [{ width: 22 }, { width: 30 }, { width: 14 }] },
      { bars: [{ width: 18 }, { width: 26 }] },
      { kind: "added", bars: [{ width: 12 }, { width: 32, tone: "added" }] },
      { kind: "added", indent: true, bars: [{ width: 20, tone: "added" }, { width: 14 }] },
      { bars: [{ width: 28 }, { width: 16 }, { width: 12 }] },
      { kind: "removed", bars: [{ width: 24, tone: "removed" }, { width: 10 }] },
      { bars: [{ width: 14 }] },
    ],
  },
  {
    name: "Specs_v3.xlsx",
    dot: "bg-[#059669]",
    type: "xlsx",
    reviewers: "4 reviewers",
    summary: "21 edits · 3 unresolved",
    revealOrder: [5, 2, 7, 4],
    lines: [
      { bars: [{ width: 18, tone: "strong" }, { width: 18, tone: "strong" }, { width: 18, tone: "strong" }, { width: 18, tone: "strong" }] },
      { bars: [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }] },
      { kind: "updated", bars: [{ width: 18 }, { width: 18, tone: "updated" }, { width: 18 }, { width: 18 }] },
      { bars: [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }] },
      { kind: "updated", bars: [{ width: 18 }, { width: 18 }, { width: 18, tone: "updated" }, { width: 18 }] },
      { kind: "removed", bars: [{ width: 18 }, { width: 18, tone: "removed" }, { width: 18 }, { width: 18 }] },
      { bars: [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }] },
      { kind: "updated", bars: [{ width: 18, tone: "updated" }, { width: 18 }, { width: 18 }, { width: 18 }] },
      { bars: [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }] },
      { bars: [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }] },
      { bars: [{ width: 18 }, { width: 18 }] },
    ],
  },
];

const DIFF_ROW: Record<DiffKind, string> = {
  removed: "border-l-diff-removed bg-diff-removed-soft",
  added: "border-l-diff-added bg-diff-added-soft",
  updated: "border-l-diff-updated bg-diff-updated-soft",
};

const DIFF_NUMBER: Record<DiffKind, string> = {
  removed: "text-diff-removed",
  added: "text-diff-added",
  updated: "text-diff-updated",
};

const DIFF_BAR: Record<"strong" | DiffKind, string> = {
  strong: "bg-[#6A6A6A4D]",
  removed: "bg-[#B91C1C4D] dark:bg-[#FF8A8A4D]",
  added: "bg-[#1D4ED84D] dark:bg-[#7DB4FF4D]",
  updated: "bg-[#15803D4D] dark:bg-[#5EE38D4D]",
};

function PanelShell({
  left,
  width,
  children,
}: {
  left: number;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute top-3 flex flex-col rounded-2xl border border-foreground/5 bg-frame-surface p-[5px]"
      style={{ left, width }}
    >
      <div className="flex flex-col overflow-hidden rounded-[11px] border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2">
        {children}
      </div>
    </div>
  );
}

function RedlinesVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [ref, tick] = useVisibleTicker(!reduceMotion, 850);
  const [startTick, setStartTick] = React.useState(0);
  const tab = EDITOR_TABS[activeTab];
  const order = tab.revealOrder;
  const step = tick - startTick;
  const revealedCount = reduceMotion
    ? order.length
    : Math.min(step % (order.length + 5), order.length);
  const revealed = new Set(order.slice(0, revealedCount));
  const swap = { duration: 0.3, ease: EASE_OUT };

  return (
    <div ref={ref} className="relative h-[300px] shrink-0 overflow-hidden [mask-image:linear-gradient(#000_55%,transparent_100%)]">
      <PanelShell left={38} width={360}>
        <div aria-hidden="true" className="flex items-center gap-2 border-b border-separator bg-[#F7F7F766] px-2.5 py-[7px] dark:bg-white/[0.02]">
          <div className="flex gap-[5px]">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2 rounded-full bg-foreground/15" />
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center gap-[5px]">
            <Icon
              icon={PencilEdit02Icon}
              size={10}
              strokeWidth={2.2}
              className="shrink-0 text-foreground/60"
            />
            <span className="font-ui text-[9px] font-medium leading-[14px] text-muted-foreground">
              Document redlines
            </span>
          </div>
          <span className="w-[31px] shrink-0" />
        </div>

        <div
          role="group"
          aria-label="Example documents"
          className="flex items-end border-b border-border bg-muted px-2 pt-1.5 dark:border-edge-2 dark:bg-surface-3"
        >
          {EDITOR_TABS.map((item, index) => {
            const active = index === activeTab;
            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveTab(index);
                  setStartTick(tick);
                }}
                className="relative flex min-h-6 translate-y-px cursor-pointer items-center gap-[5px] px-2.5 pb-1.5 pt-[5px] outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
              >
                {active && (
                  <motion.span
                    layoutId="redline-active-tab"
                    transition={{ type: "spring", duration: 0.22, bounce: 0 }}
                    className="absolute inset-0 rounded-t-sm border-x border-t border-border bg-card dark:border-edge-2 dark:bg-surface-2"
                  />
                )}
                <span
                  className={cn(
                    "relative size-1.5 rounded-[2px] transition-opacity duration-200",
                    item.dot,
                    !active && "opacity-50",
                  )}
                />
                <span
                  className={cn(
                    "relative font-ui text-[9px] font-medium leading-[14px] transition-colors duration-200",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          transition={{ layout: swap }}
          aria-hidden="true"
          className="flex flex-col gap-1.5 py-3"
        >
          <AnimatePresence initial={false}>
            {tab.lines.map((line, index) => {
              const kind = revealed.has(index) ? line.kind : undefined;

              return (
                <motion.div
                  key={index}
                  layout="position"
                  initial={false}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  viewport={IN_VIEW}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 + index * 0.05, layout: swap }}
                  className={cn(
                    "flex items-center gap-1.5 border-l-2 border-l-transparent px-2.5 transition-colors duration-300 ease-out",
                    kind && DIFF_ROW[kind],
                  )}
                >
                  <span
                    className={cn(
                      "w-3 shrink-0 text-right font-ui text-[8px] font-medium leading-3 transition-colors duration-300 ease-out",
                      kind ? DIFF_NUMBER[kind] : "text-faint-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className={cn("flex flex-1 gap-1 transition-transform duration-300", line.indent && "translate-x-2")}>
                    {[0, 1, 2, 3].map((barIndex) => {
                      const bar = line.bars[barIndex];
                      const tone =
                        bar?.tone === "strong" || (bar && kind) ? bar.tone : undefined;
                      return (
                        <span
                          key={barIndex}
                          style={{ width: `${bar?.width ?? 0}%` }}
                          className={cn(
                            "relative h-[5px] overflow-hidden rounded-sm bg-stroke-strong transition-opacity duration-300",
                            bar ? "opacity-100" : "opacity-0",
                          )}
                        >
                          <motion.span
                            className={cn(
                              "absolute inset-0 origin-left",
                              tone && DIFF_BAR[tone],
                            )}
                            initial={false}
                            animate={{ scaleX: tone ? 1 : 0 }}
                            transition={{ duration: 0.45, ease: EASE_OUT }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div aria-hidden="true" className="flex items-center justify-between border-t border-separator px-2.5 py-1.5">
          <div className="flex items-center gap-2">
            <span className="font-ui text-[8px] font-medium uppercase leading-3 tracking-[0.02em] text-muted-foreground">
              {tab.type}
            </span>
            <span className="font-ui text-[8px] leading-3 text-faint-foreground">
              {tab.reviewers}
            </span>
          </div>
          <span className="font-ui text-[8px] font-medium leading-3 text-muted-foreground">
            {tab.summary}
          </span>
        </div>
      </PanelShell>
    </div>
  );
}

const MAIL_ROWS: {
  initials: string;
  name: string;
  time: string;
  subject: string;
  preview: string;
  unread?: boolean;
  attachment?: boolean;
}[] = [
  {
    initials: "SP",
    name: "Sara Patel",
    time: "9:42",
    subject: "Re: Pouch label v6 for approval",
    preview: "Approved, see my notes in v5.",
    unread: true,
  },
  {
    initials: "AP",
    name: "Alex Park",
    time: "9:18",
    subject: "FW: IFU redlines FINAL(2).docx",
    preview: "Which version are we approving?",
    unread: true,
    attachment: true,
  },
  {
    initials: "ML",
    name: "Mia Lee",
    time: "8:34",
    subject: "Re: Re: EU label sign-off",
    preview: "Looping QA in again for review.",
  },
  {
    initials: "BN",
    name: "Ben Novak",
    time: "Yesterday",
    subject: "PTA-5x40_specs_v3.xlsx",
    preview: "Shelf life changed, please recheck.",
    attachment: true,
  },
  {
    initials: "JL",
    name: "Jordan Liu",
    time: "Mon",
    subject: "Audit request: label history",
    preview: "Can you send every approved version?",
  },
];

const INCOMING_MAIL: typeof MAIL_ROWS = [
  {
    initials: "RK",
    name: "Ravi Kulkarni",
    time: "Now",
    subject: "Re: FW: Label v6 FINAL_final.pdf",
    preview: "Is this the one going to print?",
    unread: true,
    attachment: true,
  },
  {
    initials: "TS",
    name: "Tom Silva",
    time: "Now",
    subject: "Re: Re: Re: Carton artwork approval",
    preview: "Approved on my side, adding Mia.",
    unread: true,
  },
];

function AttachmentIcon() {
  return (
    <Icon
      icon={Attachment01Icon}
      size={10}
      strokeWidth={2.2}
      className="shrink-0 text-foreground/60"
    />
  );
}

function EmailVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, tick] = useVisibleTicker(!reduceMotion, 3400);
  const incoming =
    tick % 2 === 1
      ? INCOMING_MAIL[Math.floor(tick / 2) % INCOMING_MAIL.length]
      : null;
  const rows = incoming ? [incoming, ...MAIL_ROWS] : MAIL_ROWS;

  return (
    <div ref={ref} aria-hidden="true" className="relative h-[300px] shrink-0 overflow-hidden [mask-image:linear-gradient(#000_55%,transparent_100%)]">
      <PanelShell left={58} width={320}>
        <div className="flex items-center justify-between border-b border-separator px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-ui text-[12px] font-semibold leading-4 text-foreground">
              Inbox
            </span>
          </div>
          <div className="flex h-6 w-[132px] shrink-0 items-center gap-1.5 rounded-sm border border-border bg-card pl-2 pr-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-3">
            <Icon
              icon={Search01Icon}
              size={11}
              strokeWidth={2.2}
              className="shrink-0 text-foreground/50"
            />
            <span className="flex-1 font-ui text-[10px] leading-[14px] text-faint-foreground">
              Search mail
            </span>
            <span className="flex h-4 items-center rounded-tile border border-border bg-muted px-1 font-ui text-[9px] font-medium leading-3 text-muted-foreground dark:border-edge-2">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <AnimatePresence initial={false} mode="popLayout">
          {rows.map((row, index) => (
            <motion.div
              key={row.initials}
              layout="position"
              initial={{ opacity: 0, y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
              viewport={IN_VIEW}
              transition={{
                duration: 0.4,
                ease: EASE_OUT,
                delay: row === incoming ? 0 : 0.15 + index * 0.06,
                layout: { type: "spring", duration: 0.5, bounce: 0 },
              }}
              className={cn(
                "flex items-start gap-2.5 border-b border-separator px-3 py-2.5 last:border-b-0",
                row.unread && "bg-[#F7F7F780] dark:bg-white/[0.02]",
              )}
            >
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-muted font-ui text-[9px] font-semibold leading-3 text-muted-foreground dark:bg-surface-3">
                {row.initials}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "font-ui text-[12px] leading-4 text-foreground",
                      row.unread ? "font-semibold" : "font-medium",
                    )}
                  >
                    {row.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "font-ui text-[10px] leading-[14px]",
                        row.unread
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.time}
                    </span>
                    {row.unread && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-[5px]">
                  {row.attachment && <AttachmentIcon />}
                  <span
                    className={cn(
                      "truncate font-ui text-[10px] leading-[15px]",
                      row.unread
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {row.subject}
                  </span>
                </div>
                <span className="truncate font-ui text-[10px] leading-[15px] text-muted-foreground">
                  {row.preview}
                </span>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </PanelShell>
    </div>
  );
}

const PAINS = [
  {
    title: "Specs scattered across files",
    body: "Product data sits in Excel, Word, PDF and CSV, and nobody knows which copy is current.",
    Visual: SpreadsheetsVisual,
  },
  {
    title: "Redlines tracked by hand",
    body: "Edits pile up across Word and Excel copies, and one missed change reaches print.",
    Visual: RedlinesVisual,
  },
  {
    title: "Approvals lost in email",
    body: "Sign-offs hide in inbox threads, and the audit trail is a forwarded email.",
    Visual: EmailVisual,
  },
];

export default function ProblemSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
    <section aria-labelledby="problem-heading" className="contents">
      <SectionHeader
        id="problem-heading"
        title="Documentation lives in ten places."
        mutedTitle="Regulators ask for one."
      >
        Most teams stitch label documentation together from spreadsheets, Word
        redlines and email threads. Every hand-off is a place for an error to
        slip into print.
      </SectionHeader>

      <TileRow
        splitCenter
        centerClassName="grid grid-cols-1 gap-px lg:grid-cols-3"
      >
        {PAINS.map(({ title, body, Visual }, index) => (
          <article
            key={title}
            className="relative flex flex-col gap-5 overflow-hidden rounded-tile bg-tile pt-6 sm:gap-8 sm:pt-8"
          >
            <DotsBackdrop className="top-24 opacity-40" />
            <motion.div {...reveal(index * 0.06)} className="relative flex flex-col gap-1.5 px-5 sm:px-8 lg:px-10">
              <h3 className="text-balance font-ui text-[16px] font-medium leading-[1.375] text-foreground">
                {title}
              </h3>
              <p className="max-w-[330px] text-pretty font-ui text-[14px] leading-[1.55] text-muted-foreground">
                {body}
              </p>
            </motion.div>
            <ScaledCanvas
              width={436}
              height={300}
              aria-hidden={Visual !== RedlinesVisual ? true : undefined}
              className="w-full"
            >
              <Visual reduceMotion={reduceMotion} />
            </ScaledCanvas>
          </article>
        ))}
      </TileRow>
    </section>
    </MotionConfig>
  );
}
