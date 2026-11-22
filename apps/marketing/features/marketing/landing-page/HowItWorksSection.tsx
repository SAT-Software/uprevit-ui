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
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SectionHeader } from "./SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const STEP_MS = 6500;
const STAGE_W = 873;
const STAGE_H = 680;

const ICONS = {
  upload: (
    <>
      <path d="M5.25 21H18.75C18.982 21 19.098 21 19.196 20.99C20.146 20.897 20.897 20.146 20.99 19.196C21 19.098 21 18.982 21 18.75C21 18.518 21 18.402 20.99 18.304C20.897 17.354 20.146 16.603 19.196 16.51C19.098 16.5 18.982 16.5 18.75 16.5H17.061C16.832 16.5 16.718 16.5 16.609 16.512C16.232 16.554 15.874 16.702 15.578 16.939C15.492 17.008 15.411 17.089 15.25 17.25C15.089 17.411 15.008 17.492 14.922 17.561C14.626 17.798 14.268 17.946 13.891 17.988C13.782 18 13.668 18 13.439 18H10.561C10.332 18 10.218 18 10.109 17.988C9.732 17.946 9.374 17.798 9.078 17.561C8.992 17.492 8.911 17.411 8.75 17.25C8.589 17.089 8.508 17.008 8.422 16.939C8.126 16.702 7.768 16.554 7.391 16.512C7.282 16.5 7.168 16.5 6.939 16.5H5.25C5.018 16.5 4.902 16.5 4.804 16.51C3.854 16.603 3.103 17.354 3.01 18.304C3 18.402 3 18.518 3 18.75C3 18.982 3 19.098 3.01 19.196C3.103 20.146 3.854 20.897 4.804 20.99C4.902 21 5.018 21 5.25 21Z" />
      <path d="M16.5 7.5C16.5 7.5 13.186 3 12 3C10.814 3 7.5 7.5 7.5 7.5M12 4V15" />
    </>
  ),
  table: (
    <>
      <path d="M3.891 20.109C2.5 18.718 2.5 16.478 2.5 12C2.5 7.522 2.5 5.282 3.891 3.891C5.282 2.5 7.522 2.5 12 2.5C16.478 2.5 18.718 2.5 20.109 3.891C21.5 5.282 21.5 7.522 21.5 12C21.5 16.478 21.5 18.718 20.109 20.109C18.718 21.5 16.478 21.5 12 21.5C7.522 21.5 5.282 21.5 3.891 20.109Z" />
      <path d="M2.5 9L21.5 9M16 21.5L16 2.5M8 21.5L8 2.5" />
    </>
  ),
  shield: (
    <>
      <path d="M18.709 3.495C16.817 2.554 14.501 2 12 2C9.499 2 7.184 2.554 5.291 3.495C4.363 3.957 3.899 4.188 3.45 4.914C3 5.64 3 6.342 3 7.748V11.237C3 16.921 7.542 20.08 10.173 21.434C10.907 21.811 11.274 22 12 22C12.726 22 13.093 21.811 13.827 21.434C16.458 20.08 21 16.921 21 11.237L21 7.748C21 6.342 21 5.64 20.55 4.914C20.101 4.188 19.637 3.957 18.709 3.495Z" />
      <path d="M9 11.5C9 11.5 10.408 11.752 11 13.5C11 13.5 12.5 10.5 15 9.5" />
    </>
  ),
  lock: (
    <>
      <path d="M12 14.5V17.5M13 14.5C13 15.052 12.552 15.5 12 15.5C11.448 15.5 11 15.052 11 14.5C11 13.948 11.448 13.5 12 13.5C12.552 13.5 13 13.948 13 14.5Z" />
      <path d="M16.5 9V6.5C16.5 4.015 14.485 2 12 2C9.515 2 7.5 4.015 7.5 6.5V9" />
      <path d="M4.268 18.845C4.493 20.515 5.876 21.823 7.56 21.901C8.976 21.966 10.415 22 12 22C13.585 22 15.024 21.966 16.44 21.901C18.124 21.823 19.507 20.515 19.732 18.845C19.879 17.755 20 16.638 20 15.5C20 14.362 19.879 13.245 19.732 12.155C19.507 10.485 18.124 9.176 16.44 9.099C15.024 9.034 13.585 9 12 9C10.415 9 8.976 9.034 7.56 9.099C5.876 9.176 4.493 10.485 4.268 12.155C4.121 13.245 4 14.362 4 15.5C4 16.638 4.121 17.755 4.268 18.845Z" />
    </>
  ),
  hourglass: (
    <>
      <path d="M4 3H20M4 21H20" />
      <path d="M5.5 3V5.03C5.5 6.272 6.077 7.444 7.061 8.201L12 12L16.939 8.201C17.923 7.444 18.5 6.272 18.5 5.03V3" />
      <path d="M5.5 21V18.97C5.5 17.728 6.077 16.556 7.061 15.799L12 12L16.939 15.799C17.923 16.556 18.5 17.728 18.5 18.97V21" />
    </>
  ),
  tag: (
    <>
      <path d="M8 2H9.015C10.241 2 10.854 2 11.405 2.228C11.957 2.457 12.39 2.89 13.257 3.757L21.126 11.626C21.684 12.187 21.998 12.945 22 13.736L22 13.75L22 13.764C21.998 14.555 21.684 15.313 21.126 15.874L15.874 21.126C15.313 21.684 14.555 21.998 13.764 22L13.75 22L13.736 22C12.945 21.998 12.187 21.684 11.626 21.126L3.757 13.257C2.89 12.39 2.457 11.957 2.228 11.405C2 10.854 2 10.241 2 9.015V8C2 5.172 2 3.757 2.879 2.879C3.757 2 5.172 2 8 2Z" />
      <path d="M7.5 7.25V7.5M8 7.5C8 7.776 7.776 8 7.5 8C7.224 8 7 7.776 7 7.5C7 7.224 7.224 7 7.5 7C7.776 7 8 7.224 8 7.5Z" />
    </>
  ),
  check: <path d="M5 14L8.5 17.5L19 6.5" />,
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      {ICONS[name]}
    </svg>
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
          <span className="flex h-[22px] items-center gap-[5px] rounded-sm bg-muted px-2 font-ui text-[11px] font-medium leading-[14px] text-muted-foreground dark:bg-surface-3">
            <span className="size-1.5 rounded-full bg-stage-draft" />
            Draft
          </span>
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
  badge: string;
  dot: string;
  shift: number;
  highlight?: { rows: number[]; tint: Tint; delay: number };
}[] = [
  {
    team: "Regulatory",
    left: 44,
    status: "Signed",
    badge: "bg-success-soft text-success-strong",
    dot: "bg-success",
    shift: 0,
    highlight: { rows: [2, 3], tint: "info", delay: 1 },
  },
  {
    team: "Quality",
    left: 312,
    status: "Reviewing",
    badge: "bg-primary-50 text-primary-700 dark:bg-primary/15 dark:text-primary-300",
    dot: "bg-primary",
    shift: 3,
    highlight: { rows: [6, 7], tint: "primary", delay: 1.2 },
  },
  {
    team: "Labeling",
    left: 580,
    status: "Waiting",
    badge: "bg-muted text-muted-foreground dark:bg-surface-3",
    dot: "bg-stage-draft",
    shift: 6,
  },
];

const CURSORS: {
  label: string;
  avatar: string;
  color: string;
  fill: string;
  arrow: [number, number];
  side: "left" | "right";
  drift: { x: number[]; y: number[] };
  delay: number;
}[] = [
  { label: "Sarah · Regulatory", avatar: "/images/avatars/sara.webp", color: "bg-info", fill: "#155EEF", arrow: [206, 276], side: "left", drift: { x: [-40, 0], y: [-30, 0] }, delay: 0.5 },
  { label: "Marta · Quality", avatar: "/images/avatars/marta.webp", color: "bg-primary", fill: "#7F22FE", arrow: [470, 340], side: "left", drift: { x: [0, 12, -8, 0], y: [0, -5, 3, 0] }, delay: 0.7 },
  { label: "You", avatar: "/images/avatars/daniel.webp", color: "bg-[#171717] dark:bg-[#2A2A2A]", fill: "#171717", arrow: [700, 296], side: "right", drift: { x: [0, -8, 6, 0], y: [0, 6, -4, 0] }, delay: 0.9 },
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
              className={cn("flex h-[22px] items-center gap-[5px] rounded-sm px-2 font-ui text-[11px] font-medium leading-[14px]", win.badge)}
            >
              <span className={cn("size-1.5 rounded-full", win.dot)} />
              {win.status}
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
              "absolute top-[18px] flex h-7 w-max items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-white py-0.5 pl-0.5 pr-2.5 font-ui text-[12px] font-medium leading-4 text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)] dark:border-[#EDEDED]",
              cursor.color,
              cursor.side === "right" ? "left-3.5" : "right-1.5",
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
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-primary"
                      animate={{ scale: [1, 1.8], opacity: [0, 0.28, 0] }}
                      transition={{ duration: 2.4, ease: "easeOut", times: [0, 0.25, 1], repeat: Infinity, delay: 0.9 }}
                    />
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

function StageBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="tile-dots absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_62%_58%_at_50%_50%,transparent_42%,#000_64%,transparent_92%)]" />
    </div>
  );
}

const STAGES = [ImportStage, BuildStage, ReviewStage, ReleaseStage];

function useStageScale() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / STAGE_W));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, scale] as const;
}

export default function HowItWorksSection() {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = React.useState(0);
  const [stageRef, scale] = useStageScale();
  const inView = useInView(stageRef, { margin: "-120px" });
  const seen = useInView(stageRef, { margin: "-120px", once: true });
  const Stage = STAGES[active];
  const autoplay = !reduceMotion && inView;

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="how-heading" className="contents">
        <SectionHeader
          id="how-heading"
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
            className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-4"
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
                    "flex cursor-pointer items-center rounded-tile px-8 py-7 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring lg:px-10 lg:py-0",
                    selected
                      ? "bg-card dark:bg-surface-2"
                      : "bg-tile [@media(hover:hover)_and_(pointer:fine)]:hover:bg-card/60 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-1",
                  )}
                >
                  <span className="flex gap-[18px]">
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
                    <span className="flex flex-col gap-2 py-0.5">
                      <span className="flex items-center gap-2">
                        <Glyph
                          name={step.icon}
                          size={18}
                          className={cn("transition-colors duration-200", selected ? "text-foreground" : "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-ui text-[16px] font-medium leading-[22px] transition-colors duration-200",
                            selected ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {step.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "max-w-[300px] font-ui text-[14px] leading-[22px] transition-colors duration-200",
                          selected ? "text-muted-foreground" : "text-faint-foreground",
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

          <div
            ref={stageRef}
            id="how-panel"
            role="tabpanel"
            aria-labelledby={`how-tab-${active}`}
            className="relative overflow-hidden rounded-tile bg-tile"
            style={{ height: STAGE_H * scale }}
          >
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 origin-top"
              style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${scale})` }}
            >
              <StageBackdrop />
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.18, ease: EASE_OUT } }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  {seen ? <Stage /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
