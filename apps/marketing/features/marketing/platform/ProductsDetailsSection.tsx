"use client";

import * as React from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  AddCircleIcon,
  CheckmarkCircle02Icon,
  FilterIcon,
  Layers01Icon,
  Note01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { GovTile } from "@/features/marketing/landing-page/GovernanceSection";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.24, bounce: 0 };
const FRAME = "border border-foreground/5 bg-frame-surface dark:border-edge-1";

function RollingPercent({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));

  React.useEffect(() => {
    if (reduceMotion) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.55, ease: EASE_OUT });
    return () => controls.stop();
  }, [mv, value, reduceMotion]);

  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

const COMPLETION_TABS = [
  "Compliance Standards",
  "Symbols & Graphics",
  "Operational Parameters",
] as const;

const COMPLETION_PCTS = [57, 71, 86, 100] as const;
const RING_CIRC = 47.1;

function TabCompletionCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [completedCount, setCompletedCount] = React.useState(reduceMotion ? 3 : 0);
  const [workingIdx, setWorkingIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number, fn: () => void) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    const run = () => {
      setCompletedCount(0);
      setWorkingIdx(null);

      wait(600, () => {
        setWorkingIdx(0);
        wait(950, () => {
          setCompletedCount(1);
          setWorkingIdx(null);
          wait(380, () => {
            setWorkingIdx(1);
            wait(950, () => {
              setCompletedCount(2);
              setWorkingIdx(null);
              wait(380, () => {
                setWorkingIdx(2);
                wait(950, () => {
                  setCompletedCount(3);
                  setWorkingIdx(null);
                  wait(2400, run);
                });
              });
            });
          });
        });
      });
    };

    wait(100, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const doneCount = reduceMotion ? 3 : completedCount;
  const activeWorking = reduceMotion ? null : workingIdx;
  const totalDone = 4 + doneCount;
  const pct = COMPLETION_PCTS[doneCount];
  const dashOffset = RING_CIRC * (1 - pct / 100);

  return (
    <div ref={ref} aria-hidden="true" className="relative px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[16px] p-1 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.1)]", FRAME)}>
        <div className="flex flex-col gap-2.5 rounded-[12px] border border-border bg-card p-3.5 dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-center justify-between pb-1">
            <span className="flex items-center gap-2 font-ui text-[13px] font-semibold text-foreground tabular-nums">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="-rotate-90">
                <circle
                  cx="10"
                  cy="10"
                  r="7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.12}
                  strokeWidth="2.4"
                />
                <motion.circle
                  cx="10"
                  cy="10"
                  r="7.5"
                  fill="none"
                  stroke={doneCount === 3 ? "var(--stage-released)" : "var(--primary)"}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRC}
                  initial={false}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: EASE_OUT }}
                />
              </svg>
              {totalDone} / 7 tabs complete
            </span>
            <span className="flex h-5 items-center gap-1 rounded-full border border-stroke-primary bg-subtle px-2 font-mono text-[10px] font-medium text-foreground dark:border-edge-2 dark:bg-surface-3">
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-300",
                  doneCount === 3 ? "bg-stage-released" : activeWorking !== null ? "bg-foreground/45" : "bg-foreground/30",
                )}
              />
              <RollingPercent value={pct} reduceMotion={reduceMotion} />%
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {COMPLETION_TABS.map((label, idx) => {
              const isDone = idx < doneCount;
              const isWorking = activeWorking === idx;
              return (
                <motion.div
                  key={label}
                  initial={false}
                  animate={{
                    opacity: isDone || isWorking ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-[9px] border px-3 transition-[border-color,box-shadow,background-color] duration-300",
                    isDone
                      ? "border-separator bg-white dark:border-edge-1 dark:bg-surface-3/40"
                      : isWorking
                        ? "border-foreground/20 bg-white shadow-[0_3px_10px_-4px_rgba(0,0,0,0.09)] dark:border-edge-3 dark:bg-surface-2"
                        : "border-dashed border-stroke-strong bg-white/60 dark:border-edge-2 dark:bg-surface-3/20",
                  )}
                >
                  <span className="relative flex size-4 shrink-0 items-center justify-center">
                    <AnimatePresence initial={false} mode="popLayout">
                      {isDone ? (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", duration: 0.24, bounce: 0 }}
                          className="flex text-success"
                        >
                          <Icon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} />
                        </motion.span>
                      ) : isWorking ? (
                        <motion.span
                          key="working"
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{ duration: 0.2 }}
                          className="flex"
                        >
                          {inView && !reduceMotion && (
                            <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true" className="animate-spin motion-reduce:animate-none text-foreground/55 [animation-duration:900ms]">
                              <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.22} strokeWidth="2.2" />
                              <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                          )}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="size-3.5 rounded-full border-[1.4px] border-dashed border-foreground/30"
                        />
                      )}
                    </AnimatePresence>
                  </span>
                  <span
                    className={cn(
                      "truncate font-ui text-[12px] transition-colors duration-250",
                      isDone || isWorking ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------- Card 2: Flexible custom fields -------------------- */

const CUSTOM_FIELDS = [
  { key: "Latex-Free", value: "Not made with NRL" },
  { key: "DEHP-Free", value: "Phthalate-free" },
  { key: "MRI Safety", value: "MR Conditional" },
] as const;

type FieldStep =
  | { mode: "idle"; committed: number; fadingOut?: boolean }
  | { mode: "clicking"; committed: number; fadingOut?: boolean }
  | { mode: "typing"; committed: number; chars: number; fadingOut?: boolean };

function CustomFieldsCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [state, setState] = React.useState<FieldStep>(
    reduceMotion ? { mode: "idle", committed: 2 } : { mode: "idle", committed: 0 },
  );

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number, fn: () => void) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    const runCycle = () => {
      setState({ mode: "idle", committed: 0, fadingOut: false });

      const addNext = (index: number) => {
        if (index >= CUSTOM_FIELDS.length) {
          wait(2800, () => {
            setState({ mode: "idle", committed: CUSTOM_FIELDS.length, fadingOut: true });
            wait(380, runCycle);
          });
          return;
        }
        const label = CUSTOM_FIELDS[index].key;
        const pauseBeforeClick = index === 0 ? 900 : 680;
        wait(pauseBeforeClick, () => {
          setState({ mode: "clicking", committed: index, fadingOut: false });
          wait(260, () => {
            let count = 0;
            const typeChar = () => {
              count += 1;
              setState({ mode: "typing", committed: index, chars: count, fadingOut: false });
              if (count < label.length) {
                wait(100 + (count % 3) * 20, typeChar);
              } else {
                wait(560, () => {
                  setState({ mode: "idle", committed: index + 1, fadingOut: false });
                  addNext(index + 1);
                });
              }
            };
            wait(140, typeChar);
          });
        });
      };

      addNext(0);
    };

    wait(0, runCycle);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const effectiveState: FieldStep = reduceMotion
    ? { mode: "idle", committed: 2, fadingOut: false }
    : state;

  const isFadingOut = Boolean(effectiveState.fadingOut);
  const visibleCount = Math.min(CUSTOM_FIELDS.length, effectiveState.committed + 1);

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <motion.div
        animate={{ opacity: isFadingOut ? 0 : 1 }}
        transition={{ duration: 0.34, ease: EASE_OUT }}
        className="flex min-h-[156px] flex-col justify-start gap-2"
      >
        {CUSTOM_FIELDS.slice(0, visibleCount).map((field, idx) => {
          const isCommitted = idx < effectiveState.committed;
          const isActiveInput = idx === effectiveState.committed;
          const isClicking = isActiveInput && effectiveState.mode === "clicking";
          const isTyping = isActiveInput && effectiveState.mode === "typing";
          const typedChars = isTyping ? effectiveState.chars : 0;
          const showValue =
            isCommitted || (isTyping && typedChars >= Math.ceil(field.key.length * 0.55));

          return (
            <motion.div
              key={field.key}
              initial={reduceMotion || idx === 0 ? false : { opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isClicking ? 0.985 : 1,
              }}
              transition={{
                opacity: { duration: 0.36, ease: EASE_OUT },
                y: { duration: 0.36, ease: EASE_OUT },
                scale: { duration: 0.16, ease: EASE_OUT },
              }}
              className={cn(
                "flex h-11 shrink-0 items-center justify-between gap-2 rounded-xl border px-3.5 transition-[border-color,background-color,box-shadow] duration-250",
                isCommitted
                  ? "border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2"
                  : isTyping || isClicking
                    ? "border-foreground/25 bg-white shadow-[0_4px_12px_-6px_rgba(0,0,0,0.08)] dark:border-edge-3 dark:bg-surface-2"
                    : "border-dashed border-stroke-strong bg-subtle/50 dark:border-edge-3 dark:bg-surface-3/20",
              )}
            >
              <span className="flex items-center gap-2.5 font-ui text-[12.5px]">
                <span className="relative flex size-5 shrink-0 items-center justify-center">
                  {isCommitted ? (
                    <motion.span
                      key="tick"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", duration: 0.24, bounce: 0 }}
                      className="flex size-5 items-center justify-center rounded-full bg-muted text-foreground dark:bg-surface-3"
                    >
                      <Icon icon={Tick02Icon} size={11} strokeWidth={2.2} />
                    </motion.span>
                  ) : (
                    <Icon
                      icon={AddCircleIcon}
                      size={15}
                      strokeWidth={2}
                      className={cn(
                        "transition-colors duration-150",
                        isTyping || isClicking ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  )}
                </span>

                <span className="flex items-center gap-px">
                  {isCommitted ? (
                    <span className="font-medium text-foreground">{field.key}</span>
                  ) : isTyping ? (
                    <span className="font-medium text-foreground">{field.key.slice(0, typedChars)}</span>
                  ) : (
                    <span className="text-muted-foreground">Add custom field…</span>
                  )}
                  {(isClicking || isTyping) && (
                    <motion.span
                      aria-hidden="true"
                      className="h-3.5 w-[1.5px] rounded-[1px] bg-foreground"
                      animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
                    />
                  )}
                </span>
              </span>

              <motion.span
                initial={false}
                animate={{ opacity: showValue ? 1 : 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                className="truncate font-ui text-[11.5px] text-muted-foreground"
              >
                {field.value}
              </motion.span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ---------------- Card 3: Excel-grade workbook controls ------------------ */

const WORKBOOK_CONTROLS: { title: string; detail: string; icon: IconSvgElement }[] = [
  { title: "Multi-sheet tabs", detail: "Organize specs in linked sheets", icon: Layers01Icon },
  { title: "Find & Replace", detail: "Bulk-edit values across all tabs", icon: Search01Icon },
  { title: "Column filters", detail: "Sort and slice spec tolerances fast", icon: FilterIcon },
  { title: "Excel export", detail: "Round-trip clean .xlsx workbooks", icon: Note01Icon },
];

const CONTROL_PERCENTS = [9.33, 36.44, 63.56, 90.67] as const;

function WorkbookControlsCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || !inView || hovered !== null || selected !== null || isFocused) return;
    const id = setInterval(() => setTick((value) => value + 1), 2400);
    return () => clearInterval(id);
  }, [reduceMotion, inView, hovered, selected, isFocused]);

  const active = hovered ?? selected ?? (reduceMotion ? 1 : (1 + tick) % WORKBOOK_CONTROLS.length);
  const control = WORKBOOK_CONTROLS[active];

  return (
    <div
      ref={ref}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      className="relative flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-4 sm:px-8 lg:px-10"
    >
      <div className="relative flex w-full max-w-[300px] items-center justify-between">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-0 -translate-y-1/2 border-t border-dashed border-stroke-strong dark:border-edge-3"
        />
        {WORKBOOK_CONTROLS.map((item, idx) => {
          const isActive = idx === active;
          return (
            <motion.button
              key={item.title}
              type="button"
              aria-label={`${item.title}: ${item.detail}`}
              aria-pressed={isActive}
              onClick={() => setSelected((prev) => (prev === idx ? null : idx))}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(idx)}
              onBlur={() => setHovered(null)}
              animate={{ scale: isActive ? 1.08 : 1 }}
              transition={SPRING}
              className={cn(
                "relative z-10 flex size-12 cursor-pointer items-center justify-center rounded-full border-[3px] border-white outline-none transition-[background-color,color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:size-14 dark:border-surface-2",
                isActive
                  ? "bg-invert text-invert-foreground shadow-[0_0_0_5px_rgba(23,23,23,0.08),0_10px_20px_-8px_rgba(0,0,0,0.3)]"
                  : "bg-file-frame text-foreground shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_4px_10px_-4px_rgba(0,0,0,0.1)] dark:bg-surface-3",
              )}
            >
              <Icon icon={item.icon} size={18} strokeWidth={1.7} />
            </motion.button>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="relative mt-4 flex w-full max-w-[300px] flex-col items-center"
      >
        <div className="relative h-[5px] w-full">
          <svg
            width="10"
            height="5"
            viewBox="0 0 10 5"
            aria-hidden="true"
            style={{ left: `${CONTROL_PERCENTS[active]}%` }}
            className="absolute top-0 -translate-x-1/2 text-tooltip transition-[left] duration-250 ease-out"
          >
            <path d="M0 5L5 0L10 5z" fill="currentColor" />
          </svg>
        </div>
        <div className="flex h-[32px] w-full items-center justify-start overflow-hidden rounded-md bg-tooltip px-3 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={control.title}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 3, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -3, filter: "blur(3px)" }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex w-full items-center justify-start gap-1.5 whitespace-nowrap font-ui text-[11.5px] leading-4 text-tooltip-foreground"
            >
              <span className="shrink-0 text-white/65">{control.title}</span>
              <span className="shrink-0 text-white/35">·</span>
              <span className="truncate font-medium">{control.detail}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {selected !== null ? `${WORKBOOK_CONTROLS[selected].title}: ${WORKBOOK_CONTROLS[selected].detail}` : ""}
      </span>
    </div>
  );
}

export default function ProductsDetailsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="products-details-heading" className="contents">
        <SectionHeader
          id="products-details-heading"
          anchorId="details"
          title="Built for the details"
          mutedTitle="teams edit every day."
        >
          Track completion across all seven tabs, extend product records with
          custom fields, and edit specs with familiar spreadsheet tools.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-3">
          <GovTile
            title="Per-tab completion & readiness"
            body="Mark each of the seven tabs complete as work finishes and verify submission readiness at a glance."
            maxWidth={380}
          >
            <TabCompletionCard reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Flexible custom fields"
            body="Add custom key-value attributes like DEHP-Free or MRI Safety to any product—and map them during bulk import."
            maxWidth={380}
          >
            <CustomFieldsCard reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Excel-grade workbook controls"
            body="Multi-sheet tabs, direct .xlsx import/export, Find & Replace, column filters, and conditional rules."
            maxWidth={380}
          >
            <WorkbookControlsCard reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
