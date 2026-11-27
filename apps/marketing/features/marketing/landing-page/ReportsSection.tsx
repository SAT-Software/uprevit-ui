"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import {
  ArrowDown02Icon,
  Bookmark01Icon,
  DashboardSpeed01Icon,
  DatabaseIcon,
  Download04Icon,
  FilterIcon,
  LayoutTable01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DottedConnector } from "./DottedConnector";
import { BrandBlindsBackdrop } from "./BrandBlindsBackdrop";
import { ScaledCanvas } from "./ScaledCanvas";
import { SectionHeader } from "./SectionHeader";
import { SectionPoints, type SectionPoint } from "./SectionPoints";
import { StatusBadge, type StatusTone } from "./StatusBadge";
import { usePlayback } from "./usePlayback";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.45, bounce: 0 };

const GLASS =
  "absolute border border-white/50 bg-white/30 shadow-[0_30px_60px_-24px_rgba(42,5,96,0.3)] backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06]";
const CARD = "overflow-hidden border border-border bg-card dark:border-edge-2 dark:bg-surface-2";

const CONDITIONS = [
  { join: "Where", field: "Barcode type", op: "=", value: "GS1-128", delay: 0.15 },
  { join: "And", field: "On label", op: "includes", value: "Pouch", delay: 0.42 },
  { join: "And", field: "Language", op: "includes", value: "German", delay: 0.68 },
];

const RESULTS: {
  name: string;
  ref: string;
  owner: string;
  avatar: string;
  status: string;
  tone: StatusTone;
  version: string;
  updated: string;
}[] = [
  { name: "IV Extension Set, 150 cm", ref: "PX-2042", owner: "Sara P.", avatar: "sara", status: "Released", tone: "released", version: "v5", updated: "2h ago" },
  { name: "Stopcock, 3-way", ref: "PX-1180", owner: "Marta L.", avatar: "marta", status: "Released", tone: "released", version: "v3", updated: "Yesterday" },
  { name: "Pressure Line, 200 cm", ref: "PX-2210", owner: "Ravi K.", avatar: "ravi", status: "Submitted", tone: "submitted", version: "v2", updated: "Nov 12" },
  { name: "Y-Connector", ref: "PX-2311", owner: "Sara P.", avatar: "sara", status: "Draft", tone: "draft", version: "v1", updated: "Nov 9" },
];

const SAVED = [
  { name: "GS1 pouch barcodes", meta: "Run just now" },
  { name: "Class III devices, German labels", meta: "Run last week" },
  { name: "Missing Basic UDI-DI", meta: "Run in Oct" },
];

const COLUMNS = [
  { label: "Product", width: 196, pad: "pl-4" },
  { label: "Owner", width: 120, pad: "pl-3" },
  { label: "Status", width: 112, pad: "pl-3" },
  { label: "Version", width: 70, pad: "pl-3" },
];

const LINKS = [
  {
    d: "M312 352V432",
    from: [312, 352] as const,
    to: [312, 432] as const,
    startArc: "M308.75 352A3.25 3.25 0 0 0 315.25 352",
    endArc: "M308.75 432A3.25 3.25 0 0 1 315.25 432",
    delay: 1.15,
  },
  {
    d: "M562 203H628",
    from: [562, 203] as const,
    to: [628, 203] as const,
    startArc: "M562 199.75A3.25 3.25 0 0 1 562 206.25",
    endArc: "M628 199.75A3.25 3.25 0 0 0 628 206.25",
    delay: 1.18,
  },
  {
    d: "M938 352V432",
    from: [938, 352] as const,
    to: [938, 432] as const,
    startArc: "M934.75 352A3.25 3.25 0 0 0 941.25 352",
    endArc: "M934.75 432A3.25 3.25 0 0 1 941.25 432",
    delay: 2.75,
  },
] as const;

const DOC_TOP_PATH =
  "M20 13V10.657C20 9.839 20 9.431 19.848 9.063C19.695 8.696 19.407 8.406 18.828 7.828L14.092 3.092C13.593 2.593 13.344 2.344 13.034 2.196C12.97 2.165 12.904 2.138 12.837 2.114C12.514 2 12.161 2 11.456 2C8.211 2 6.588 2 5.489 2.886C5.267 3.065 5.065 3.267 4.886 3.489C4 4.588 4 6.211 4 9.456V13M13 2.5V3C13 5.828 13 7.243 13.879 8.121C14.757 9 16.172 9 19 9H19.5";
const DOC_PDF_PATH =
  "M19.75 16H17.25C16.698 16 16.25 16.448 16.25 17V19M16.25 19V22M16.25 19H19.25M4.25 22V19.5M4.25 19.5V16H6C6.966 16 7.75 16.784 7.75 17.75C7.75 18.716 6.966 19.5 6 19.5H4.25ZM10.25 16H11.75C12.855 16 13.75 16.895 13.75 18V20C13.75 21.105 12.855 22 11.75 22H10.25V16Z";
const DOC_XLS_PATH =
  "M10.5 16V20C10.5 20.943 10.5 21.414 10.793 21.707C11.086 22 11.557 22 12.5 22H14M4 16L6 19M6 19L8 22M6 19L8 16M6 19L4 22M20 16H17.5C16.948 16 16.5 16.448 16.5 17V18C16.5 18.552 16.948 19 17.5 19H19C19.552 19 20 19.448 20 20V21C20 21.552 19.552 22 19 22H16.5";

function AppFileIcon({ kind, large }: { kind: "pdf" | "xlsx"; large?: boolean }) {
  const isPdf = kind === "pdf";
  const size = large ? 32 : 18;
  return (
    <span className={cn("relative flex shrink-0", large ? "size-8" : "size-[18px]")}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={large ? 0.55 : 0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 text-[#BDBDC2] dark:text-[#6E6E6E]"
      >
        <path d={DOC_TOP_PATH} />
        <path d={isPdf ? DOC_PDF_PATH : DOC_XLS_PATH} />
      </svg>
      <span
        className={cn(
          "absolute flex items-center justify-center font-ui font-bold text-white",
          isPdf ? "bg-[#C2410C]" : "bg-[#047857]",
          large
            ? "left-[0.5px] top-[14px] h-[11.5px] rounded-[3px] px-[3.5px] text-[6.5px] leading-[8px] tracking-[0.01em]"
            : "left-0 top-[8.5px] h-[7.5px] rounded-[2px] px-[2px] text-[5px] leading-[6px] tracking-[0.02em]",
        )}
      >
        {isPdf ? "PDF" : "XLSX"}
      </span>
    </span>
  );
}

function ReportsStage({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on, inView] = usePlayback(reduceMotion, 9500);
  const enter = (delay: number, from: { x?: number; y?: number } = { y: 4 }) => ({
    initial: false as const,
    animate: on ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...from },
    transition: on ? { duration: 0.4, ease: EASE_OUT, delay } : { duration: 0.2 },
  });

  return (
    <ScaledCanvas ref={ref} aria-hidden="true" width={1310} height={680} minScale={0.64} panX={312} panBelow={640}>
      <div className={cn(GLASS, "left-[62px] top-[54px] h-[298px] w-[500px] rounded-[20px] p-1.5")}>
        <div className="flex h-full flex-col gap-1.5">
          <div className={cn(CARD, "flex flex-1 flex-col rounded-[14px]")}>
            <div className="flex h-[54px] shrink-0 items-center gap-2 border-b border-separator pl-[18px] pr-3">
              <Icon icon={DatabaseIcon} size={16} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />
              <span className="font-ui text-[14px] font-semibold leading-5 text-foreground">Reports</span>
              <span className="flex-1 font-ui text-[14px] leading-5 text-muted-foreground">New query</span>
              <motion.span
                initial={false}
                animate={
                  on && !reduceMotion
                    ? { scale: [1, 0.94, 1.02, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.42, ease: EASE_OUT, delay: on ? 1.05 : 0 }}
                className="relative flex h-8 items-center gap-1.5 rounded-md bg-foreground pl-[11px] pr-3.5 font-ui text-[13px] font-semibold leading-[18px] text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(23,23,23,0.2)]"
              >
                <span className="relative flex size-[13px] items-center justify-center">
                  <motion.svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="fill-current"
                    initial={false}
                    animate={
                      on && !reduceMotion
                        ? { opacity: [1, 0, 0, 1], scale: [1, 0.88, 0.88, 1] }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{
                      duration: 0.65,
                      times: [0, 0.18, 0.78, 1],
                      ease: EASE_OUT,
                      delay: on ? 1.08 : 0,
                    }}
                  >
                    <path d="M8 5.5v13l10.5-6.5z" />
                  </motion.svg>
                  {!reduceMotion && inView && (
                    <motion.svg
                      width="13"
                      height="13"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="absolute inset-0"
                      initial={false}
                      animate={
                        on
                          ? { opacity: [0, 1, 1, 0], scale: [0.88, 1, 1, 0.88] }
                          : { opacity: 0, scale: 0.88 }
                      }
                      transition={{
                        duration: 0.65,
                        times: [0, 0.18, 0.78, 1],
                        ease: EASE_OUT,
                        delay: on ? 1.08 : 0,
                      }}
                    >
                      <g className="origin-center animate-spin motion-reduce:animate-none [animation-duration:700ms] [transform-box:fill-box]">
                        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth="2.2" />
                        <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </g>
                    </motion.svg>
                  )}
                </span>
                Run
              </motion.span>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2.5 bg-subtle px-[18px] py-4">
              {CONDITIONS.map((condition) => (
                <motion.div
                  key={condition.field}
                  initial={false}
                  animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={on ? { duration: 0.32, ease: EASE_OUT, delay: condition.delay } : { duration: 0.18 }}
                  className="flex items-center gap-3"
                >
                  <motion.span
                    initial={false}
                    animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
                    transition={on ? { duration: 0.25, ease: EASE_OUT, delay: condition.delay } : { duration: 0.15 }}
                    className="w-11 shrink-0 font-ui text-[13px] leading-[18px] text-muted-foreground"
                  >
                    {condition.join}
                  </motion.span>
                  <span className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-border bg-card pl-3 pr-2 font-ui text-[13px] leading-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-3">
                    <span className="font-semibold text-foreground">{condition.field}</span>
                    <motion.span
                      initial={false}
                      animate={on ? { opacity: 1 } : { opacity: 0 }}
                      transition={on ? { duration: 0.22, ease: EASE_OUT, delay: condition.delay + 0.08 } : { duration: 0.15 }}
                      className="text-muted-foreground"
                    >
                      {condition.op}
                    </motion.span>
                    <motion.span
                      initial={false}
                      animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={on ? { ...SPRING, delay: condition.delay + 0.14 } : { duration: 0.15 }}
                      className="flex h-6 items-center rounded-[7px] border border-border bg-muted px-2 text-[12px] font-semibold leading-4 text-foreground dark:border-edge-2 dark:bg-surface-2"
                    >
                      {condition.value}
                    </motion.span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex h-10 shrink-0 items-center justify-between rounded-xl border border-border bg-card px-3 font-ui text-[13px] leading-[18px] text-muted-foreground tabular-nums dark:border-edge-2 dark:bg-surface-2">
            <motion.span {...enter(1.4)} className="flex items-center gap-2">
              <Icon icon={LayoutTable01Icon} size={15} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />
              24 products match
            </motion.span>
            <motion.span {...enter(1.4)} className="flex items-center gap-1.5">
              <Icon icon={DashboardSpeed01Icon} size={15} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />
              0.4{"\u00A0"}s
            </motion.span>
          </div>
        </div>
      </div>

      <div className={cn(GLASS, "left-[142px] top-[432px] h-[192px] w-[340px] rounded-2xl p-[5px]")}>
        <div className={cn(CARD, "flex h-full flex-col rounded-[11px]")}>
          <div className="flex h-[46px] shrink-0 items-center gap-2 px-3.5">
            <Icon icon={Bookmark01Icon} size={14} strokeWidth={1.8} className="shrink-0 text-foreground" />
            <span className="flex-1 font-ui text-[13px] font-semibold leading-[18px] text-foreground">Saved queries</span>
            <span className="font-ui text-[11px] leading-[14px] text-faint-foreground tabular-nums">3</span>
          </div>
          {SAVED.map((query, index) => (
            <motion.div
              key={query.name}
              initial={false}
              animate={
                index === 0
                  ? on
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -6 }
                  : { opacity: 1, y: 0 }
              }
              transition={
                index === 0 && on
                  ? { duration: 0.35, ease: EASE_OUT, delay: 1.35 }
                  : { duration: 0.2 }
              }
              className={cn(
                "flex flex-1 items-center gap-2.5 border-t border-separator px-3.5 font-ui",
                index === 0 && "bg-muted dark:bg-surface-3",
              )}
            >
              <span className={cn("flex-1 whitespace-nowrap text-[12px] leading-4 text-foreground", index === 0 && "font-medium")}>
                {query.name}
              </span>
              <span className="text-[11px] leading-[14px] text-faint-foreground">{query.meta}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={cn(GLASS, "left-[628px] top-[54px] h-[298px] w-[620px] rounded-[20px] p-1.5")}>
        <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]">
          <div className="flex h-[60px] shrink-0 items-center justify-between pl-4 pr-3.5">
            <span className="flex items-center gap-2">
              <span className="font-ui text-[14px] font-medium leading-[18px] text-foreground">Query results</span>
            </span>
            <span className="flex items-center gap-2">
              {(["pdf", "xlsx"] as const).map((kind, index) => (
                <motion.span
                  key={kind}
                  initial={false}
                  animate={
                    on && !reduceMotion
                      ? { scale: [1, 0.94, 1.02, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.38, ease: EASE_OUT, delay: on ? 2.4 + index * 0.22 : 0 }}
                  className="flex h-[34px] items-center gap-2 rounded-lg border border-stroke-strong bg-gradient-to-b from-white to-[#F7F7F7] px-3 font-ui text-[12px] font-medium leading-4 text-foreground shadow-[inset_0_1px_0_#FFFFFF,0_1px_2px_rgba(0,0,0,0.08)] dark:border-edge-3 dark:from-surface-3 dark:to-surface-2 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_2px_rgba(0,0,0,0.35)]"
                >
                  <AppFileIcon kind={kind} />
                  Export
                </motion.span>
              ))}
            </span>
          </div>
          <div className="flex h-[34px] shrink-0 items-center border-y border-file-line bg-subtle font-ui text-[12px] font-medium leading-4">
            {COLUMNS.map((column) => (
              <span key={column.label} className={cn("flex shrink-0 items-center gap-1 text-icon", column.pad)} style={{ width: column.width }}>
                {column.label}
                <Icon icon={UnfoldMoreIcon} size={12} strokeWidth={1.8} className="shrink-0 text-foreground/35" />
              </span>
            ))}
            <span className="flex flex-1 items-center justify-end gap-1 pl-3 pr-4 text-foreground">
              Updated
              <Icon icon={ArrowDown02Icon} size={12} strokeWidth={1.8} className="shrink-0 text-foreground" />
            </span>
          </div>
          {RESULTS.map((row, index) => (
            <motion.div
              key={row.ref}
              {...enter(1.6 + index * 0.08)}
              className={cn("flex h-12 shrink-0 items-center font-ui text-[13px] leading-4", index < RESULTS.length - 1 && "border-b border-separator")}
            >
              <span className="flex w-[196px] shrink-0 flex-col gap-0.5 pl-4">
                <span className="whitespace-nowrap font-medium text-foreground">{row.name}</span>
                <span className="font-mono text-[11px] leading-[14px] text-placeholder">{row.ref}</span>
              </span>
              <span className="flex w-[120px] shrink-0 items-center gap-2 pl-3 text-secondary-foreground">
                <Image
                  src={`/images/avatars/${row.avatar}.webp`}
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                  className="size-5 rounded-lg border border-separator object-cover object-top"
                />
                {row.owner}
              </span>
              <span className="flex w-[112px] shrink-0 pl-3">
                <StatusBadge tone={row.tone} className="px-2 py-0.5 text-[12px] leading-4">
                  {row.status}
                </StatusBadge>
              </span>
              <span className="flex w-[70px] shrink-0 pl-3">
                <span className="flex h-5 items-center rounded-sm border border-stroke-primary bg-muted px-1.5 font-mono text-[11px] leading-4 text-secondary-foreground dark:border-edge-2 dark:bg-surface-3">
                  {row.version}
                </span>
              </span>
              <span className="flex flex-1 justify-end pr-4 text-icon">{row.updated}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={cn(GLASS, "left-[768px] top-[432px] h-[192px] w-[340px] rounded-2xl p-[5px]")}>
        <div className={cn(CARD, "flex h-full flex-col rounded-[11px]")}>
          <div className="flex h-[46px] shrink-0 items-center justify-between px-3.5">
            <span className="font-ui text-[13px] font-semibold leading-[18px] text-foreground">Report exports</span>
            <motion.span
              initial={false}
              animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={on ? { ...SPRING, delay: 4.1 } : { duration: 0.2 }}
              className="flex"
            >
              <StatusBadge tone="neutral" size="sm">
                2 ready
              </StatusBadge>
            </motion.span>
          </div>
          {[
            { kind: "xlsx" as const, name: "GS1 pouch barcodes.xlsx", readyDelay: 3.7 },
            { kind: "pdf" as const, name: "GS1 pouch barcodes.pdf", readyDelay: 4.1 },
          ].map((file, index) => (
            <motion.div
              key={file.name}
              {...enter(2.95 + index * 0.14)}
              className="flex flex-1 items-center gap-3 border-t border-separator pl-4 pr-3.5"
            >
              <AppFileIcon kind={file.kind} large />
              <span className="flex min-w-0 flex-1 flex-col font-ui">
                <span className="whitespace-nowrap text-[12px] font-medium leading-4 text-foreground">{file.name}</span>
                <span className="relative h-[14px] text-[11px] leading-[14px] text-muted-foreground">
                  {reduceMotion ? (
                    <span>24 products, ready</span>
                  ) : (
                    <>
                      <motion.span
                        className="absolute inset-0"
                        initial={false}
                        animate={on ? { opacity: 0 } : { opacity: 1 }}
                        transition={on ? { duration: 0.2, delay: file.readyDelay } : { duration: 0 }}
                      >
                        Processing…
                      </motion.span>
                      <motion.span
                        className="absolute inset-0"
                        initial={false}
                        animate={on ? { opacity: 1 } : { opacity: 0 }}
                        transition={on ? { duration: 0.25, delay: file.readyDelay } : { duration: 0 }}
                      >
                        24 products, ready
                      </motion.span>
                    </>
                  )}
                </span>
              </span>
              <span className="relative flex size-7 shrink-0 items-center justify-center">
                {!reduceMotion && inView && (
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="absolute text-foreground"
                    initial={false}
                    animate={
                      on
                        ? { opacity: 0, scale: 0.88, filter: "blur(2px)" }
                        : { opacity: 1, scale: 1, filter: "blur(0px)" }
                    }
                    transition={on ? { duration: 0.22, ease: EASE_OUT, delay: file.readyDelay } : { duration: 0 }}
                  >
                    <g className="origin-center animate-spin motion-reduce:animate-none [animation-duration:900ms] [transform-box:fill-box]">
                      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth="2" />
                      <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </motion.svg>
                )}
                <motion.span
                  initial={false}
                  animate={
                    on
                      ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                      : { opacity: 0, scale: 0.88, filter: "blur(2px)" }
                  }
                  transition={on ? { ...SPRING, delay: file.readyDelay } : { duration: 0.15 }}
                  className="flex size-7 items-center justify-center rounded-sm bg-foreground text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <Icon icon={Download04Icon} size={14} strokeWidth={1.8} />
                </motion.span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <svg width="1310" height="680" viewBox="0 0 1310 680" aria-hidden="true" className="pointer-events-none absolute inset-0 text-foreground">
        {LINKS.map((link) => (
          <g key={link.d}>
            <DottedConnector
              d={link.d}
              active={on}
              canvasWidth={1310}
              canvasHeight={680}
              transition={on ? { duration: 0.5, ease: FLOW_EASE, delay: link.delay } : { duration: 0.25 }}
            />
            {!reduceMotion && inView && (
              <motion.g
                initial={false}
                animate={
                  on
                    ? { x: [link.from[0], link.to[0]], y: [link.from[1], link.to[1]], opacity: [0, 1, 1, 0] }
                    : { x: link.from[0], y: link.from[1], opacity: 0 }
                }
                transition={on ? { duration: 0.55, ease: FLOW_EASE, delay: link.delay } : { duration: 0 }}
              >
                <circle cx="0" cy="0" r="2" className="fill-foreground" />
              </motion.g>
            )}
            <path d={link.startArc} strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
            <path d={link.endArc} strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
          </g>
        ))}
      </svg>
    </ScaledCanvas>
  );
}

const POINTS: SectionPoint[] = [
  {
    title: "Query any product field",
    body: "Combine up to 10 conditions across dates, barcodes, symbols, languages and more.",
    icon: FilterIcon,
  },
  {
    title: "Save queries for later",
    body: "Save a query once and rerun it whenever something changes.",
    icon: Bookmark01Icon,
  },
  {
    title: "Export to PDF or Excel",
    body: "Files are prepared in the background, ready when you are.",
    icon: Download04Icon,
  },
];

export default function ReportsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="reports-heading" className="contents">
        <SectionHeader id="reports-heading" anchorId="reports" title="Find every affected product" mutedTitle="in minutes, not weeks.">
          When a regulation or standard changes, build a report to list every product it touches, then export the list for
          your impact assessment.
        </SectionHeader>
        <TileRow centerClassName="relative overflow-hidden">
          <BrandBlindsBackdrop />
          <ReportsStage reduceMotion={reduceMotion} />
        </TileRow>
        <SectionPoints points={POINTS} />
      </section>
    </MotionConfig>
  );
}
