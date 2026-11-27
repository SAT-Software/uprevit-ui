"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  Cancel01Icon,
  DatabaseIcon,
  Download04Icon,
  Note01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { StatusBadge } from "@/features/marketing/landing-page/StatusBadge";
import { DocumentTileIcon } from "./DocumentTileIcon";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

const TOP_CONNECTOR = "M626 106H726";
const BOTTOM_CONNECTOR = "M626 262H726";

function ExportQueueFlow({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [thirdDone, setThirdDone] = React.useState(reduceMotion);

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
      setThirdDone(false);
      wait(2600, () => {
        setThirdDone(true);
        wait(3400, run);
      });
    };

    wait(150, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const allDone = reduceMotion || thirdDone;
  const completedCount = allDone ? 3 : 2;
  const progress = allDone ? 1 : 0.68;

  return (
    <ScaledCanvas ref={ref} width={1140} height={340} minScale={0.56} panX={570} panBelow={768} aria-hidden="true">
      <svg
        width="1140"
        height="340"
        viewBox="0 0 1140 340"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        <DottedConnector
          d={TOP_CONNECTOR}
          active
          canvasWidth={1140}
          canvasHeight={340}
          baseOpacity={0.2}
          activeOpacity={0.68}
          transition={{ duration: 0.45, ease: FLOW_EASE }}
        />
        <DottedConnector
          d={BOTTOM_CONNECTOR}
          active={!allDone}
          canvasWidth={1140}
          canvasHeight={340}
          baseOpacity={0.2}
          activeOpacity={0.6}
          transition={{ duration: 0.45, ease: FLOW_EASE }}
        />

        {!reduceMotion && inView && (
          <g opacity="0">
            <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
            <circle r="2" fill="currentColor" />
            <animateMotion
              path={TOP_CONNECTOR}
              dur="1.9s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0 0.25 1"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.14;0.86;1"
              dur="1.9s"
              repeatCount="indefinite"
            />
          </g>
        )}

        {!reduceMotion && inView && !allDone && (
          <g opacity="0">
            <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
            <circle r="2" fill="currentColor" />
            <animateMotion
              path={BOTTOM_CONNECTOR}
              dur="2.1s"
              begin="0.4s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0 0.25 1"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.14;0.86;1"
              dur="2.1s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </g>
        )}

        {[106, 262].map((y) => (
          <g key={y}>
            <path
              d={`M626 ${y - 3.25}A3.25 3.25 0 0 1 626 ${y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/45 dark:fill-surface-2"
            />
            <path
              d={`M726 ${y - 3.25}A3.25 3.25 0 0 0 726 ${y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/45 dark:fill-surface-2"
            />
          </g>
        ))}
      </svg>

      <div
        className={cn(
          "absolute left-[86px] top-5 w-[540px] rounded-[16px] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.14)]",
          FRAME,
        )}
      >
        <div className="flex flex-col overflow-hidden rounded-[11px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-11 items-center justify-between border-b border-separator px-4 dark:border-edge-1">
            <span className="flex items-center gap-2 font-ui text-[12.5px] font-semibold text-foreground">
              <Icon icon={DatabaseIcon} size={14} strokeWidth={1.8} className="text-muted-foreground" />
              Export queue
            </span>
            <span className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full border border-stroke-primary bg-subtle font-mono text-[10px] font-medium text-muted-foreground tabular-nums dark:border-edge-2 dark:bg-surface-3">
                3
              </span>
              <span className="flex size-5 items-center justify-center rounded-md text-muted-foreground">
                <Icon icon={Cancel01Icon} size={11} strokeWidth={2} />
              </span>
            </span>
          </div>

          <div className="divide-y divide-separator px-4 dark:divide-edge-1">
            <div className="flex h-[58px] items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3.5 pl-1.5">
                <DocumentTileIcon kind="pdf" size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-mono text-[11.5px] font-medium text-foreground">
                    PX-2042_IV_Extension_v4.pdf
                  </span>
                  <span className="truncate font-ui text-[10.5px] text-muted-foreground">
                    Complete Product Dossier → 7 tabs
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5">
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">1.8&nbsp;s</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-invert text-invert-foreground">
                  <Icon icon={Tick02Icon} size={11} strokeWidth={2.5} />
                </span>
              </span>
            </div>

            <div className="flex h-[58px] items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3.5 pl-1.5">
                <DocumentTileIcon kind="xlsx" size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-mono text-[11.5px] font-medium text-foreground">
                    PX-1180_Specifications_v3.xlsx
                  </span>
                  <span className="truncate font-ui text-[10.5px] text-muted-foreground">
                    Product Specifications &amp; Parameters → 2 sheets
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5">
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">2.4&nbsp;s</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-invert text-invert-foreground">
                  <Icon icon={Tick02Icon} size={11} strokeWidth={2.5} />
                </span>
              </span>
            </div>

            <div className="flex h-[58px] items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3.5 pl-1.5">
                <DocumentTileIcon kind="xlsx" size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-mono text-[11.5px] font-medium text-foreground">
                    EU_MDR_Sterile_EO_Report.xlsx
                  </span>
                  <span className="truncate font-ui text-[10.5px] text-muted-foreground">
                    Portfolio Report Export (38 matching products)
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5">
                {allDone && <span className="font-mono text-[10px] text-muted-foreground tabular-nums">3.1&nbsp;s</span>}
                <span className="relative flex size-5 items-center justify-center">
                  <AnimatePresence initial={false} mode="popLayout">
                    {allDone ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                        className="flex size-5 items-center justify-center rounded-full bg-invert text-invert-foreground"
                      >
                        <Icon icon={Tick02Icon} size={11} strokeWidth={2.5} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="busy"
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ duration: 0.2 }}
                        className="flex"
                      >
                        {inView && !reduceMotion && (
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            className="animate-spin text-foreground/60 [animation-duration:900ms] motion-reduce:animate-none"
                          >
                            <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="2.1" />
                            <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
                          </svg>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            </div>
          </div>

          <div className="flex h-10 items-center gap-3 border-t border-separator bg-subtle/50 px-4 dark:border-edge-1 dark:bg-surface-3/25">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-separator dark:bg-edge-2">
              <motion.div
                initial={false}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="h-full origin-left rounded-full bg-foreground"
              />
            </div>
            <span className="font-mono text-[10px] font-medium text-muted-foreground tabular-nums">
              {completedCount}/3
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-[726px] top-5 w-[328px] rounded-[16px] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.14)]",
          FRAME,
        )}
      >
        <div className="flex flex-col gap-3 rounded-[11px] border border-border bg-card p-3.5 dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-center justify-between">
            <StatusBadge tone="released" size="sm">
              Export ready
            </StatusBadge>
            <span className="font-ui text-[10px] text-muted-foreground">Just now</span>
          </div>

          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={allDone ? "xlsx" : "pdf"}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.26, ease: EASE_OUT }}
              className="flex items-center gap-3.5 pl-1.5"
            >
              <DocumentTileIcon kind={allDone ? "xlsx" : "pdf"} size="sm" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-mono text-[11px] font-semibold text-foreground">
                  {allDone ? "EU_MDR_Sterile_EO_Report.xlsx" : "PX-2042_IV_Extension_v4.pdf"}
                </span>
                <span className="truncate font-ui text-[10px] text-muted-foreground">
                  {allDone ? "1.2 MB, 38 products exported" : "2.4 MB, all 7 tabs included"}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-separator pt-2.5 dark:border-edge-1">
            <span className="font-ui text-[10px] text-muted-foreground">Signed link valid 24h</span>
            <span className="flex h-7 items-center gap-1.5 rounded-md bg-invert px-2.5 font-ui text-[10.5px] font-medium text-invert-foreground">
              <Icon icon={Download04Icon} size={11} strokeWidth={2} />
              Download
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-[726px] top-[206px] w-[328px] rounded-[16px] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.12)]",
          FRAME,
        )}
      >
        <div className="flex flex-col gap-2.5 rounded-[11px] border border-border bg-card p-3.5 dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-stroke-primary bg-subtle text-foreground/75 dark:border-edge-2 dark:bg-surface-3">
              <Icon icon={Note01Icon} size={13} strokeWidth={1.8} />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-ui text-[11.5px] font-semibold leading-4 text-foreground">
                Keep working in Uprevit
              </span>
              <span className="truncate font-ui text-[10px] text-muted-foreground">
                Editing PX-2210 while exports finish
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-separator pt-2 dark:border-edge-1">
            <StatusBadge tone={allDone ? "released" : "review"} size="sm">
              {allDone ? "All exports ready" : "1 job running in background"}
            </StatusBadge>
            <span className="font-ui text-[10px] text-muted-foreground">Non-blocking</span>
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

export default function ReportsQueueSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="reports-queue-heading" className="contents">
        <SectionHeader
          id="reports-queue-heading"
          anchorId="queue"
          title="Queue large exports."
          mutedTitle="Keep working uninterrupted."
        >
          Product dossiers, multi-product reports, and audit log exports process
          asynchronously with live queue status and ready-to-download
          notifications.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <ExportQueueFlow reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
