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
  DashboardSpeed01Icon,
  DatabaseIcon,
  LayoutTable01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { StatusBadge, type StatusTone } from "@/features/marketing/landing-page/StatusBadge";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.36, bounce: 0 };
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

function RollingCount({
  to,
  active,
  reduceMotion,
}: {
  to: number;
  active: boolean;
  reduceMotion: boolean;
}) {
  const mv = useMotionValue(active || reduceMotion ? to : 0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  React.useEffect(() => {
    if (reduceMotion) {
      mv.set(to);
      return;
    }
    if (!active) {
      mv.set(0);
      return;
    }
    const controls = animate(mv, to, { duration: 0.75, ease: EASE_OUT });
    return () => controls.stop();
  }, [active, mv, to, reduceMotion]);

  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

const QUERY_CONDITIONS = [
  { join: "Where", field: "symbol_ref", op: "=", value: "ISO 15223-1 5.2.3 (Sterile EO)" },
  { join: "And", field: "market", op: "includes", value: "EU MDR" },
  { join: "And", field: "language", op: "includes", value: "German (DE)" },
] as const;

const QUERY_ROWS: {
  planNumber: string;
  product: string;
  market: string;
  status: string;
  tone: StatusTone;
  version: string;
}[] = [
  {
    planNumber: "PX-2042",
    product: "IV Extension Set, 150 cm",
    market: "EU, UK",
    status: "Released",
    tone: "released",
    version: "v4",
  },
  {
    planNumber: "PX-1180",
    product: "Stopcock, 3-Way",
    market: "EU, DE",
    status: "Released",
    tone: "released",
    version: "v3",
  },
  {
    planNumber: "PX-2210",
    product: "Pressure Line, 200 cm",
    market: "EU MDR",
    status: "In review",
    tone: "review",
    version: "v2",
  },
  {
    planNumber: "PX-2311",
    product: "Y-Connector, Luer Lock",
    market: "EU, DE",
    status: "Draft",
    tone: "draft",
    version: "v1",
  },
];

type QueryPhase = "reset" | "conditions" | "running" | "results";

function PortfolioQueryBuilder({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [phase, setPhase] = React.useState<QueryPhase>(reduceMotion ? "results" : "reset");
  const [runNonce, setRunNonce] = React.useState(0);

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
      setPhase("conditions");
      wait(1100, () => {
        setPhase("running");
        wait(680, () => {
          setPhase("results");
          wait(5200, () => {
            setPhase("reset");
            wait(420, run);
          });
        });
      });
    };

    wait(100, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion, runNonce]);

  const activePhase: QueryPhase = reduceMotion ? "results" : phase;
  const showConditions = activePhase !== "reset";
  const isRunning = activePhase === "running";
  const showResults = activePhase === "results";

  const handleManualRun = () => {
    setRunNonce((v) => v + 1);
  };

  return (
    <ScaledCanvas ref={ref} width={1140} height={476} minScale={0.56} panX={570} panBelow={768} scrollable>
      <div
        className={cn(
          "absolute left-1/2 top-5 w-[880px] -translate-x-1/2 rounded-[18px] p-[5px] shadow-[0_18px_38px_-18px_rgba(0,0,0,0.14)]",
          FRAME,
        )}
      >
        <div className="overflow-hidden rounded-[13px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-12 items-center justify-between border-b border-separator px-4 dark:border-edge-1">
            <span className="flex items-center gap-2 font-ui text-[13px]">
              <Icon icon={DatabaseIcon} size={15} strokeWidth={1.8} className="text-muted-foreground" />
              <span className="text-muted-foreground">From</span>
              <span className="font-mono font-semibold text-foreground">products</span>
            </span>

            <motion.button
              type="button"
              aria-label="Run sample portfolio query"
              onClick={handleManualRun}
              animate={
                isRunning && !reduceMotion ? { scale: [1, 0.94, 1] } : { scale: 1 }
              }
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-foreground pl-[11px] pr-3.5 font-ui text-[12.5px] font-semibold leading-[18px] text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(23,23,23,0.2)] outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
            >
              <span className="relative flex size-[13px] items-center justify-center">
                {isRunning && inView && !reduceMotion ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="animate-spin [animation-duration:700ms] motion-reduce:animate-none"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="7"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity={0.25}
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
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
                    <path d="M8 5.5v13l10.5-6.5z" />
                  </svg>
                )}
              </span>
              Run
            </motion.button>
          </div>

          <div className="flex flex-col gap-2 border-b border-separator bg-subtle/45 px-4 py-3.5 dark:border-edge-1 dark:bg-surface-3/20">
            {QUERY_CONDITIONS.map((cond, idx) => (
              <motion.div
                key={cond.field}
                initial={false}
                animate={showConditions ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 4 }}
                transition={{ duration: 0.32, delay: showConditions ? idx * 0.14 : 0, ease: EASE_OUT }}
                className="flex items-center gap-3"
              >
                <span className="w-11 shrink-0 font-ui text-[11.5px] text-muted-foreground">
                  {cond.join}
                </span>
                <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-edge-2 dark:bg-surface-2">
                  <span className="font-mono text-[11.5px] font-semibold text-foreground">
                    {cond.field}
                  </span>
                  <span className="font-ui text-[11.5px] text-muted-foreground">{cond.op}</span>
                  <motion.span
                    initial={false}
                    animate={showConditions ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
                    transition={showConditions ? { ...SPRING, delay: idx * 0.14 + 0.12 } : { duration: 0.15 }}
                    className="flex h-6 items-center rounded-md border border-stroke-primary bg-subtle px-2 font-mono text-[10.5px] font-medium text-foreground dark:border-edge-2 dark:bg-surface-3"
                  >
                    {cond.value}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-[126px_1fr_118px_124px_64px] border-b border-separator bg-subtle/70 px-4 py-2 font-mono text-[10px] font-medium text-muted-foreground dark:border-edge-1 dark:bg-surface-3/30">
            <span>plan_number</span>
            <span>product</span>
            <span>market</span>
            <span>status</span>
            <span className="text-right">version</span>
          </div>

          <div className="divide-y divide-separator dark:divide-edge-1">
            {QUERY_ROWS.map((row, idx) => (
              <div
                key={row.planNumber}
                className="grid h-10 grid-cols-[126px_1fr_118px_124px_64px] items-center px-4"
              >
                {showResults ? (
                  <>
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: idx * 0.06, ease: EASE_OUT }}
                      className="font-mono text-[11.5px] text-muted-foreground"
                    >
                      {row.planNumber}
                    </motion.span>
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: idx * 0.06 + 0.03, ease: EASE_OUT }}
                      className="truncate pr-3 font-ui text-[12px] font-medium text-foreground"
                    >
                      {row.product}
                    </motion.span>
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: idx * 0.06 + 0.05, ease: EASE_OUT }}
                      className="font-mono text-[11px] text-muted-foreground"
                    >
                      {row.market}
                    </motion.span>
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: idx * 0.06 + 0.07, ease: EASE_OUT }}
                      className="flex"
                    >
                      <StatusBadge tone={row.tone} size="sm">
                        {row.status}
                      </StatusBadge>
                    </motion.span>
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: idx * 0.06 + 0.09 }}
                      className="text-right font-mono text-[11px] font-semibold text-foreground tabular-nums"
                    >
                      {row.version}
                    </motion.span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-14 rounded-full bg-foreground/[0.07]" />
                    <span className="h-2 w-40 rounded-full bg-foreground/[0.08]" />
                    <span className="h-2 w-12 rounded-full bg-foreground/[0.06]" />
                    <span className="h-4 w-16 rounded-full bg-foreground/[0.06]" />
                    <span className="ml-auto h-2 w-6 rounded-full bg-foreground/[0.07]" />
                  </>
                )}
              </div>
            ))}
          </div>

          <div
            role="status"
            aria-live="polite"
            className="flex h-10 items-center justify-between border-t border-separator bg-subtle/60 px-4 font-ui text-[11px] text-muted-foreground dark:border-edge-1 dark:bg-surface-3/30"
          >
            <span className="flex items-center gap-1.5 tabular-nums">
              <Icon icon={LayoutTable01Icon} size={13} strokeWidth={1.8} />
              <strong className="font-semibold text-foreground">
                <RollingCount to={38} active={showResults} reduceMotion={reduceMotion} />
              </strong>{" "}
              matching products
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10.5px] tabular-nums">
              <Icon icon={DashboardSpeed01Icon} size={13} strokeWidth={1.8} />
              {showResults ? "24 ms" : "—"}
            </span>
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

export default function ReportsQuerySection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="reports-query-heading" className="contents">
        <SectionHeader
          id="reports-query-heading"
          anchorId="query"
          title="Query every field"
          mutedTitle="across your entire portfolio."
        >
          Run internal where-used impact assessments across any section or
          tab—find every product sharing an ISO symbol, market, or language, pick
          exact columns, save queries, and export filtered reports.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <PortfolioQueryBuilder reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
