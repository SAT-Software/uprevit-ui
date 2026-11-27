"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { cn } from "@uprevit/ui/lib/utils";
import {
  StatusBadge,
  type StatusTone,
} from "@/features/marketing/landing-page/StatusBadge";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const LEFT_PATHS = [
  "M 92 86 C 142 86 146 152 192 152",
  "M 92 160 C 142 160 146 184 192 184",
  "M 92 234 C 142 234 146 216 192 216",
  "M 92 308 C 142 308 146 248 192 248",
];

const RIGHT_PATHS = [
  "M 428 162 C 474 162 474 102 520 102",
  "M 428 200 L 520 200",
  "M 428 238 C 474 238 474 298 520 298",
];

const ALL_PATHS = [...LEFT_PATHS, ...RIGHT_PATHS];

const STATIC_DOTS = [
  [142, 117],
  [146, 224],
  [474, 132],
  [476, 200],
  [474, 268],
] as const;

const PORT_POINTS = [
  [92, 86],
  [92, 160],
  [92, 234],
  [92, 308],
  [192, 152],
  [192, 184],
  [192, 216],
  [192, 248],
  [428, 162],
  [428, 200],
  [428, 238],
  [520, 102],
  [520, 200],
  [520, 298],
] as const;

const CYCLE = 7.6;
const TRAVEL = 1.6;

function pulseTiming(start: number) {
  const s = start / CYCLE;
  const e = (start + TRAVEL) / CYCLE;
  const r = (n: number) => n.toFixed(4);
  return {
    motionTimes: `0;${r(s)};${r(e)};1`,
    opacityTimes: `0;${r(s)};${r(s + 0.025)};${r(e - 0.035)};${r(e)};1`,
  };
}

const PULSE_RUNS = [
  { path: 0, start: 0 },
  { path: 4, start: 0.9 },
  { path: 2, start: 1.8 },
  { path: 5, start: 2.8 },
  { path: 1, start: 3.7 },
  { path: 6, start: 4.7 },
  { path: 3, start: 5.6 },
];

const STATUSES: { label: string; tone: StatusTone }[] = [
  { label: "Draft", tone: "draft" },
  { label: "In review", tone: "review" },
  { label: "Released", tone: "released" },
];

function MiniFileTile({
  top,
  badge,
  badgeClassName,
  children,
}: {
  top: number;
  badge: string;
  badgeClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ top }}
      className="absolute left-[42px] flex rounded-[9px] rounded-tr-[14px] border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-3"
    >
      <div className="flex h-[48px] w-[42px] shrink-0 flex-col gap-[3px] rounded-[7px] rounded-tr-[11px] bg-file-sheet px-1.5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-surface-2 dark:shadow-none">
        {children}
      </div>
      <span
        className={cn(
          "absolute -left-2.5 bottom-[7px] rounded-[5px] border px-[5px] py-0.5 font-ui text-[9px] font-medium leading-[11px] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:text-surface-0",
          badgeClassName,
        )}
      >
        {badge}
      </span>
    </div>
  );
}

function StandardIconTile({
  top,
  children,
}: {
  top: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ top }}
      className="absolute left-[520px] flex rounded-xl border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-3"
    >
      <div className="flex h-[46px] w-[50px] shrink-0 items-center justify-center rounded-[9px] bg-card shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-surface-2 dark:shadow-none">
        {children}
      </div>
    </div>
  );
}

export function WhatIsUprevitCover() {
  const reduceMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-40px" });
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      setScale(Math.min(width / 620, height / 400, 1));
    };
    const rect = el.getBoundingClientRect();
    update(rect.width, rect.height);
    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex size-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative h-[400px] w-[620px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          width="620"
          height="400"
          viewBox="0 0 620 400"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {ALL_PATHS.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.22}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
          ))}

          {reduceMotion || !inView
            ? STATIC_DOTS.map(([cx, cy]) => (
                <g key={`s-${cx}-${cy}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="currentColor"
                    fillOpacity={0.1}
                  />
                  <circle cx={cx} cy={cy} r="2.5" fill="currentColor" />
                </g>
              ))
            : PULSE_RUNS.map((run) => {
                const timing = pulseTiming(run.start);
                return (
                  <g key={`run-${run.start}`} opacity="0">
                    <circle r="5" fill="currentColor" fillOpacity={0.12} />
                    <circle r="2.5" fill="currentColor" />
                    <animateMotion
                      path={ALL_PATHS[run.path]}
                      dur={`${CYCLE}s`}
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
                      dur={`${CYCLE}s`}
                      repeatCount="indefinite"
                    />
                  </g>
                );
              })}
        </svg>

        <MiniFileTile
          top={58}
          badge=".xlsx"
          badgeClassName="border-[#04785733] bg-success"
        >
          {[true, false, false].map((header, row) => (
            <div key={row} className="flex gap-0.5">
              {[0, 1, 2].map((cell) => (
                <span
                  key={cell}
                  className={cn(
                    "h-[5px] flex-1 rounded-[1px]",
                    header ? "bg-success/25" : "bg-file-line",
                  )}
                />
              ))}
            </div>
          ))}
        </MiniFileTile>

        <MiniFileTile
          top={132}
          badge=".docx"
          badgeClassName="border-[#1D4ED833] bg-info"
        >
          <span className="h-1 w-[65%] rounded-full bg-foreground/25" />
          <span className="mt-0.5 h-[3px] w-[92%] rounded-full bg-file-line" />
          <span className="h-[3px] w-[80%] rounded-full bg-file-line" />
          <span className="h-[3px] w-[70%] rounded-full bg-file-line" />
        </MiniFileTile>

        <MiniFileTile
          top={206}
          badge=".pdf"
          badgeClassName="border-[#B91C1C33] bg-destructive"
        >
          <span className="h-[11px] w-full rounded-[2px] bg-destructive/15" />
          <span className="mt-px h-[3px] w-[88%] rounded-full bg-file-line" />
          <span className="h-[3px] w-[70%] rounded-full bg-file-line" />
        </MiniFileTile>

        <MiniFileTile
          top={280}
          badge=".csv"
          badgeClassName="border-[#0F766E33] bg-teal"
        >
          {[true, false, false].map((header, row) => (
            <div key={row} className="mb-px flex gap-0.5">
              {[10, 12].map((w) => (
                <span
                  key={w}
                  className={cn(
                    "h-[3px] rounded-full",
                    header ? "bg-teal/45" : "bg-foreground/15",
                  )}
                  style={{ width: w }}
                />
              ))}
            </div>
          ))}
        </MiniFileTile>

        <div className="absolute left-[192px] top-[68px] flex h-[264px] w-[236px] rounded-[18px] border border-border bg-muted p-[5px] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.12)] dark:border-edge-3 dark:bg-surface-3 dark:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex flex-1 flex-col justify-between rounded-[13px] border border-separator bg-card p-3.5 dark:border-edge-2 dark:bg-surface-2">
            <div className="flex items-center gap-2.5 border-b border-separator pb-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5L13.5 4.7V11.3L8 14.5L2.5 11.3V4.7L8 1.5ZM2.5 4.7L8 8L13.5 4.7M8 8V14.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex min-w-0 flex-col gap-px">
                <span className="font-sans text-[13px] font-semibold leading-4 text-foreground">
                  Peripheral Catheter
                </span>
                <span className="font-ui text-[10px] leading-[13px] text-muted-foreground">
                  One record for every label
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] uppercase leading-3 tracking-[0.08em] text-faint-foreground">
                Symbols
              </span>
              <div className="flex gap-1.5">
                {["REF", "LOT", "CE", "UDI"].map((symbol) => (
                  <span
                    key={symbol}
                    className="flex h-6 flex-1 items-center justify-center rounded-md border border-border bg-muted font-ui text-[9px] font-semibold text-foreground dark:border-edge-2 dark:bg-surface-3"
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[7px] font-ui text-[11px] leading-[14px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standards</span>
                <span className="font-medium text-foreground">
                  ISO 15223-1 · MDR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Components</span>
                <span className="font-medium text-foreground tabular-nums">12 labels</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specifications</span>
                <span className="font-medium text-foreground tabular-nums">3 sheets</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-separator pt-2.5">
              <div className="relative h-[22px] w-[90px]">
                {STATUSES.map((status, index) => (
                  <StatusBadge
                    key={status.label}
                    tone={status.tone}
                    size="sm"
                    className="blog-cover-status absolute left-0 top-0"
                    style={{
                      animationDelay: `${-((3 - index) % 3) * 3}s`,
                      animationPlayState: inView && !reduceMotion ? "running" : "paused",
                      opacity: index === STATUSES.length - 1 ? 1 : 0,
                    }}
                  >
                    {status.label}
                  </StatusBadge>
                ))}
              </div>
              <span className="font-mono text-[11px] leading-[14px] text-muted-foreground tabular-nums">
                v3.0
              </span>
            </div>
          </div>
        </div>

        <StandardIconTile top={75}>
          <svg
            width="28"
            height="20"
            viewBox="0 0 280 200"
            fill="currentColor"
            className="text-foreground"
          >
            <path d="M110,199.5A100,100 0 0 1 100,200A100,100 0 0 1 100,0A100,100 0 0 1 110,0.5L110,30.5A70,70 0 0 0 100,30A70,70 0 0 0 100,170A70,70 0 0 0 110,169.5Z" />
            <path d="M280,199.5A100,100 0 0 1 270,200A100,100 0 0 1 270,0A100,100 0 0 1 280,0.5L280,30.5A70,70 0 0 0 270,30A70,70 0 0 0 201.6,85L260,85L260,115L201.6,115A70,70 0 0 0 270,170A70,70 0 0 0 280,169.5Z" />
          </svg>
        </StandardIconTile>

        <StandardIconTile top={173}>
          <span className="font-sans text-[15px] font-extrabold leading-4 tracking-[0.02em] text-foreground">
            FDA
          </span>
        </StandardIconTile>

        <StandardIconTile top={271}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 28 28"
            fill="none"
            className="text-foreground"
          >
            <circle
              cx="14"
              cy="14"
              r="10.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <ellipse
              cx="14"
              cy="14"
              rx="5"
              ry="10.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <line
              x1="4"
              y1="10.5"
              x2="24"
              y2="10.5"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <line
              x1="4"
              y1="17.5"
              x2="24"
              y2="17.5"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <rect
              x="3"
              y="10.5"
              width="22"
              height="7"
              className="fill-card dark:fill-surface-2"
            />
            <text
              x="14"
              y="16.2"
              textAnchor="middle"
              fontSize="7.2"
              fontWeight="800"
              letterSpacing="0.4"
              fill="currentColor"
              className="font-sans"
            >
              ISO
            </text>
          </svg>
        </StandardIconTile>

        <svg
          width="620"
          height="400"
          viewBox="0 0 620 400"
          className="pointer-events-none absolute inset-0 z-10 text-foreground"
        >
          {PORT_POINTS.map(([cx, cy]) => (
            <circle
              key={`port-${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3.25"
              strokeWidth="1.2"
              className="fill-card stroke-foreground/40 dark:fill-surface-2"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
