"use client";

import * as React from "react";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { GovTile } from "@/features/marketing/landing-page/GovernanceSection";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

function RollingCount({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));

  React.useEffect(() => {
    if (reduceMotion) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.45, ease: EASE_OUT });
    return () => controls.stop();
  }, [mv, value, reduceMotion]);

  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

const TIMELINE_EVENTS = [
  {
    title: "Workflow started",
    detail: "Sara Patel routed 4 products",
    doneMeta: "Oct 12",
  },
  {
    title: "Changes requested",
    detail: "Marta Lindqvist flagged carton label size",
    doneMeta: "Oct 14",
  },
  {
    title: "Revision re-verified",
    detail: "Packaging and Regulatory sign-offs",
    doneMeta: "Oct 15",
  },
  {
    title: "All sign-offs collected",
    detail: "Audit record locked with timestamps",
    doneMeta: "Oct 15",
  },
  {
    title: "Released to production",
    detail: "4 live masters promoted to v4.0",
    doneMeta: "Oct 16",
  },
] as const;

const ROW_H = 52;
const SPINE_X = 8;
const SPINE_H = TIMELINE_EVENTS.length * ROW_H;

function ImmutableDecisionHistoryCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [activeIndex, setActiveIndex] = React.useState(reduceMotion ? 5 : 0);

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
      setActiveIndex(0);
      wait(1100, () => {
        setActiveIndex(1);
        wait(1150, () => {
          setActiveIndex(2);
          wait(1150, () => {
            setActiveIndex(3);
            wait(1150, () => {
              setActiveIndex(4);
              wait(1200, () => {
                setActiveIndex(5);
                wait(2600, run);
              });
            });
          });
        });
      });
    };

    wait(120, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const currentStep = reduceMotion ? 5 : activeIndex;

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[16px] p-1 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-10 items-center justify-between border-b border-separator px-4 dark:border-edge-1">
            <span className="font-ui text-[12px] font-semibold text-foreground">
              Decision timeline
            </span>
            <span className="rounded-md border border-stroke-primary bg-subtle px-2 py-0.5 font-mono text-[10px] text-muted-foreground dark:border-edge-2 dark:bg-surface-3">
              WF-042
            </span>
          </div>

          <div className="relative px-4 py-2.5">
            <svg
              width="16"
              height={SPINE_H}
              viewBox={`0 0 16 ${SPINE_H}`}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-2.5 text-foreground"
            >
              {TIMELINE_EVENTS.slice(0, -1).map((event, idx) => {
                const y1 = idx * ROW_H + 26 + 9;
                const y2 = (idx + 1) * ROW_H + 26 - 9;
                const segActive = currentStep > idx;
                return (
                  <DottedConnector
                    key={event.title}
                    d={`M${SPINE_X} ${y1}V${y2}`}
                    active={segActive}
                    canvasWidth={16}
                    canvasHeight={SPINE_H}
                    baseOpacity={0.18}
                    activeOpacity={0.78}
                    transition={{ duration: 0.55, ease: FLOW_EASE }}
                  />
                );
              })}
            </svg>

            <div className="relative flex flex-col">
              {TIMELINE_EVENTS.map((event, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                const metaLabel = isDone
                  ? event.doneMeta
                  : isCurrent
                    ? "In progress"
                    : idx === currentStep + 1
                      ? "Up next"
                      : "Pending";

                return (
                  <motion.div
                    key={event.title}
                    initial={false}
                    animate={{ opacity: isDone || isCurrent ? 1 : 0.48 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    style={{ height: ROW_H }}
                    className="relative flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative z-10 flex size-4 shrink-0 items-center justify-center rounded-full bg-card dark:bg-surface-2">
                        {isDone ? (
                          <motion.span
                            initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                            className="flex text-success"
                          >
                            <Icon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2} />
                          </motion.span>
                        ) : isCurrent ? (
                          <motion.span
                            initial={reduceMotion ? false : { scale: 0.85 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                            className="flex size-[15px] items-center justify-center rounded-full bg-invert shadow-[0_0_0_3px_rgba(23,23,23,0.1)] dark:shadow-[0_0_0_3px_rgba(237,237,237,0.12)]"
                          >
                            <span className="size-1.5 rounded-full bg-invert-foreground" />
                          </motion.span>
                        ) : (
                          <span className="size-3 rounded-full border border-dashed border-foreground/30 bg-card dark:bg-surface-2" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-ui text-[11.5px] leading-4",
                            isCurrent
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/85",
                          )}
                        >
                          {event.title}
                        </span>
                        <span className="font-ui text-[10px] leading-3.5 text-muted-foreground">
                          {event.detail}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 font-ui text-[10px] leading-4",
                        isCurrent ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {metaLabel}
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

interface FilterRule {
  id: string;
  join: "Where" | "And";
  field: string;
  op: string;
  value: string;
  remaining: number;
}

const FILTER_RULES: FilterRule[] = [
  { id: "status", join: "Where", field: "Status", op: "is", value: "Completed", remaining: 84 },
  {
    id: "function",
    join: "And",
    field: "Function",
    op: "contains",
    value: "Regulatory Affairs",
    remaining: 46,
  },
  {
    id: "product",
    join: "And",
    field: "Product",
    op: "includes",
    value: "IV Extension Set",
    remaining: 27,
  },
  { id: "date", join: "And", field: "Completed", op: "after", value: "Oct 1", remaining: 18 },
];

function AdvancedWorkflowSearchCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [autoCount, setAutoCount] = React.useState(reduceMotion ? 4 : 1);
  const [manualIds, setManualIds] = React.useState<string[] | null>(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion || !inView || manualIds !== null || paused) return;
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
      setAutoCount(1);
      wait(950, () => {
        setAutoCount(2);
        wait(950, () => {
          setAutoCount(3);
          wait(950, () => {
            setAutoCount(4);
            wait(3400, run);
          });
        });
      });
    };

    wait(150, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion, manualIds, paused]);

  const activeIds =
    manualIds ??
    FILTER_RULES.slice(0, reduceMotion ? 4 : autoCount).map((r) => r.id);

  const activeRules = FILTER_RULES.filter((r) => activeIds.includes(r.id));
  const totalWorkflows = 142;
  const matchingCount =
    activeRules.length === 0
      ? totalWorkflows
      : FILTER_RULES[activeRules.length - 1].remaining;
  const ratio = Math.max(0.08, matchingCount / totalWorkflows);

  const removeRule = (id: string) => {
    const next = activeIds.filter((item) => item !== id);
    setManualIds(next);
  };

  const addNextRule = () => {
    const missing = FILTER_RULES.find((r) => !activeIds.includes(r.id));
    if (!missing) return;
    setManualIds([...activeIds, missing.id]);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10"
    >
      <div className={cn("rounded-[16px] p-1 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-10 items-center justify-between border-b border-separator px-4 dark:border-edge-1">
            <span className="flex items-center gap-1.5 font-ui text-[12px] font-semibold text-foreground">
              <Icon icon={FilterIcon} size={13} strokeWidth={1.9} />
              Filters
            </span>
            <button
              type="button"
              onClick={() => setManualIds(activeRules.length > 0 ? [] : FILTER_RULES.map((r) => r.id))}
              className="flex min-h-6 cursor-pointer items-center rounded px-2 font-ui text-[10.5px] text-muted-foreground outline-none transition-[color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
            >
              {activeRules.length > 0 ? "Clear" : "Reset"}
            </button>
          </div>

          <div className="flex min-h-[184px] flex-col gap-1.5 p-3.5">
            {FILTER_RULES.map((rule, idx) => {
              const shown = activeIds.includes(rule.id);
              const joinLabel = activeRules[0]?.id === rule.id ? "Where" : "And";
              if (!shown) return null;
              return (
                <motion.div
                  key={rule.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  className="flex min-h-8 items-center gap-2"
                >
                  <span className="w-11 shrink-0 font-mono text-[9.5px] uppercase text-muted-foreground">
                    {idx === 0 ? "Where" : joinLabel}
                  </span>
                  <div className="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-separator bg-subtle/50 px-2.5 font-ui text-[11px] dark:border-edge-1 dark:bg-surface-3/30">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="shrink-0 font-medium text-foreground">{rule.field}</span>
                      <span className="shrink-0 text-muted-foreground">{rule.op}</span>
                      <span className="truncate rounded-md border border-stroke-primary bg-card px-1.5 py-0.5 font-ui text-[10.5px] font-medium text-foreground dark:border-edge-2 dark:bg-surface-2">
                        {rule.value}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${rule.field} filter`}
                      onClick={() => removeRule(rule.id)}
                      className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground outline-none transition-[color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.95] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
                    >
                      <Icon icon={Cancel01Icon} size={10} strokeWidth={2} />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {activeRules.length < FILTER_RULES.length && (
              <button
                type="button"
                onClick={addNextRule}
                className="ml-[52px] flex min-h-7 w-fit cursor-pointer items-center gap-1 rounded-md px-2 font-ui text-[10.5px] text-muted-foreground outline-none transition-[color,background-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              >
                + Add filter
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-separator px-4 py-3 dark:border-edge-1">
            <div className="flex items-baseline gap-1.5 font-ui text-[11.5px] text-muted-foreground tabular-nums">
              <strong className="font-semibold text-foreground">
                <RollingCount value={matchingCount} reduceMotion={reduceMotion} />
              </strong>
              <span>of {totalWorkflows} workflows</span>
            </div>
            <span role="status" aria-live="polite" className="sr-only">
              {manualIds !== null ? `${matchingCount} of ${totalWorkflows} workflows matching` : ""}
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-separator dark:bg-edge-2">
              <motion.div
                initial={false}
                animate={{ scaleX: ratio }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="h-full origin-left rounded-full bg-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowHistorySection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="workflow-history-heading" className="contents">
        <SectionHeader
          id="workflow-history-heading"
          anchorId="history"
          title="Every decision recorded."
          mutedTitle="Find any past sign-off fast."
        >
          Review an immutable timeline of starts, approvals, change requests, and
          approver replacements—and filter past workflows with multi-condition
          search.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Immutable decision history"
            body="Every start, approval, change request, and release promotion is preserved in one chronological trail."
            maxWidth={500}
          >
            <ImmutableDecisionHistoryCard reduceMotion={reduceMotion} />
          </GovTile>

          <GovTile
            title="Advanced workflow search"
            body="Filter historical approval workflows by status, function, product, and completion date."
            maxWidth={500}
          >
            <AdvancedWorkflowSearchCard reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
