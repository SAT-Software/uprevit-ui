"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  GridTableIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { GovTile } from "@/features/marketing/landing-page/GovernanceSection";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { StatusBadge } from "@/features/marketing/landing-page/StatusBadge";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.32, bounce: 0 };
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

function MiniSpinner() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="animate-spin text-foreground/55 [animation-duration:850ms] motion-reduce:animate-none"
    >
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.22} strokeWidth="2.3" />
      <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function useChoreography(durations: readonly number[], reduceMotion: boolean) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const lastStage = durations.length - 1;
  const [stage, setStage] = React.useState(reduceMotion ? lastStage : 0);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const advance = (idx: number) => {
      if (cancelled) return;
      setStage(idx);
      timer = setTimeout(() => {
        advance((idx + 1) % durations.length);
      }, durations[idx]);
    };

    timer = setTimeout(() => advance(0), 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inView, reduceMotion, durations]);

  return [ref, reduceMotion ? lastStage : stage, inView] as const;
}

/* ------------------ Card 1: Workbook Specs & Params ---------------------- */

const WORKBOOK_DURATIONS = [900, 1250, 1300, 1350, 2600] as const;

function WorkbookInlineDiffCard({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, stage, inView] = useChoreography(WORKBOOK_DURATIONS, reduceMotion);
  const scanning = stage === 1 && inView && !reduceMotion;
  const row1Active = stage === 2;
  const row1Done = stage >= 2;
  const row2Active = stage === 3;
  const row2Done = stage >= 3;
  const changeCount = (row1Done ? 1 : 0) + (row2Done ? 1 : 0);

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[15px] p-1 shadow-[0_12px_26px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col overflow-hidden rounded-[11px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-9 items-center justify-between border-b border-separator bg-subtle/60 px-3 dark:border-edge-1 dark:bg-surface-3/30">
            <span className="flex items-center gap-1.5 font-ui text-[11px] font-semibold text-foreground">
              <Icon icon={GridTableIcon} size={13} strokeWidth={1.8} className="text-muted-foreground" />
              Specs workbook
            </span>
            <StatusBadge
              tone={changeCount > 0 ? "released" : "draft"}
              size="xs"
              leadingIcon={scanning ? <MiniSpinner /> : undefined}
            >
              <span className="tabular-nums">
                {scanning
                  ? "Comparing"
                  : changeCount === 0
                    ? "v4 → v5"
                    : `${changeCount} ${changeCount === 1 ? "change" : "changes"}`}
              </span>
            </StatusBadge>
          </div>

          <div className="flex flex-col gap-1.5 p-2.5">
            {/* Row 1: Updated cell with left accent & strike-through */}
            <motion.div
              initial={false}
              animate={{
                y: row1Active ? -1 : 0,
                opacity: row2Active ? 0.72 : 1,
              }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={cn(
                "relative flex min-h-[42px] items-center justify-between overflow-hidden rounded-[9px] border px-3 py-1.5 transition-[border-color,box-shadow] duration-300",
                row1Active
                  ? "border-foreground/20 bg-card shadow-[0_6px_14px_-8px_rgba(0,0,0,0.16)] dark:border-edge-3 dark:bg-surface-2"
                  : "border-separator bg-card dark:border-edge-1 dark:bg-surface-2",
              )}
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: row1Done ? 1 : 0, opacity: row1Done ? 1 : 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
                className="absolute inset-y-0 left-0 w-[2.5px] origin-top bg-stage-released"
              />
              <div className="flex flex-col">
                <span className="font-ui text-[11px] font-semibold leading-3.5 text-foreground">
                  Tubing length
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">Row 4 · Spec</span>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10.5px] leading-3">
                <span
                  className={cn(
                    "relative transition-colors duration-300",
                    row1Done ? "text-destructive-strong" : "text-foreground",
                  )}
                >
                  150 cm
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ scaleX: row1Done ? 1 : 0 }}
                    transition={{ duration: 0.34, ease: FLOW_EASE }}
                    className="absolute inset-x-0 top-1/2 h-px origin-left bg-destructive-strong"
                  />
                </span>
                <motion.span
                  initial={false}
                  animate={{ opacity: row1Done ? 1 : 0, x: row1Done ? 0 : -4 }}
                  transition={{ duration: 0.28, delay: row1Done ? 0.12 : 0, ease: EASE_OUT }}
                  className="flex items-center gap-1"
                >
                  <Icon icon={ArrowRight02Icon} size={10} strokeWidth={2} className="text-muted-foreground" />
                  <span className="font-semibold text-success-strong">180 cm</span>
                </motion.span>
              </span>
            </motion.div>

            {/* Row 2: Inserted cell */}
            <motion.div
              initial={false}
              animate={{
                y: row2Active ? -1 : 0,
                opacity: row2Done ? 1 : 0.48,
              }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className={cn(
                "relative flex min-h-[42px] items-center justify-between overflow-hidden rounded-[9px] border px-3 py-1.5 transition-[border-color,box-shadow] duration-300",
                row2Active
                  ? "border-foreground/20 bg-card shadow-[0_6px_14px_-8px_rgba(0,0,0,0.16)] dark:border-edge-3 dark:bg-surface-2"
                  : row2Done
                    ? "border-separator bg-card dark:border-edge-1 dark:bg-surface-2"
                    : "border-dashed border-stroke-strong bg-subtle/35 dark:border-edge-2 dark:bg-surface-3/15",
              )}
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: row2Done ? 1 : 0, opacity: row2Done ? 1 : 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
                className="absolute inset-y-0 left-0 w-[2.5px] origin-top bg-stage-submitted"
              />
              <div className="flex flex-col">
                <span className="font-ui text-[11px] font-semibold leading-3.5 text-foreground">
                  Burst pressure
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  {row2Done ? "Row 5 · Added" : "Row 5 · Checking"}
                </span>
              </div>
              <AnimatePresence initial={false} mode="popLayout">
                {row2Done ? (
                  <motion.span
                    key="added-val"
                    initial={reduceMotion ? false : { opacity: 0, x: 6, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={SPRING}
                    className="flex items-center gap-1.5 font-mono text-[10.5px] leading-3"
                  >
                    <span className="font-semibold text-info-strong">410 kPa</span>
                    <StatusBadge tone="submitted" size="xs">
                      New
                    </StatusBadge>
                  </motion.span>
                ) : (
                  <motion.span
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[10px] text-muted-foreground"
                  >
                    —
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Row 3: Anchored unchanged row */}
            <div className="flex h-[34px] items-center justify-between rounded-[9px] border border-separator/70 bg-subtle/35 px-3 opacity-75 dark:border-edge-1 dark:bg-surface-3/20">
              <span className="font-ui text-[10.5px] text-muted-foreground">Internal diameter</span>
              <span className="font-mono text-[10px] text-muted-foreground">3.0 mm</span>
            </div>
          </div>

          <div className="flex h-8 items-center gap-2.5 border-t border-separator bg-subtle/50 px-3 dark:border-edge-1 dark:bg-surface-3/25">
            <div className="flex h-1 flex-1 gap-0.5 overflow-hidden rounded-full bg-separator dark:bg-edge-2">
              <motion.span
                initial={false}
                animate={{ scaleX: row1Done ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="h-full flex-1 origin-left rounded-full bg-stage-released"
              />
              <motion.span
                initial={false}
                animate={{ scaleX: row2Done ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="h-full flex-1 origin-left rounded-full bg-stage-submitted"
              />
            </div>
            <span className="font-mono text-[9.5px] text-muted-foreground tabular-nums">
              {changeCount}/14 cells
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Card 2: ISO Symbols & Label Presence ----------------- */

const PRESENCE_TARGETS = [
  {
    label: "Pouch",
    status: "Added",
    kind: "added" as const,
    path: "M160 2V18H53V34",
    endX: 53,
  },
  {
    label: "Carton",
    status: "Added",
    kind: "added" as const,
    path: "M160 2V34",
    endX: 160,
  },
  {
    label: "IFU",
    status: "Removed",
    kind: "removed" as const,
    path: "M160 2V18H267V34",
    endX: 267,
  },
] as const;

const ISO_DURATIONS = [850, 1050, 1050, 1150, 2600] as const;

function IsoPresenceDiffCard({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, stage, inView] = useChoreography(ISO_DURATIONS, reduceMotion);
  const symbolReady = stage >= 1;

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[15px] p-1 shadow-[0_12px_26px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col rounded-[11px] border border-border bg-card p-3 dark:border-edge-2 dark:bg-surface-2">
          {/* Level 1: Symbol card */}
          <motion.div
            initial={false}
            animate={{
              y: stage === 1 ? -1 : 0,
            }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="flex items-center justify-between gap-2 rounded-[9px] border border-separator bg-subtle/40 px-2.5 py-2.5 dark:border-edge-1 dark:bg-surface-3/30"
          >
            <div className="flex items-center gap-2.5">
              <motion.span
                initial={false}
                animate={{ scale: stage === 1 ? 1.06 : 1 }}
                transition={SPRING}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-stroke-primary bg-card text-foreground shadow-[0_2px_6px_-3px_rgba(0,0,0,0.1)] dark:border-edge-2 dark:bg-surface-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M6.2 17.8L17.8 6.2" />
                </svg>
              </motion.span>
              <div className="flex flex-col">
                <span className="font-ui text-[12px] font-semibold leading-4 text-foreground">
                  Damaged Package
                </span>
                <span className="font-mono text-[10px] leading-[14px] text-muted-foreground">
                  ISO 15223-1 · 5.2.8
                </span>
              </div>
            </div>

            <StatusBadge
              tone="submitted"
              size="xs"
              leadingIcon={!symbolReady && inView && !reduceMotion ? <MiniSpinner /> : undefined}
            >
              {symbolReady ? "Added" : "Syncing"}
            </StatusBadge>
          </motion.div>

          {/* Connecting Level + Level 2 locked to same max-width so SVG spokes always hit tile centers */}
          <div className="mx-auto w-full max-w-[360px]">
            <div className="relative h-9 w-full">
              <svg
                viewBox="0 0 320 36"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none h-full w-full overflow-visible text-foreground"
              >
                {PRESENCE_TARGETS.map((target, idx) => {
                  const active = stage >= idx + 2;
                  return (
                    <g key={target.label}>
                      <DottedConnector
                        d={target.path}
                        active={active}
                        canvasWidth={320}
                        canvasHeight={36}
                        baseOpacity={0.2}
                        activeOpacity={target.kind === "removed" ? 0.58 : 0.8}
                        transition={{ duration: 0.45, ease: FLOW_EASE }}
                      />
                      {!reduceMotion && inView && active && (
                        <g opacity="0">
                          <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                          <circle r="2" fill="currentColor" />
                          <animateMotion
                            path={target.path}
                            dur="1.55s"
                            begin={`${idx * 0.22}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                            keyTimes="0;1"
                            keySplines="0.45 0 0.25 1"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.16;0.84;1"
                            dur="1.55s"
                            begin={`${idx * 0.22}s`}
                            repeatCount="indefinite"
                          />
                        </g>
                      )}
                      <circle
                        cx={target.endX}
                        cy={34}
                        r="3"
                        strokeWidth="1.2"
                        className={cn(
                          "fill-card transition-colors duration-300 dark:fill-surface-2",
                          active ? "stroke-foreground/65" : "stroke-foreground/30",
                        )}
                      />
                    </g>
                  );
                })}

                <circle
                  cx={160}
                  cy={2}
                  r="3"
                  strokeWidth="1.2"
                  className={cn(
                    "fill-card transition-colors duration-300 dark:fill-surface-2",
                    stage >= 2 ? "stroke-foreground/65" : "stroke-foreground/30",
                  )}
                />
              </svg>
            </div>

            {/* Level 2: 3 Label-type presence tiles */}
            <div className="grid grid-cols-3 gap-2">
              {PRESENCE_TARGETS.map((target, idx) => {
                const lit = stage >= idx + 2;
                const isJustLit = stage === idx + 2;
                const isRemoved = target.kind === "removed";
                return (
                  <motion.div
                    key={target.label}
                    initial={false}
                    animate={{
                      y: isJustLit ? -2 : 0,
                      opacity: lit ? (isRemoved ? 0.72 : 1) : 0.45,
                    }}
                    transition={{ duration: 0.32, ease: EASE_OUT }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-[9px] border px-2 py-2.5 text-center transition-[border-color,box-shadow] duration-300",
                      isJustLit
                        ? "border-foreground/25 bg-card shadow-[0_6px_14px_-8px_rgba(0,0,0,0.16)] dark:border-edge-3 dark:bg-surface-2"
                        : lit
                          ? "border-separator bg-card dark:border-edge-1 dark:bg-surface-2"
                          : "border-dashed border-stroke-strong bg-subtle/30 dark:border-edge-2 dark:bg-surface-3/15",
                    )}
                  >
                    <span className="flex size-5 items-center justify-center">
                      <AnimatePresence initial={false} mode="popLayout">
                        {lit ? (
                          <motion.span
                            key="state"
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={SPRING}
                            className={cn(
                              "flex size-5 items-center justify-center rounded-full",
                              isRemoved
                                ? "border border-destructive/30 bg-card text-destructive-strong"
                                : "bg-invert text-invert-foreground",
                            )}
                          >
                            {isRemoved ? (
                              <span className="h-[1.5px] w-2 rounded-full bg-destructive" />
                            ) : (
                              <Icon icon={Tick02Icon} size={11} strokeWidth={2.5} />
                            )}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            className="size-3.5 rounded-full border border-dashed border-foreground/30"
                          />
                        )}
                      </AnimatePresence>
                    </span>

                    <span
                      className={cn(
                        "relative font-ui text-[11px] font-semibold leading-3.5 text-foreground",
                        lit && isRemoved && "text-muted-foreground",
                      )}
                    >
                      {target.label}
                      {isRemoved && (
                        <motion.span
                          aria-hidden="true"
                          initial={false}
                          animate={{ scaleX: lit ? 1 : 0 }}
                          transition={{ duration: 0.34, ease: FLOW_EASE }}
                          className="absolute inset-x-[-2px] top-1/2 h-px origin-left bg-destructive-strong"
                        />
                      )}
                    </span>

                    <span className="flex items-center gap-1 font-ui text-[9.5px] leading-3 text-muted-foreground">
                      <span
                        className={cn(
                          "size-[4.5px] rounded-full transition-colors duration-300",
                          !lit
                            ? "bg-foreground/20"
                            : isRemoved
                              ? "bg-destructive"
                              : "bg-stage-submitted",
                        )}
                      />
                      {lit ? target.status : "Pending"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------- Card 3: Compliance & Label Tags --------------------- */

const COMPLIANCE_DURATIONS = [850, 1250, 1250, 1300, 2600] as const;

function ComplianceTagsDiffCard({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, stage] = useChoreography(COMPLIANCE_DURATIONS, reduceMotion);
  const stdLit = stage >= 1;
  const langLit = stage >= 2;
  const tagLit = stage >= 3;

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[15px] p-1 shadow-[0_12px_26px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col overflow-hidden rounded-[11px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          {/* Level 1: Mini synchronized label tag preview */}
          <div className="flex items-center justify-between gap-2 border-b border-separator bg-subtle/55 px-3 py-2.5 dark:border-edge-1 dark:bg-surface-3/25">
            <div className="flex items-center gap-1.5">
              <motion.span
                initial={false}
                animate={{
                  scale: stage === 1 ? 1.04 : 1,
                }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                className={cn(
                  "flex h-6 items-center rounded-[5px] border bg-card px-2 font-mono text-[9.5px] font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-300 dark:bg-surface-2",
                  stdLit ? "border-stage-released/55" : "border-stroke-primary dark:border-edge-2",
                )}
              >
                ISO-2021
              </motion.span>

              <motion.span
                initial={false}
                animate={{
                  opacity: langLit ? 1 : 0.35,
                  scale: stage === 2 ? 1.05 : 1,
                }}
                transition={SPRING}
                className={cn(
                  "flex h-6 items-center rounded-[5px] border px-2 font-mono text-[9.5px] font-medium text-foreground transition-colors duration-300",
                  langLit
                    ? "border-stage-submitted/55 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-surface-2"
                    : "border-dashed border-foreground/20 bg-transparent text-muted-foreground",
                )}
              >
                +DE
              </motion.span>

              <motion.span
                initial={false}
                animate={{
                  opacity: tagLit ? 1 : 0.45,
                  scale: stage === 3 ? 1.05 : 1,
                }}
                transition={SPRING}
                className={cn(
                  "flex h-6 items-center rounded-[5px] border px-2 font-mono text-[9.5px] font-medium text-foreground transition-colors duration-300",
                  tagLit
                    ? "border-foreground/30 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-surface-2"
                    : "border-dashed border-foreground/20 bg-transparent text-muted-foreground",
                )}
              >
                UDI
              </motion.span>
            </div>

            <span className="font-mono text-[9.5px] text-muted-foreground">Pouch</span>
          </div>

          {/* Level 2: Synchronized diff ledger */}
          <div className="flex flex-col gap-1.5 p-2.5">
            {/* Row 1: Standard edition */}
            <motion.div
              initial={false}
              animate={{
                y: stage === 1 ? -1 : 0,
                opacity: stdLit ? 1 : 0.5,
              }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className={cn(
                "relative flex min-h-9 items-center justify-between gap-2 overflow-hidden rounded-[8px] border px-2.5 py-1.5 transition-[border-color,box-shadow] duration-300",
                stage === 1
                  ? "border-foreground/20 bg-card shadow-[0_5px_12px_-7px_rgba(0,0,0,0.16)] dark:border-edge-3 dark:bg-surface-2"
                  : "border-separator bg-card dark:border-edge-1 dark:bg-surface-2",
              )}
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: stdLit ? 1 : 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="absolute inset-y-0 left-0 w-[2px] origin-top bg-stage-released"
              />
              <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px]">
                <span className="font-ui text-[11px] font-medium text-foreground">ISO 15223-1</span>
                <span className="relative text-destructive-strong">
                  2016
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ scaleX: stdLit ? 1 : 0 }}
                    transition={{ duration: 0.32, ease: FLOW_EASE }}
                    className="absolute inset-x-0 top-1/2 h-px origin-left bg-destructive-strong"
                  />
                </span>
                <Icon icon={ArrowRight02Icon} size={9} strokeWidth={2} className="shrink-0 text-muted-foreground" />
                <span className="font-semibold text-success-strong">2021</span>
              </span>
              <StatusBadge tone="released" size="xs">
                Updated
              </StatusBadge>
            </motion.div>

            {/* Row 2: Language */}
            <motion.div
              initial={false}
              animate={{
                y: stage === 2 ? -1 : 0,
                opacity: langLit ? 1 : 0.45,
              }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className={cn(
                "relative flex min-h-9 items-center justify-between gap-2 overflow-hidden rounded-[8px] border px-2.5 py-1.5 transition-[border-color,box-shadow] duration-300",
                stage === 2
                  ? "border-foreground/20 bg-card shadow-[0_5px_12px_-7px_rgba(0,0,0,0.16)] dark:border-edge-3 dark:bg-surface-2"
                  : "border-separator bg-card dark:border-edge-1 dark:bg-surface-2",
              )}
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: langLit ? 1 : 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="absolute inset-y-0 left-0 w-[2px] origin-top bg-stage-submitted"
              />
              <span className="flex min-w-0 items-center gap-2 font-ui text-[11px] font-medium text-foreground">
                <span
                  aria-hidden="true"
                  className="flex h-[10px] w-[15px] shrink-0 flex-col overflow-hidden rounded-[2px] ring-1 ring-black/10"
                >
                  <span className="flex-1 bg-[#171717]" />
                  <span className="flex-1 bg-[#D80027]" />
                  <span className="flex-1 bg-[#FFDA44]" />
                </span>
                <span className="truncate">German (DE)</span>
              </span>
              <StatusBadge tone="submitted" size="xs">
                Added
              </StatusBadge>
            </motion.div>

            {/* Row 3: Annotated label callout */}
            <motion.div
              initial={false}
              animate={{
                y: stage === 3 ? -1 : 0,
                opacity: tagLit ? 1 : 0.45,
              }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className={cn(
                "relative flex min-h-9 items-center justify-between gap-2 overflow-hidden rounded-[8px] border px-2.5 py-1.5 transition-[border-color,box-shadow] duration-300",
                stage === 3
                  ? "border-foreground/20 bg-card shadow-[0_5px_12px_-7px_rgba(0,0,0,0.16)] dark:border-edge-3 dark:bg-surface-2"
                  : "border-separator bg-card dark:border-edge-1 dark:bg-surface-2",
              )}
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: tagLit ? 1 : 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="absolute inset-y-0 left-0 w-[2px] origin-top bg-stage-released"
              />
              <span className="flex min-w-0 items-center gap-1.5 font-ui text-[11px]">
                <Icon
                  icon={CheckmarkCircle02Icon}
                  size={13}
                  strokeWidth={2}
                  className={cn(
                    "shrink-0 transition-colors duration-300",
                    tagLit ? "text-success" : "text-foreground/30",
                  )}
                />
                <span className="truncate font-medium text-foreground">UDI Callout</span>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {tagLit ? "4 zones" : "3 zones"}
                </span>
              </span>
              <StatusBadge tone="released" size="xs">
                Tagged
              </StatusBadge>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedlineTabsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="redline-tabs-heading" className="contents">
        <SectionHeader
          id="redline-tabs-heading"
          anchorId="seven-tabs"
          title="Not just text."
          mutedTitle="All seven tabs compared."
        >
          Track changes wherever labeling data shifts—across dimensions,
          sterilization, ISO symbols, label components, operational workbooks, and
          annotated label tags.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-3">
          <GovTile
            title="Workbook specs & parameters"
            body="Cell-level highlights inside Product Specifications and Operational Parameters tables."
            maxWidth={380}
          >
            <WorkbookInlineDiffCard reduceMotion={reduceMotion} />
          </GovTile>

          <GovTile
            title="ISO symbols & label presence"
            body="Spot added or removed symbols and label-type presence chips across Pouch, Carton, and IFU."
            maxWidth={380}
          >
            <IsoPresenceDiffCard reduceMotion={reduceMotion} />
          </GovTile>

          <GovTile
            title="Compliance & label tags"
            body="Catch added languages, updated standard editions, and modified label callout legends immediately."
            maxWidth={380}
          >
            <ComplianceTagsDiffCard reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
