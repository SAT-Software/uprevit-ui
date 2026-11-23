"use client";

import * as React from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  GridTableIcon,
  HourglassIcon,
  SecurityCheckIcon,
  SquareLock02Icon,
  Tag01Icon,
  Tick02Icon,
  Upload04Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "./DotsBackdrop";
import { ScaledCanvas } from "./ScaledCanvas";
import { StatusBadge, type StatusTone } from "./StatusBadge";
import { SectionHeader } from "./SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const STEP_MS = 6500;
const STAGE_W = 873;
const STAGE_H = 680;

const ICONS = {
  upload: Upload04Icon,
  table: GridTableIcon,
  shield: SecurityCheckIcon,
  lock: SquareLock02Icon,
  hourglass: HourglassIcon,
  tag: Tag01Icon,
  check: Tick02Icon,
};

type IconName = keyof typeof ICONS;

function Glyph({
  name,
  size,
  strokeWidth = 1.6,
  className,
}: {
  name: IconName;
  size: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <Icon
      icon={ICONS[name]}
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
    />
  );
}

const STEPS: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Import",
    body: "Bring spreadsheets in and check them before anything goes live.",
    icon: "upload",
  },
  {
    title: "Build",
    body: "Specs, label parts and ISO symbols, organized by department and project.",
    icon: "table",
  },
  {
    title: "Review",
    body: "Each function signs off in order.",
    icon: "shield",
  },
  {
    title: "Release",
    body: "Approved versions are locked, and the next edit starts a new one.",
    icon: "lock",
  },
];

const FRAME =
  "border border-foreground/5 bg-[#F5F5F5BF] dark:bg-surface-1/75";
const CARD =
  "border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2";
const HALO =
  "shadow-[0_0_0_4px_rgba(245,245,245,0.75),0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_4px_rgba(14,14,14,0.75),0_1px_2px_rgba(0,0,0,0.3)]";

function rise(delay: number, y = 8) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: EASE_OUT, delay },
  };
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="animate-spin [animation-duration:900ms]"
    >
      <circle cx="12" cy="12" r="8" fill="none" stroke="#FFFFFF40" strokeWidth="2.4" />
      <path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const FILES: {
  ext: string;
  top: number;
  doneAt: number;
  sheet: React.ReactNode;
}[] = [
  {
    ext: ".xlsx",
    top: 123,
    doneAt: 0.9,
    sheet: [true, false, false, false, false].map((head, row) => (
      <div key={row} className="flex gap-0.5">
        {[0, 1, 2].map((cell) => (
          <span
            key={cell}
            className={cn(
              "h-[5px] flex-1 rounded-[1px]",
              head ? "bg-[#05966940]" : "bg-file-line",
            )}
          />
        ))}
      </div>
    )),
  },
  {
    ext: ".docx",
    top: 241,
    doneAt: 1.6,
    sheet: (
      <>
        <span className="h-[3px] w-[60%] rounded-full bg-[#155EEF4D]" />
        {[92, 80, 86, 70].map((w) => (
          <span key={w} className="h-[3px] rounded-full bg-file-line" style={{ width: `${w}%` }} />
        ))}
      </>
    ),
  },
  {
    ext: ".pdf",
    top: 359,
    doneAt: 2.8,
    sheet: (
      <>
        <span className="h-3.5 rounded-[2px] bg-[#E7000B14]" />
        {[86, 92, 64].map((w) => (
          <span key={w} className="h-[3px] rounded-full bg-file-line" style={{ width: `${w}%` }} />
        ))}
      </>
    ),
  },
  {
    ext: ".csv",
    top: 477,
    doneAt: 4.0,
    sheet: [true, false, false, false, false].map((head, row) => (
      <div key={row} className="flex gap-0.5">
        {[8, 12, 7].map((w) => (
          <span
            key={w}
            className={cn("h-[3px] rounded-full", head ? "bg-teal/40" : "bg-border")}
            style={{ width: w }}
          />
        ))}
      </div>
    )),
  },
];

function ImportFile({ file, index }: { file: (typeof FILES)[number]; index: number }) {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setDone(true), file.doneAt * 1000);
    return () => clearTimeout(id);
  }, [file.doneAt]);

  return (
    <motion.div
      {...rise(0.05 + index * 0.06, 6)}
      className="absolute left-[264px] flex h-20 w-16 flex-col gap-[5px] rounded-l-lg rounded-r-lg rounded-tr-2xl border border-separator bg-file-frame px-1 pb-1.5 pt-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      style={{ top: file.top }}
    >
      <div className="flex flex-1 flex-col gap-[3px] rounded-l-[7px] rounded-br-[7px] rounded-tr-xl bg-file-sheet px-[7px] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        {file.sheet}
      </div>
      <div className="flex px-[3px]">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn(
              "h-full origin-left rounded-full transition-colors duration-300",
              done ? "bg-success" : "bg-foreground",
            )}
            initial={{ scaleX: 0.08 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: file.doneAt, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
      <span
        className={cn(
          "absolute -left-3 top-[34px] flex size-[26px] items-center justify-center rounded-md text-white shadow-[0_0_0_2px_var(--card),0_2px_6px_rgba(0,0,0,0.15)] transition-colors duration-300",
          done ? "bg-success" : "bg-[#1A1A1A]",
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {done ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <Glyph name="check" size={14} strokeWidth={2.6} />
            </motion.span>
          ) : (
            <motion.span
              key="busy"
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <Spinner />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="absolute -right-1.5 -top-1.5 rounded-tile border border-border bg-card px-[5px] py-px font-ui text-[10px] font-medium leading-[13px] text-muted-foreground dark:border-edge-2 dark:bg-surface-2">
        {file.ext}
      </span>
    </motion.div>
  );
}

const MAPPINGS = [
  ["Product Name", "Device name"],
  ["Ref No.", "REF"],
  ["Sterilisation", "Sterilization"],
  ["Expiry (months)", "Shelf life"],
  ["Latex (Y/N)", "Latex statement"],
  ["UDI-DI", "UDI"],
];

function RowCounter({ to }: { to: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => Math.round(value));

  React.useEffect(() => {
    const controls = animate(count, to, { duration: 1.4, ease: EASE_OUT, delay: 0.5 });
    return () => controls.stop();
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
}

function ImportStage() {
  return (
    <>
      <svg width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden="true" className="absolute inset-0 text-foreground">
        {FILES.flatMap((file) => [file.top + 34, file.top + 46]).map((y) =>
          [
            [16, 80, 0.04],
            [80, 144, 0.1],
            [144, 208, 0.2],
            [208, 424, 0.3],
          ].map(([x1, x2, o]) => (
            <motion.line
              key={`${y}-${x1}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="currentColor"
              strokeOpacity={o}
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeDasharray="3 5"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -16 }}
              transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
            />
          )),
        )}
      </svg>

      {FILES.map((file, index) => (
        <ImportFile key={file.ext} file={file} index={index} />
      ))}

      <motion.div
        {...rise(0.15, 10)}
        className={cn("absolute left-[402px] top-[103px] flex w-[410px] rounded-2xl p-[5px]", FRAME)}
      >
        <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl", CARD)}>
          <div className="flex items-center gap-2.5 border-b border-separator p-4">
            <Glyph name="table" size={18} className="text-foreground" />
            <span className="flex-1 font-ui text-[14px] font-semibold leading-5 text-foreground">
              Map to Uprevit fields
            </span>
            <span className="font-ui text-[12px] leading-4 text-muted-foreground">4 files</span>
          </div>
          <div className="flex flex-col gap-2.5 bg-subtle px-4 pb-5 pt-[18px] dark:bg-surface-1">
            <div className="flex gap-2 pb-0.5 font-ui text-[11px] font-medium uppercase leading-[14px] tracking-[0.08em] text-faint-foreground">
              <span className="flex-1">Column</span>
              <span className="w-[22px] shrink-0" />
              <span className="flex-1">Uprevit field</span>
            </div>
            {MAPPINGS.map(([from, to], index) => (
              <motion.div key={from} {...rise(0.35 + index * 0.08, 4)} className="flex items-center gap-2">
                <span className={cn("flex h-8 min-w-0 flex-1 items-center rounded-md px-2.5 font-ui text-[12px] leading-4 text-foreground", CARD)}>
                  {from}
                </span>
                <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true" className="shrink-0 text-foreground/50">
                  <path d="M1 5h18M15 1.5 19 5l-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <motion.span
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.55 + index * 0.08 }}
                  className="flex h-8 min-w-0 flex-1 items-center rounded-md border border-dashed border-foreground/15 bg-muted px-2.5 font-ui text-[12px] font-medium leading-4 text-foreground dark:bg-surface-3"
                >
                  {to}
                </motion.span>
              </motion.div>
            ))}
            <motion.div {...rise(0.35 + MAPPINGS.length * 0.08, 4)} className="flex items-center gap-2">
              <span className={cn("flex h-8 min-w-0 flex-1 items-center rounded-md px-2.5 font-ui text-[12px] leading-4 text-foreground opacity-60", CARD)}>
                Internal Code
              </span>
              <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true" className="shrink-0 text-foreground/20">
                <path d="M1 5h18M15 1.5 19 5l-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="flex h-8 min-w-0 flex-1 items-center rounded-md border border-dashed border-border px-2.5 font-ui text-[12px] leading-4 text-faint-foreground">
                Skip
              </span>
            </motion.div>
          </div>
          <div className="flex items-center justify-between border-t border-separator px-4 py-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-ui text-[20px] font-semibold leading-6 tabular-nums text-foreground">
                <RowCounter to={48} />
              </span>
              <span className="font-ui text-[13px] leading-4 text-muted-foreground">rows ready</span>
            </div>
            <span className="flex h-[30px] items-center rounded-md bg-primary px-3.5 font-ui text-[12px] font-medium leading-4 text-primary-foreground">
              Import
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const SOURCES: { title: string; icon: IconName; left: number; meta: string; value: string }[] = [
  { title: "Product data", icon: "table", left: 138, meta: "Shelf life", value: "5 years" },
  { title: "Compliance", icon: "shield", left: 344, meta: "EU MDR", value: "Annex I 23.2" },
  { title: "Symbol library", icon: "hourglass", left: 550, meta: "ISO 15223-1", value: "5.1.4" },
];

const BUILD_PATHS = [
  "M230 380 C230 416 412 416 412 452",
  "M436 380 L436 452",
  "M642 380 C642 416 460 416 460 452",
];

function FlowDot({ path, dur, begin }: { path: string; dur: number; begin: number }) {
  return (
    <g opacity="0">
      <circle r="5" fill="currentColor" fillOpacity={0.06} />
      <circle r="2.5" fill="currentColor" />
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.45 0 0.25 1"
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.15;0.8;1"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
    </g>
  );
}

function BuildStage() {
  return (
    <>
      <svg width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden="true" className="absolute inset-0 text-foreground">
        {[230, 436, 642].map((x, index) => (
          <motion.line
            key={x}
            x1={x}
            y1="170"
            x2={x}
            y2="230"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth="1.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.2 + index * 0.06 }}
          />
        ))}
        {[230, 436, 642].map((x, index) => (
          <FlowDot
            key={`top-${x}`}
            path={`M${x} 170 L${x} 230`}
            dur={1.4}
            begin={0.7 + index * 0.25}
          />
        ))}
        {BUILD_PATHS.map((d, index) => (
          <g key={d}>
            <motion.path
              d={d}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth="1.25"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.6 + index * 0.08 }}
            />
            <FlowDot path={d} dur={2.4} begin={1.3 + index * 0.35} />
          </g>
        ))}
      </svg>

      <motion.div
        {...rise(0.05)}
        className={cn(
          "absolute left-[166px] top-[118px] flex h-[52px] w-[540px] items-center gap-3 rounded-xl border border-border bg-card pl-[18px] pr-2 dark:border-edge-2 dark:bg-surface-2",
          HALO,
        )}
      >
        <Glyph name="table" size={18} className="text-foreground" />
        <span className="flex-1 font-ui text-[14px] font-medium leading-[18px] text-foreground">
          Shelf life · IV Extension Set, 150 cm
        </span>
        <span className="flex h-[34px] items-center rounded-md bg-muted px-3.5 font-ui text-[12px] font-medium leading-4 text-muted-foreground dark:bg-surface-3">
          Label part
        </span>
      </motion.div>

      {SOURCES.map((source, index) => (
        <motion.div
          key={source.title}
          {...rise(0.3 + index * 0.08)}
          className={cn(
            "absolute top-[230px] flex h-[150px] w-[184px] flex-col justify-between rounded-xl border border-border bg-card p-4 dark:border-edge-2 dark:bg-surface-2",
            HALO,
          )}
          style={{ left: source.left }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Glyph name={source.icon} size={16} className="text-foreground" />
              <span className="font-ui text-[13px] font-medium leading-4 text-foreground">{source.title}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {[92, 76, 58].map((w) => (
                <span key={w} className="h-[5px] rounded-full bg-muted dark:bg-surface-3" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">{source.meta}</span>
            <span className="flex h-5 items-center rounded-tile bg-muted px-[7px] font-ui text-[11px] font-medium leading-[14px] text-foreground dark:bg-surface-3">
              {source.value}
            </span>
          </div>
        </motion.div>
      ))}

      <motion.div
        {...rise(0.9, 12)}
        className="absolute left-[156px] top-[452px] flex w-[560px] flex-col gap-3 rounded-2xl border border-border bg-card px-5 py-[18px] shadow-[0_0_0_5px_rgba(245,245,245,0.75),0_1px_2px_rgba(0,0,0,0.05),0_16px_32px_-16px_rgba(0,0,0,0.15)] dark:border-edge-2 dark:bg-surface-2 dark:shadow-[0_0_0_5px_rgba(14,14,14,0.75),0_1px_2px_rgba(0,0,0,0.3),0_16px_32px_-16px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2">
          <Glyph name="tag" size={16} className="text-foreground" />
          <span className="flex-1 font-ui text-[11px] font-medium uppercase leading-[14px] tracking-[0.08em] text-muted-foreground">
            Label part
          </span>
          <StatusBadge tone="draft" className="px-2 text-[11px] leading-4">
            Draft
          </StatusBadge>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border dark:border-edge-2">
            <Glyph name="hourglass" size={24} className="text-foreground" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-ui text-[16px] font-medium leading-[22px] text-foreground">Use by 2031-11-17</span>
            <span className="font-ui text-[13px] leading-[18px] text-muted-foreground">
              5 years from date of manufacture · ISO 15223-1 5.1.4
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const DOC_ROWS = [
  [34, 22],
  [18, 26, 20],
  [24, 30, 12],
  [14, 20, 16, 12],
  [28, 18],
  [20, 24, 14],
  [16, 30, 10],
  [22, 18, 20],
  [26, 14],
  [30, 16, 12],
  [12],
];

type Tint = "info" | "primary";

const TINT: Record<Tint, { row: string; bar: string }> = {
  info: {
    row: "border-l-info bg-[#155EEF0D] dark:bg-[#60A5FA14]",
    bar: "bg-[#155EEF33] dark:bg-[#60A5FA40]",
  },
  primary: {
    row: "border-l-primary bg-[#7F22FE0D] dark:bg-[#8F40FF1F]",
    bar: "bg-[#7F22FE33] dark:bg-[#A56BFF40]",
  },
};

const WINDOWS: {
  team: string;
  left: number;
  status: string;
  tone: StatusTone;
  shift: number;
  highlight?: { rows: number[]; tint: Tint; delay: number };
}[] = [
  {
    team: "Regulatory",
    left: 44,
    status: "Signed",
    tone: "released",
    shift: 0,
    highlight: { rows: [2, 3], tint: "info", delay: 1 },
  },
  {
    team: "Quality",
    left: 312,
    status: "Reviewing",
    tone: "primary",
    shift: 3,
    highlight: { rows: [6, 7], tint: "primary", delay: 1.2 },
  },
  {
    team: "Labeling",
    left: 580,
    status: "Waiting",
    tone: "draft",
    shift: 6,
  },
];

const CURSORS: {
  label: string;
  avatar: string;
  color: string;
  fill: string;
  arrow: [number, number];
  drift: { x: number[]; y: number[] };
  delay: number;
}[] = [
  { label: "Sarah · Regulatory", avatar: "/images/avatars/sara.webp", color: "bg-info", fill: "#155EEF", arrow: [206, 276], drift: { x: [-40, 0], y: [-30, 0] }, delay: 0.5 },
  { label: "Marta · Quality", avatar: "/images/avatars/marta.webp", color: "bg-primary", fill: "#7F22FE", arrow: [470, 340], drift: { x: [0, 12, -8, 0], y: [0, -5, 3, 0] }, delay: 0.7 },
  { label: "You", avatar: "/images/avatars/daniel.webp", color: "bg-[#171717] dark:bg-[#2A2A2A]", fill: "#171717", arrow: [700, 296], drift: { x: [0, -8, 6, 0], y: [0, 6, -4, 0] }, delay: 0.9 },
];

function ReviewStage() {
  return (
    <>
      {WINDOWS.map((win, index) => (
        <motion.div
          key={win.team}
          {...rise(0.05 + index * 0.08)}
          className={cn(
            "absolute top-[180px] flex h-80 w-62 flex-col overflow-hidden rounded-xl border border-border bg-card dark:border-edge-2 dark:bg-surface-2",
            HALO,
          )}
          style={{ left: win.left }}
        >
          <div className="flex h-[34px] shrink-0 items-center gap-2 border-b border-separator px-3">
            <div className="flex gap-[5px]">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="size-[7px] rounded-full bg-foreground/15" />
              ))}
            </div>
            <span className="flex-1 text-right font-ui text-[11px] font-medium leading-[14px] text-muted-foreground">{win.team}</span>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 py-4">
            {DOC_ROWS.map((_, row) => {
              const bars = DOC_ROWS[(row + win.shift) % DOC_ROWS.length];
              const lit = win.highlight?.rows.includes(row);
              const tint = win.highlight ? TINT[win.highlight.tint] : null;
              return (
                <div key={row} className="relative flex h-1.5 items-center gap-1 px-4">
                  {lit && tint && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: EASE_OUT, delay: win.highlight!.delay }}
                      className={cn("absolute inset-x-0 -inset-y-[5px] border-l-2", tint.row)}
                    />
                  )}
                  {bars.map((width, bar) => (
                    <span
                      key={bar}
                      className={cn(
                        "relative h-1.5 rounded-full transition-colors duration-500",
                        row === 0 && bar === 0
                          ? "bg-[#6A6A6A4D]"
                          : lit && tint && bar === 1
                            ? tint.bar
                            : "bg-foreground/[0.07]",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-separator px-3.5 py-3">
            <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">Label_EU · v4</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT, delay: 1.1 + index * 0.25 }}
              className="flex"
            >
              <StatusBadge tone={win.tone} className="px-2 text-[11px] leading-4">
                {win.status}
              </StatusBadge>
            </motion.span>
          </div>
        </motion.div>
      ))}

      {CURSORS.map((cursor, index) => (
        <motion.div
          key={cursor.label}
          className="absolute"
          style={{ left: cursor.arrow[0], top: cursor.arrow[1] }}
          initial={{ opacity: 0, x: cursor.drift.x[0], y: cursor.drift.y[0] }}
          animate={{ opacity: 1, x: cursor.drift.x, y: cursor.drift.y }}
          transition={{
            opacity: { duration: 0.3, delay: cursor.delay },
            x:
              index === 0
                ? { duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: cursor.delay }
                : { duration: 5, ease: "easeInOut", repeat: Infinity, delay: cursor.delay },
            y:
              index === 0
                ? { duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: cursor.delay }
                : { duration: 5, ease: "easeInOut", repeat: Infinity, delay: cursor.delay },
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <path d="M4 3l15 7.5-6.5 1.8L10 19z" fill={cursor.fill} stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span
            className={cn(
              "absolute left-3 top-3.5 flex h-7 w-max items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-white py-0.5 pl-0.5 pr-2.5 font-ui text-[12px] font-medium leading-4 text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)] dark:border-[#EDEDED]",
              cursor.color,
            )}
          >
            <Image
              src={cursor.avatar}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="size-5 rounded-full object-cover object-top"
            />
            {cursor.label}
          </span>
        </motion.div>
      ))}
    </>
  );
}

const TIMELINE: {
  title: string;
  body: string;
  meta: string;
  state: "done" | "active" | "next";
}[] = [
  { title: "Data imported", body: "48 rows from PTA-5x40_specs.xlsx", meta: "2w", state: "done" },
  { title: "Label built", body: "EU pouch label · English", meta: "4d", state: "done" },
  { title: "Reviews signed", body: "Regulatory, Quality, Labeling", meta: "Today", state: "done" },
  { title: "Release v4", body: "Locking version, exporting PDF", meta: "In progress", state: "active" },
  { title: "Print-ready files", body: "Label_EU_v4.pdf to the printer", meta: "Up next", state: "next" },
  { title: "v5 draft", body: "The next edit starts here", meta: "Fri", state: "next" },
];

function ReleaseStage() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      {...rise(0.05, 10)}
      className={cn("absolute left-1/2 top-[108px] flex w-[500px] -translate-x-1/2 rounded-3xl p-1.5", FRAME)}
    >
      <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px]", CARD)}>
        <div className="flex items-center justify-between border-b border-separator px-[22px] py-[18px]">
          <div className="flex flex-col gap-0.5">
            <span className="font-ui text-[16px] font-semibold leading-[22px] text-foreground">Release timeline</span>
            <span className="font-ui text-[12px] leading-4 text-muted-foreground">IV Extension Set, 150 cm</span>
          </div>
          <span className="flex h-[26px] items-center rounded-sm bg-muted px-2.5 font-mono text-[12px] leading-4 text-foreground shadow-[inset_0_0_0_1px_var(--border)] dark:bg-surface-3">
            v4
          </span>
        </div>
        <div className="flex flex-col px-[22px] py-5">
          {TIMELINE.map((item, index) => (
            <motion.div key={item.title} {...rise(0.2 + index * 0.08, 4)} className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                {item.state === "done" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground/60 shadow-[0_0_0_4px_rgba(23,23,23,0.04)] dark:border-edge-2 dark:bg-surface-3 dark:shadow-[0_0_0_4px_rgba(255,255,255,0.04)]">
                    <Glyph name="check" size={12} strokeWidth={2.6} />
                  </span>
                )}
                {item.state === "active" && (
                  <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-primary shadow-[0_0_0_4px_var(--primary-100)] dark:shadow-[0_0_0_4px_rgba(143,64,255,0.25)]">
                    {!reduceMotion && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-primary"
                        animate={{ scale: [1, 1.8], opacity: [0, 0.28, 0] }}
                        transition={{ duration: 2.4, ease: "easeOut", times: [0, 0.25, 1], repeat: Infinity, delay: 0.9 }}
                      />
                    )}
                    <span className="relative size-2 rounded-full bg-card" />
                  </span>
                )}
                {item.state === "next" && (
                  <span className="size-7 shrink-0 rounded-full border-[1.5px] border-border bg-card dark:border-edge-3 dark:bg-surface-2" />
                )}
                {index < TIMELINE.length - 1 && (
                  <span className="relative min-h-3.5 w-[1.5px] flex-1 overflow-hidden bg-border">
                    {item.state === "done" && (
                      <motion.span
                        className="absolute inset-0 origin-top bg-foreground/30"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.4 + index * 0.12 }}
                      />
                    )}
                  </span>
                )}
              </div>
              <div className={cn("flex flex-1 justify-between gap-3", index < TIMELINE.length - 1 && "pb-3.5")}>
                <div className="flex flex-col gap-[3px] pt-[3px]">
                  <span
                    className={cn(
                      "font-ui text-[14px] font-medium leading-5",
                      item.state === "next" ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="font-ui text-[13px] leading-[18px] text-muted-foreground">{item.body}</span>
                </div>
                <span
                  className={cn(
                    "whitespace-nowrap pt-1 font-ui text-[13px] leading-[18px]",
                    item.state === "active" && "font-medium text-primary-700 dark:text-primary-300",
                    item.state === "done" && "text-muted-foreground",
                    item.state === "next" && "text-faint-foreground",
                  )}
                >
                  {item.meta}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const STAGES = [ImportStage, BuildStage, ReviewStage, ReleaseStage];
const STAGE_FOCUS = [
  { minScale: 0.66, panX: 604 },
  { minScale: 0.56, panX: 436 },
  { minScale: 0.58, panX: 436 },
  { minScale: 0.66, panX: 436 },
];

export default function HowItWorksSection() {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = React.useState(0);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-40px" });
  const seen = useInView(stageRef, { margin: "-40px", once: true });
  const Stage = STAGES[active];
  const focus = STAGE_FOCUS[active];
  const autoplay = !reduceMotion && inView;
  const showStage = reduceMotion || inView || seen;

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="how-heading" className="contents">
        <SectionHeader
          id="how-heading"
          anchorId="how-it-works"
          title="Four steps"
          mutedTitle="from data to release."
        >
          Start from the spreadsheets you already have. Uprevit checks them on
          the way in, routes every change for review and approval, and locks
          what you release.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[436px_minmax(0,1fr)]"
        >
          <div
            role="tablist"
            aria-label="How Uprevit works"
            aria-orientation="vertical"
            className="flex flex-col divide-y divide-separator rounded-tile bg-tile px-5 py-2 sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0 sm:bg-transparent sm:p-0 lg:grid-cols-1 lg:grid-rows-4"
          >
            {STEPS.map((step, index) => {
              const selected = index === active;
              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  id={`how-tab-${index}`}
                  aria-selected={selected}
                  aria-controls="how-panel"
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex cursor-pointer items-center py-4 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:rounded-tile sm:px-7 sm:py-6 lg:px-10 lg:py-0",
                    selected
                      ? "sm:bg-card dark:sm:bg-surface-2"
                      : "sm:bg-tile [@media(hover:hover)_and_(pointer:fine)]:hover:bg-card/60 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-1",
                  )}
                >
                  <span className="flex gap-3.5 sm:gap-[18px]">
                    <span className="relative w-0.5 shrink-0 overflow-hidden rounded-full bg-border">
                      {selected && (
                        <span
                          key={`${active}-${reduceMotion}`}
                          className={cn(
                            "absolute inset-0 rounded-full bg-foreground",
                            autoplay ? "how-progress" : "",
                          )}
                          style={
                            {
                              "--how-duration": `${STEP_MS}ms`,
                              animationPlayState: autoplay ? "running" : "paused",
                            } as React.CSSProperties
                          }
                          onAnimationEnd={() => setActive((current) => (current + 1) % STEPS.length)}
                        />
                      )}
                    </span>
                    <span className="flex flex-col gap-1 py-0.5 sm:gap-2">
                      <span className="flex items-center gap-2">
                        <Glyph
                          name={step.icon}
                          size={18}
                          className={cn(
                            "hidden transition-colors duration-200 sm:inline-block",
                            selected ? "text-foreground" : "text-muted-foreground",
                          )}
                        />
                        <span
                          className={cn(
                            "font-ui text-[15px] font-medium leading-[21px] transition-colors duration-200 sm:text-[16px] sm:leading-[22px]",
                            selected ? "text-foreground" : "text-faint-foreground sm:text-muted-foreground",
                          )}
                        >
                          <span className="mr-1.5 font-mono text-[13px] tabular-nums sm:hidden">
                            {String(index + 1).padStart(2, "0")} ·
                          </span>
                          {step.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "max-w-[300px] font-ui text-[14px] leading-[21px] transition-colors duration-200 sm:leading-[22px]",
                          selected ? "text-muted-foreground" : "hidden text-faint-foreground sm:block",
                        )}
                      >
                        {step.body}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div ref={stageRef} className="min-w-0">
            <ScaledCanvas
              width={STAGE_W}
              height={STAGE_H}
              minScale={focus.minScale}
              panX={focus.panX}
              panBelow={640}
              id="how-panel"
              role="tabpanel"
              aria-labelledby={`how-tab-${active}`}
              className="rounded-tile bg-tile"
            >
              <div aria-hidden="true" className="absolute inset-0">
                <DotsBackdrop className="opacity-80" />
                <AnimatePresence mode="popLayout">
                  {showStage && (
                    <motion.div
                      key={active}
                      className="absolute inset-0"
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.18, ease: EASE_OUT } }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                      <Stage />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScaledCanvas>
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
