"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  CheckmarkCircle02Icon,
  GitBranchIcon,
  Note01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { GovTile } from "@/features/marketing/landing-page/GovernanceSection";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { StatusBadge } from "@/features/marketing/landing-page/StatusBadge";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.32, bounce: 0 };
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

type ThreadStage = 0 | 1 | 2 | 3 | 4 | 5;

function ScopedThreadsCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [stage, setStage] = React.useState<ThreadStage>(reduceMotion ? 5 : 0);

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
      setStage(0);
      wait(950, () => {
        setStage(1);
        wait(1200, () => {
          setStage(2);
          wait(900, () => {
            setStage(3);
            wait(900, () => {
              setStage(4);
              wait(320, () => {
                setStage(5);
                wait(3400, run);
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

  const currentStage: ThreadStage = reduceMotion ? 5 : stage;
  const showReply1 = currentStage >= 1;
  const showReply2 = currentStage >= 2;
  const showAction = currentStage >= 3;
  const isPressing = currentStage === 4;
  const isAddressed = currentStage >= 5;
  const replyCount = (showReply1 ? 1 : 0) + (showReply2 ? 1 : 0);

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[16px] p-1 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex flex-col gap-1.5 px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Image
                  src="/images/avatars/marta.webp"
                  alt="Marta Lindqvist"
                  width={22}
                  height={22}
                  unoptimized
                  className="size-[22px] shrink-0 rounded-full object-cover object-top ring-1 ring-black/10 dark:ring-white/15"
                />
                <span className="truncate font-ui text-[11.5px] font-semibold leading-4 text-foreground">
                  Marta Lindqvist
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">PX-2042</span>
                <span className="font-mono text-[9.5px] text-muted-foreground">10:24</span>
              </div>

              <StatusBadge tone={isAddressed ? "released" : "review"} size="sm">
                {isAddressed ? "Addressed" : "Change request"}
              </StatusBadge>
            </div>

            <p className="pl-[30px] font-ui text-[11px] leading-[1.45] text-foreground/85">
              Update carton dieline to 150 × 100 mm for the DE/FR warning block.
            </p>
          </div>

          <div className="relative flex min-h-[202px] flex-col justify-between gap-2 border-t border-separator bg-subtle/45 px-3.5 py-3 dark:border-edge-1 dark:bg-surface-3/20">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-11 left-[24px] top-4 w-px border-l border-dashed border-foreground/15"
            />

            <div className="relative flex flex-col gap-2">
              <motion.div
                initial={false}
                animate={showReply1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.34, ease: EASE_OUT }}
                className="flex items-start gap-2.5 rounded-lg border border-separator bg-card px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-edge-1 dark:bg-surface-2"
              >
                <Image
                  src="/images/avatars/sara.webp"
                  alt="Sara Patel"
                  width={20}
                  height={20}
                  unoptimized
                  className="mt-0.5 size-5 shrink-0 rounded-full object-cover object-top ring-1 ring-black/10 dark:ring-white/15"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-ui text-[11px] font-semibold leading-3.5 text-foreground">
                      Sara Patel
                    </span>
                    <span className="font-mono text-[9.5px] text-muted-foreground">10:31</span>
                  </div>
                  <span className="font-ui text-[10.5px] leading-[1.45] text-muted-foreground">
                    Resized carton to 150 × 100 mm and uploaded the revised dieline.
                  </span>
                  <span className="inline-flex w-fit items-center gap-1 rounded-[5px] border border-separator bg-subtle px-1.5 py-0.5 font-mono text-[9.5px] text-foreground/75 dark:border-edge-2 dark:bg-surface-3">
                    <Icon icon={Note01Icon} size={10} strokeWidth={1.8} />
                    carton-dieline-v5.pdf
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={showReply2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.34, ease: EASE_OUT }}
                className="flex items-start gap-2.5 rounded-lg border border-separator bg-card px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-edge-1 dark:bg-surface-2"
              >
                <Image
                  src="/images/avatars/marta.webp"
                  alt="Marta Lindqvist"
                  width={20}
                  height={20}
                  unoptimized
                  className="mt-0.5 size-5 shrink-0 rounded-full object-cover object-top ring-1 ring-black/10 dark:ring-white/15"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-ui text-[11px] font-semibold leading-3.5 text-foreground">
                      Marta Lindqvist
                    </span>
                    <span className="font-mono text-[9.5px] text-muted-foreground">10:38</span>
                  </div>
                  <span className="font-ui text-[10.5px] leading-[1.45] text-muted-foreground">
                    Verified DE/FR margins against Annex I — ready to resolve.
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="relative flex min-h-7 items-center justify-between pl-1">
              <span className="font-ui text-[10px] text-muted-foreground tabular-nums">
                {replyCount === 0
                  ? "Awaiting reply…"
                  : `${replyCount} ${replyCount === 1 ? "reply" : "replies"} in thread`}
              </span>

              <AnimatePresence initial={false} mode="popLayout">
                {showAction && !isAddressed && (
                  <motion.span
                    key="mark-btn"
                    initial={reduceMotion ? false : { opacity: 0, y: 4, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isPressing ? 0.93 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.14 } }}
                    transition={isPressing ? { duration: 0.14, ease: EASE_OUT } : SPRING}
                    className={cn(
                      "inline-flex h-[26px] items-center gap-1.5 rounded-[6px] bg-card px-2.5 font-ui text-[10.5px] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.06)] transition-shadow duration-150 dark:bg-surface-2 dark:shadow-[inset_0_0_0_1px_var(--edge-3)]",
                      isPressing && "shadow-[inset_0_0_0_1px_var(--stroke-strong),0_0_0_3px_rgba(23,23,23,0.08)]",
                    )}
                  >
                    <Icon icon={Tick02Icon} size={11} strokeWidth={2.4} className="text-stage-released" />
                    Mark addressed
                  </motion.span>
                )}

                {isAddressed && (
                  <motion.span
                    key="addressed-state"
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRING}
                    className="inline-flex h-[26px] items-center gap-1.5 px-1 font-ui text-[10.5px] font-medium text-success-strong"
                  >
                    <Icon icon={Tick02Icon} size={12} strokeWidth={2.4} className="text-stage-released" />
                    Marked addressed
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex min-h-11 items-center justify-between gap-2 border-t border-separator px-3.5 py-2 dark:border-edge-1">
            <span className="font-ui text-[11px] text-muted-foreground">
              {isAddressed ? "Thread resolved · change request closed" : "Reply to thread…"}
            </span>
            <span
              className={cn(
                "flex h-6 shrink-0 items-center rounded-md px-2 font-ui text-[10px] font-medium transition-colors duration-300",
                isAddressed
                  ? "bg-subtle text-muted-foreground dark:bg-surface-3"
                  : "bg-invert text-invert-foreground",
              )}
            >
              {isAddressed ? "Closed" : "Reply"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const APPROVAL_FUNCTIONS = [
  { name: "Regulatory Affairs", approver: "Marta Lindqvist", avatar: "/images/avatars/marta.webp" },
  { name: "Quality Assurance", approver: "Ravi Kulkarni", avatar: "/images/avatars/ravi.webp" },
  { name: "Labeling Lead", approver: "Sara Patel", avatar: "/images/avatars/sara.webp" },
] as const;

function ExplicitDecisionsCard({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [approvedCount, setApprovedCount] = React.useState(reduceMotion ? 3 : 0);
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
      setApprovedCount(0);
      setWorkingIdx(null);

      wait(600, () => {
        setWorkingIdx(0);
        wait(950, () => {
          setApprovedCount(1);
          setWorkingIdx(null);
          wait(420, () => {
            setWorkingIdx(1);
            wait(950, () => {
              setApprovedCount(2);
              setWorkingIdx(null);
              wait(420, () => {
                setWorkingIdx(2);
                wait(950, () => {
                  setApprovedCount(3);
                  setWorkingIdx(null);
                  wait(3200, run);
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

  const doneCount = reduceMotion ? 3 : approvedCount;
  const activeWorking = reduceMotion ? null : workingIdx;
  const allReady = doneCount === APPROVAL_FUNCTIONS.length;

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10">
      <div className={cn("rounded-[16px] p-1 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex flex-col gap-2 border-b border-separator p-3.5 dark:border-edge-1">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-ui text-[12px] font-semibold text-foreground">
                <Icon icon={GitBranchIcon} size={13} strokeWidth={2} />
                EU MDR Symbol &amp; UDI Update
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                WF-042
                <StatusBadge tone={allReady ? "released" : "draft"} size="sm">
                  {allReady ? "Ready" : "Verifying"}
                </StatusBadge>
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <span className="rounded bg-subtle px-1.5 py-0.5 text-foreground/75 dark:bg-surface-3">
                v3.0 Master
              </span>
              <span>→</span>
              <span className="rounded bg-foreground px-1.5 py-0.5 text-background">
                v4.0 Release
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-separator bg-subtle/50 px-3.5 py-2 font-mono text-[10px] dark:border-edge-1 dark:bg-surface-3/25">
            <span className="flex items-center gap-2.5">
              <span className="font-ui text-muted-foreground">4 products</span>
              <span className="text-success-strong">+12 updated</span>
              <span className="text-destructive-strong">-2 removed</span>
            </span>
            <span className="flex items-center gap-1">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-300",
                    dot < doneCount ? "bg-stage-released" : "bg-foreground/20",
                  )}
                />
              ))}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 p-3">
            {APPROVAL_FUNCTIONS.map((fn, idx) => {
              const isDone = idx < doneCount;
              const isWorking = activeWorking === idx;
              return (
                <motion.div
                  key={fn.name}
                  initial={false}
                  animate={{ opacity: isDone || isWorking ? 1 : 0.55 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  className={cn(
                    "flex min-h-9 items-center justify-between gap-2 rounded-[9px] border px-3 py-1.5 transition-[border-color,box-shadow,background-color] duration-300",
                    isDone
                      ? "border-separator bg-card dark:border-edge-1 dark:bg-surface-3/30"
                      : isWorking
                        ? "border-foreground/20 bg-card shadow-[0_3px_10px_-4px_rgba(0,0,0,0.08)] dark:border-edge-3 dark:bg-surface-2"
                        : "border-dashed border-stroke-strong bg-card/60 dark:border-edge-2 dark:bg-surface-3/20",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center gap-2 font-ui text-[11.5px] transition-colors duration-250",
                      isDone || isWorking ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span className="relative flex size-4 shrink-0 items-center justify-center">
                      <AnimatePresence initial={false} mode="popLayout">
                        {isDone ? (
                          <motion.span
                            key="ok"
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                            className="flex text-success"
                          >
                            <Icon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2} />
                          </motion.span>
                        ) : isWorking && inView && !reduceMotion ? (
                          <motion.span
                            key="spin"
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.88 }}
                            transition={{ duration: 0.2 }}
                            className="flex"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                              className="animate-spin text-foreground/55 [animation-duration:900ms] motion-reduce:animate-none"
                            >
                              <circle
                                cx="10"
                                cy="10"
                                r="7"
                                fill="none"
                                stroke="currentColor"
                                strokeOpacity={0.22}
                                strokeWidth="2.2"
                              />
                              <path
                                d="M10 3a7 7 0 0 1 7 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                              />
                            </svg>
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
                    {fn.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-ui text-[10.5px] transition-colors duration-250",
                      isWorking
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {isDone ? "Approved" : isWorking ? "Reviewing…" : "Pending"}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="flex min-h-11 items-center justify-between gap-2 border-t border-separator px-3.5 py-2 dark:border-edge-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 items-center">
                <AnimatePresence initial={false}>
                  {APPROVAL_FUNCTIONS.slice(0, doneCount).map((fn, idx) => (
                    <motion.span
                      key={fn.approver}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.85, x: -6 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={SPRING}
                      className={cn("relative flex shrink-0", idx > 0 && "-ml-2")}
                      style={{ zIndex: idx + 1 }}
                    >
                      <Image
                        src={fn.avatar}
                        alt={fn.approver}
                        width={22}
                        height={22}
                        unoptimized
                        className="size-[22px] rounded-full object-cover object-top ring-2 ring-card dark:ring-surface-2"
                      />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <span className="font-ui text-[11px] text-muted-foreground tabular-nums">
                {doneCount === 0
                  ? "Awaiting sign-offs"
                  : allReady
                    ? "All 3 functions approved"
                    : `${doneCount} of 3 approved`}
              </span>
            </div>
            <motion.span
              animate={{ opacity: allReady ? 1 : 0.45, scale: allReady ? 1 : 0.98 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="flex h-7 shrink-0 items-center rounded-md bg-invert px-3 font-ui text-[11px] font-medium text-invert-foreground"
            >
              Release package
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowDiscussionSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="workflow-discussion-heading" className="contents">
        <SectionHeader
          id="workflow-discussion-heading"
          anchorId="discussion"
          title="Discuss in context."
          mutedTitle="Resolve before sign-off."
        >
          Reviewers inspect live redlines, post scoped change requests with
          attachments, and confirm resolutions while keeping every version
          controlled.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Scoped change requests & threads"
            body="Tie comments and change requests to the whole package or a specific product, with file attachments."
            maxWidth={500}
          >
            <ScopedThreadsCard reduceMotion={reduceMotion} />
          </GovTile>

          <GovTile
            title="Explicit decisions & change alerts"
            body="Every sign-off captures decision, rationale, and re-verification if content changes mid-review."
            maxWidth={500}
          >
            <ExplicitDecisionsCard reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
