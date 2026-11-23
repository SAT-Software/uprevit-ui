"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "./DotsBackdrop";
import { ScaledCanvas } from "./ScaledCanvas";
import { SectionHeader } from "./SectionHeader";
import { SectionPoints, type SectionPoint } from "./SectionPoints";
import { StatusBadge, type StatusTone } from "./StatusBadge";
import { usePlayback } from "./usePlayback";

const SPRING = { type: "spring" as const, duration: 0.5, bounce: 0 };

type Tone = "removed" | "updated" | "added";
type Part = string | { text: string };
type Cell = { line: number; label: string; parts: Part[]; tone?: Tone } | null;

const TONE: Record<Tone, { row: string; line: string; chip: string; text: string; strike?: boolean }> = {
  removed: {
    row: "border-l-destructive/50 bg-destructive/5",
    line: "text-destructive-strong",
    chip: "bg-destructive/12",
    text: "text-destructive-strong",
    strike: true,
  },
  updated: {
    row: "border-l-success/60 bg-success/[0.07]",
    line: "text-success-strong",
    chip: "bg-success/15",
    text: "text-success-strong",
  },
  added: {
    row: "border-l-info/50 bg-info/5",
    line: "text-info-strong",
    chip: "bg-info/12",
    text: "text-info-strong",
  },
};

const ROWS: [Cell, Cell][] = [
  [
    { line: 1, label: "Device name", parts: ["IV Extension Set, 150 cm"] },
    { line: 1, label: "Device name", parts: ["IV Extension Set, 150 cm"] },
  ],
  [
    { line: 2, label: "REF", parts: ["PX-2042"] },
    { line: 2, label: "REF", parts: ["PX-2042"] },
  ],
  [
    { line: 3, label: "Sterilization", parts: ["Sterilized using", { text: "ethylene oxide" }], tone: "removed" },
    { line: 3, label: "Sterilization", parts: ["Sterilized using", { text: "irradiation" }], tone: "updated" },
  ],
  [
    { line: 4, label: "Shelf life", parts: ["Use within", { text: "3" }, "years"], tone: "removed" },
    { line: 4, label: "Shelf life", parts: ["Use within", { text: "5" }, "years"], tone: "updated" },
  ],
  [null, { line: 5, label: "Max. pressure", parts: [{ text: "325 kPa" }], tone: "added" }],
  [{ line: 5, label: "Priming vol.", parts: [{ text: "2.1 mL" }], tone: "removed" }, null],
  [
    { line: 6, label: "Latex", parts: ["Not made with natural rubber latex"] },
    { line: 6, label: "Latex", parts: ["Not made with natural rubber latex"] },
  ],
  [
    { line: 7, label: "Storage", parts: ["Store between 5 °C and 40 °C"] },
    { line: 7, label: "Storage", parts: ["Store between 5 °C and 40 °C"] },
  ],
];

const BADGES: { label: string; tone: StatusTone }[] = [
  { label: "2 updated", tone: "released" },
  { label: "1 added", tone: "submitted" },
  { label: "1 removed", tone: "destructive" },
];

const SUMMARY = [
  { label: "Updated", count: 2, dot: "bg-success", grow: 2 },
  { label: "Added", count: 1, dot: "bg-info", grow: 1 },
  { label: "Removed", count: 1, dot: "bg-destructive", grow: 1 },
];

const HATCH =
  "bg-subtle bg-[repeating-linear-gradient(135deg,rgba(23,23,23,0.04)_0px,rgba(23,23,23,0.04)_1px,transparent_1px,transparent_6px)] dark:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_6px)]";
const FLOAT_FRAME =
  "absolute rounded-[18px] border border-border/50 bg-[#F5F5F5BF] p-[5px] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.2)] backdrop-blur-md dark:border-edge-2 dark:bg-surface-1/75";
const FLOAT_CARD = "rounded-[14px] border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2";

function DiffCell({ cell, on, delay }: { cell: Cell; on: boolean; delay: number }) {
  if (!cell) return <div className={cn("h-[30px] w-[422px] shrink-0", HATCH)} />;
  const tone = cell.tone ? TONE[cell.tone] : null;

  return (
    <div className="relative flex h-[30px] w-[422px] shrink-0 items-center gap-2.5 border-l-2 border-l-transparent pl-2 pr-3">
      {tone && (
        <motion.span
          aria-hidden="true"
          className={cn("absolute inset-y-0 -left-0.5 right-0 border-l-2", tone.row)}
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: on ? 0.35 : 0.25, delay: on ? delay : 0 }}
        />
      )}
      <span
        className={cn(
          "relative w-[18px] shrink-0 text-right font-ui text-[10px] font-medium leading-[14px] tabular-nums transition-colors duration-300",
          tone && on ? tone.line : "text-faint-foreground",
        )}
        style={{ transitionDelay: on ? `${delay}s` : "0s" }}
      >
        {cell.line}
      </span>
      <span className="relative w-[86px] shrink-0 whitespace-nowrap font-ui text-[11px] leading-[14px] text-foreground/40">{cell.label}</span>
      <span className="relative flex min-w-0 items-center gap-[3px]">
        {cell.parts.map((part, index) =>
          typeof part === "string" ? (
            <span key={index} className="whitespace-nowrap font-ui text-[12px] leading-[18px] text-foreground">
              {part}
            </span>
          ) : (
            <span key={index} className="relative whitespace-nowrap rounded-[3px] px-[3px] font-ui text-[12px] leading-[18px]">
              <motion.span
                aria-hidden="true"
                className={cn("absolute inset-0 rounded-[3px]", tone?.chip)}
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.9 }}
                transition={on ? { ...SPRING, delay: delay + 0.12 } : { duration: 0.2 }}
              />
              <span className={cn("relative transition-colors duration-300", on && tone ? tone.text : "text-foreground")} style={{ transitionDelay: on ? `${delay + 0.12}s` : "0s" }}>
                {part.text}
              </span>
              {tone?.strike && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-[3px] top-1/2 h-px origin-left bg-destructive-strong"
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={on ? { duration: 0.35, ease: [0.645, 0.045, 0.355, 1], delay: delay + 0.25 } : { duration: 0.15 }}
                />
              )}
            </span>
          ),
        )}
      </span>
    </div>
  );
}

function RedlinesStage({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on] = usePlayback(reduceMotion);
  const rowDelay = (row: number) => 0.25 + row * 0.11;
  const done = rowDelay(ROWS.length);

  return (
    <ScaledCanvas ref={ref} width={1310} height={540}>
      {[225, 1084].map((left) => (
        <span
          key={left}
          aria-hidden="true"
          className="absolute top-0 h-[540px] w-0 border-l border-dashed border-foreground/15 [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)]"
          style={{ left }}
        />
      ))}
      {[72, 405].map((top) => (
        <span
          key={top}
          aria-hidden="true"
          className="absolute left-0 h-0 w-[1310px] border-t border-dashed border-foreground/15 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]"
          style={{ top }}
        />
      ))}

      <div className="absolute left-[225px] top-[72px] w-[860px] rounded-[22px] border border-border/50 bg-[#F5F5F5BF] p-1.5 dark:border-edge-2 dark:bg-surface-1/75">
        <div className="overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3 dark:border-edge-2">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-foreground">
              <path d="M4 12.001L4 14.545C4 17.79 4 19.412 4.886 20.511C5.065 20.733 5.267 20.935 5.489 21.114C6.588 22 8.211 22 11.456 22C12.161 22 12.514 22 12.837 21.887C12.904 21.863 12.97 21.835 13.034 21.805C13.344 21.657 13.593 21.407 14.092 20.909L18.828 16.172C19.407 15.594 19.695 15.305 19.848 14.937C20 14.57 20 14.161 20 13.344V10.001C20 6.229 20 4.344 18.828 3.172C17.769 2.113 16.127 2.011 13.034 2.002M13 21.5V21C13 18.172 13 16.758 13.879 15.879C14.757 15.001 16.172 15.001 19 15.001H19.5" />
              <path d="M12 6H4M8 2V10" />
            </svg>
            <span className="flex min-w-0 flex-1 items-center gap-1.5 font-ui text-[13px] leading-4">
              <span className="font-semibold text-foreground">IV Extension Set</span>
              <span className="text-faint-foreground">/</span>
              <span className="text-muted-foreground">Pouch label</span>
            </span>
            <span className="flex items-center gap-1.5">
              {BADGES.map((badge, index) => (
                <motion.span
                  key={badge.label}
                  initial={false}
                  animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={on ? { ...SPRING, delay: done + index * 0.06 } : { duration: 0.2 }}
                  className="flex"
                >
                  <StatusBadge tone={badge.tone} className="px-2 py-0.5 text-[11px] leading-4">
                    {badge.label}
                  </StatusBadge>
                </motion.span>
              ))}
            </span>
            <span className="flex h-[18px] items-center rounded-tile bg-border px-1.5 font-ui text-[10px] font-semibold leading-3 text-foreground shadow-[inset_0_0_0_1px_rgba(23,23,23,0.15)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
              EN
            </span>
          </div>

          <div className="flex border-b border-border bg-muted/40 dark:border-edge-2">
            <div className="flex flex-1 items-center gap-2 px-4 py-1.5">
              <span className="rounded-[5px] bg-foreground/[0.06] px-1.5 font-mono text-[10px] leading-4 text-muted-foreground">v4</span>
              <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">Released 12 Mar 2026</span>
            </div>
            <span className="w-px shrink-0 bg-border dark:bg-edge-2" />
            <div className="flex flex-1 items-center gap-2 px-4 py-1.5">
              <span className="rounded-[5px] bg-foreground px-1.5 font-mono text-[10px] leading-4 text-background">v5</span>
              <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">Draft · edited 2h ago</span>
            </div>
          </div>

          <div className="relative flex flex-col py-1">
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-foreground/[0.04] to-transparent"
                initial={false}
                animate={on ? { y: [-48, 250], opacity: [0, 1, 1, 0] } : { y: -48, opacity: 0 }}
                transition={on ? { duration: ROWS.length * 0.11 + 0.3, ease: "linear", delay: 0.15 } : { duration: 0 }}
              />
            )}
            {ROWS.map(([left, right], row) => (
              <div key={row} className="flex">
                <DiffCell cell={left} on={on} delay={rowDelay(row)} />
                <span className="w-px shrink-0 bg-border dark:bg-edge-2" />
                <DiffCell cell={right} on={on} delay={rowDelay(row) + 0.05} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className={cn(FLOAT_FRAME, "left-[41px] top-[275px] w-[250px]")}
        initial={false}
        animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
        transition={on ? { ...SPRING, delay: 0.1 } : { duration: 0.25 }}
      >
        <div className={cn("flex flex-col overflow-hidden", FLOAT_CARD)}>
          <div className="flex flex-col gap-2.5 p-3.5">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-ui text-[11px] leading-[14px] text-icon">Changes since v4</span>
                <span className="font-sans text-[28px] font-medium leading-[30px] tracking-[-0.03em] text-foreground">4</span>
              </div>
              <span className="font-ui text-[11px] leading-[14px] text-placeholder">Pouch label</span>
            </div>
            <div className="flex h-1.5 gap-[3px]">
              {SUMMARY.map((item, index) => (
                <motion.span
                  key={item.label}
                  className={cn("origin-left rounded-full", item.dot)}
                  style={{ flexGrow: item.grow, flexBasis: 0 }}
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={on ? { duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: done + 0.1 + index * 0.08 } : { duration: 0.2 }}
                />
              ))}
            </div>
          </div>
          {SUMMARY.map((item) => (
            <div key={item.label} className="flex items-center justify-between border-t border-separator px-3.5 py-2 font-ui text-[12px] leading-4">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className={cn("size-1.5 rounded-full", item.dot)} />
                {item.label}
              </span>
              <span className="font-medium text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={cn(FLOAT_FRAME, "left-[935px] top-[327px] w-80")}
        initial={false}
        animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.97 }}
        transition={on ? { ...SPRING, delay: done + 0.5 } : { duration: 0.25 }}
      >
        <div className={cn("flex items-start gap-3 p-3.5", FLOAT_CARD)}>
          <span className="flex shrink-0 pt-px">
            {["/images/avatars/marta.webp", "/images/avatars/ravi.webp"].map((src, index) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={26}
                height={26}
                unoptimized
                className={cn("size-[26px] rounded-full object-cover object-top ring-2 ring-card dark:ring-surface-2", index > 0 && "-ml-2")}
              />
            ))}
          </span>
          <span className="flex flex-1 flex-col gap-[3px]">
            <span className="flex items-center justify-between">
              <span className="font-ui text-[13px] font-medium leading-4 text-foreground">Approvers notified</span>
              <span className="font-ui text-[11px] leading-[14px] text-placeholder">now</span>
            </span>
            <span className="font-ui text-[12px] leading-[17px] text-muted-foreground">
              Marta L. and Ravi K. were told the pouch label changed during review.
            </span>
          </span>
        </div>
      </motion.div>
    </ScaledCanvas>
  );
}

const POINTS: SectionPoint[] = [
  {
    title: "All product information compared",
    body: "Specs, label text, symbols and compliance details in one redline.",
    icon: (
      <>
        <path d="M9.606 4.813C10.786 4.271 11.376 4 12 4C12.624 4 13.214 4.271 14.394 4.813L19.287 7.061C21.096 7.891 22 8.307 22 9C22 9.693 21.096 10.109 19.287 10.939L14.394 13.187C13.214 13.729 12.624 14 12 14C11.376 14 10.786 13.729 9.606 13.187L4.713 10.939C2.904 10.109 2 9.693 2 9C2 8.307 2.904 7.891 4.713 7.061L9.606 4.813Z" />
        <path d="M20.233 13.5C21.411 14.062 22 14.441 22 15C22 15.693 21.096 16.109 19.287 16.939L14.394 19.187C13.214 19.729 12.624 20 12 20C11.376 20 10.786 19.729 9.606 19.187L4.713 16.939C2.904 16.109 2 15.693 2 15C2 14.441 2.589 14.062 3.767 13.5" />
      </>
    ),
  },
  {
    title: "Compare any two versions",
    body: "Check against the last release, or any earlier version.",
    icon: (
      <>
        <path d="M19 9H6.659C5.653 9 5.15 9 5.025 8.691C4.9 8.383 5.255 8.019 5.966 7.293L8.211 5" />
        <path d="M5 15H17.341C18.347 15 18.85 15 18.975 15.309C19.1 15.617 18.745 15.981 18.034 16.707L15.789 19" />
      </>
    ),
  },
  {
    title: "Approvers alerted to edits",
    body: "If a label changes during review, every approver gets a change notice.",
    icon: (
      <>
        <path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" />
        <path d="M19.231 18H4.769C3.792 18 3 17.208 3 16.231C3 15.762 3.186 15.312 3.518 14.98L4.121 14.377C4.684 13.815 5 13.051 5 12.256V9.5C5 5.634 8.134 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.256C19 13.051 19.316 13.815 19.879 14.377L20.482 14.98C20.814 15.312 21 15.762 21 16.231C21 17.208 20.208 18 19.231 18Z" />
      </>
    ),
  },
];

export default function RedlinesSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section id="redlines" aria-labelledby="redlines-heading" className="contents">
        <SectionHeader id="redlines-heading" title="Automatic redlines" mutedTitle="between any two versions.">
          Uprevit compares versions for you and marks every added, changed or removed value, so reviewers see exactly what
          is new.
        </SectionHeader>
        <TileRow centerClassName="relative overflow-hidden">
          <DotsBackdrop
            className="opacity-35"
            dotsClassName="[mask-image:radial-gradient(ellipse_78%_74%_at_50%_50%,transparent_64%,#000_82%,transparent_98%)]"
          />
          <RedlinesStage reduceMotion={reduceMotion} />
        </TileRow>
        <SectionPoints points={POINTS} />
      </section>
    </MotionConfig>
  );
}
