"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import { GitBranchIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { StatusBadge } from "@/features/marketing/landing-page/StatusBadge";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const DRAW_EASE = [0.645, 0.045, 0.355, 1] as const;

const SEGMENTS = [
  { d: "M120 248H276", className: "stroke-foreground" },
  { d: "M276 248C324 248 320 174 360 174H442C482 174 478 248 526 248", className: "stroke-foreground" },
  { d: "M526 248C574 248 570 174 610 174H692C732 174 728 248 776 248", className: "stroke-stage-released" },
  { d: "M776 248C824 248 824 102 872 102H956", className: "stroke-stage-submitted" },
] as const;

const GUIDE_XS = [184, 276, 360, 442, 526, 610, 692, 776, 872, 956, 1044];

function VersionBranchGraph({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [stage, setStage] = React.useState(reduceMotion ? 5 : 0);

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
      setStage(1);
      wait(750, () => {
        setStage(2);
        wait(950, () => {
          setStage(3);
          wait(820, () => {
            // Green v3 line reaches the merge circle -> expand v3 Released · Master
            setStage(4);
            wait(750, () => {
              setStage(5);
              wait(5200, () => {
                setStage(0);
                wait(600, run);
              });
            });
          });
        });
      });
    };

    wait(180, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const activeStage = reduceMotion ? 5 : stage;
  const v3MasterConnected = activeStage >= 4;

  return (
    <ScaledCanvas ref={ref} aria-hidden="true" width={1220} height={352} minScale={0.56} panX={610} panBelow={820}>
      {/* Subtle dashed grid guides */}
      {GUIDE_XS.map((x) => (
        <span
          key={x}
          aria-hidden="true"
          className="pointer-events-none absolute top-6 h-[296px] w-0 border-l border-dashed border-foreground/[0.06] [mask-image:linear-gradient(transparent,#000_20%,#000_80%,transparent)]"
          style={{ left: x }}
        />
      ))}
      {[102, 174].map((y) => (
        <span
          key={y}
          aria-hidden="true"
          className="pointer-events-none absolute left-14 h-0 w-[1108px] border-t border-dashed border-foreground/[0.06] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
          style={{ top: y }}
        />
      ))}

      <svg
        width="1220"
        height="352"
        viewBox="0 0 1220 352"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {/* Base muted tracks */}
        <path d="M120 248H1044" stroke="currentColor" strokeOpacity={0.14} strokeWidth="1.6" />
        {SEGMENTS.slice(1).map((seg) => (
          <path key={seg.d} d={seg.d} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth="1.6" />
        ))}
        <path
          d="M956 102H1044"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth="1.6"
          strokeDasharray="3 4"
        />

        {/* Animated drawn branches */}
        {SEGMENTS.map((seg, idx) => {
          const triggerStage = idx === 3 ? 5 : idx + 1;
          const shown = activeStage >= triggerStage;
          return (
            <motion.path
              key={seg.d}
              d={seg.d}
              fill="none"
              strokeWidth="1.8"
              className={seg.className}
              initial={false}
              animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
              transition={
                shown
                  ? { pathLength: { duration: idx === 0 ? 0.55 : 0.85, ease: DRAW_EASE }, opacity: { duration: 0.1 } }
                  : { duration: 0.3, ease: EASE_OUT }
              }
            />
          );
        })}

        {[
          { cx: 184, cy: 248, fill: "fill-foreground", at: 1 },
          { cx: 276, cy: 248, fill: "fill-foreground", at: 1 },
          { cx: 360, cy: 174, fill: "fill-foreground", at: 2 },
          { cx: 442, cy: 174, fill: "fill-foreground", at: 2 },
          { cx: 610, cy: 174, fill: "fill-stage-released", at: 3 },
          { cx: 692, cy: 174, fill: "fill-stage-released", at: 3 },
          { cx: 872, cy: 102, fill: "fill-stage-submitted", at: 5 },
          { cx: 956, cy: 102, fill: "fill-stage-submitted", at: 5 },
        ].map((dot) => {
          const shown = activeStage >= dot.at;
          return (
            <motion.circle
              key={`${dot.cx}-${dot.cy}`}
              cx={dot.cx}
              cy={dot.cy}
              r="5"
              className={dot.fill}
              initial={false}
              animate={{ scale: shown ? 1 : 0.85, opacity: shown ? 1 : 0 }}
              transition={{ duration: 0.25, delay: shown ? 0.2 : 0, ease: EASE_OUT }}
              style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
            />
          );
        })}

        {activeStage >= 5 && !reduceMotion && inView && (
          <motion.circle
            cx="956"
            cy="102"
            r="13"
            className="fill-stage-submitted"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.18, 0], scale: [0.8, 1.25, 1.35] }}
            transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
            style={{ transformOrigin: "956px 102px" }}
          />
        )}

        {/* v4 pending review open circle + muted baseline dot */}
        <circle
          cx="1044"
          cy="102"
          r="5"
          strokeWidth="1.4"
          strokeDasharray="2.2 2"
          className="fill-card stroke-foreground/35 dark:fill-surface-2"
        />
        <circle cx="1044" cy="248" r="5" className="fill-foreground/20" />

        {/* v2 merge node */}
        <circle cx="526" cy="248" r="10" strokeWidth="1.2" className="fill-card stroke-foreground/25 dark:fill-surface-2" />
        <g transform="translate(520 242) scale(.5)" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="18" r="2" />
          <circle cx="7" cy="6" r="2" />
          <circle cx="17" cy="12" r="2" />
          <path d="M7.021 8.279V15.407M14.411 12.005L10.019 12.005C8.922 12.005 6.862 11.125 7.018 8.78" />
        </g>

        <motion.circle
          cx="776"
          cy="248"
          r="15"
          className="fill-stage-released"
          initial={false}
          animate={{ opacity: v3MasterConnected ? 0.15 : 0, scale: v3MasterConnected ? 1 : 0.85 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          style={{ transformOrigin: "776px 248px" }}
        />
        <circle
          cx="776"
          cy="248"
          r="10.5"
          strokeWidth="1.2"
          className={cn(
            "transition-colors duration-250",
            v3MasterConnected
              ? "fill-invert stroke-transparent"
              : "fill-card stroke-foreground/25 dark:fill-surface-2",
          )}
        />
        <g
          transform="translate(770 242) scale(.5)"
          className={cn(
            "transition-colors duration-250",
            v3MasterConnected ? "stroke-invert-foreground" : "stroke-current",
          )}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7" cy="18" r="2" />
          <circle cx="7" cy="6" r="2" />
          <circle cx="17" cy="12" r="2" />
          <path d="M7.021 8.279V15.407M14.411 12.005L10.019 12.005C8.922 12.005 6.862 11.125 7.018 8.78" />
        </g>
      </svg>

      {/* Branch callout badges */}
      <motion.span
        initial={false}
        animate={activeStage >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="absolute left-[136px] top-[208px] flex h-7 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 font-ui text-[11px] font-medium text-foreground shadow-[0_4px_12px_-6px_rgba(0,0,0,0.08)] dark:border-edge-2 dark:bg-surface-2"
      >
        <span className="size-1.5 rounded-full bg-foreground/45" />
        Initial CE baseline
      </motion.span>

      <motion.span
        initial={false}
        animate={activeStage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.35, delay: activeStage >= 2 ? 0.25 : 0, ease: EASE_OUT }}
        className="absolute left-[326px] top-[130px] flex h-7 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 font-ui text-[11px] font-medium text-foreground shadow-[0_4px_12px_-6px_rgba(0,0,0,0.08)] dark:border-edge-2 dark:bg-surface-2"
      >
        <Icon icon={GitBranchIcon} size={12} strokeWidth={2} className="text-foreground/70" />
        Sterilization shift to EO
      </motion.span>

      <motion.span
        initial={false}
        animate={activeStage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.35, delay: activeStage >= 3 ? 0.25 : 0, ease: EASE_OUT }}
        className="absolute left-[566px] top-[130px] flex h-7 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 font-ui text-[11px] font-medium text-foreground shadow-[0_4px_12px_-6px_rgba(0,0,0,0.08)] dark:border-edge-2 dark:bg-surface-2"
      >
        <Icon icon={GitBranchIcon} size={12} strokeWidth={2} className="text-success" />
        DE &amp; FR IFU language expansion
      </motion.span>

      <motion.span
        initial={false}
        animate={activeStage >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.35, delay: activeStage >= 5 ? 0.25 : 0, ease: EASE_OUT }}
        className="absolute left-[832px] top-[56px] flex h-7 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 font-ui text-[11px] font-medium text-foreground shadow-[0_4px_12px_-6px_rgba(0,0,0,0.08)] dark:border-edge-2 dark:bg-surface-2"
      >
        <Icon icon={GitBranchIcon} size={12} strokeWidth={2} className="text-info" />
        UDI barcode &amp; EU MDR symbol update
      </motion.span>

      <motion.span
        initial={false}
        animate={activeStage >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.35, delay: activeStage >= 5 ? 0.45 : 0, ease: EASE_OUT }}
        className="absolute left-[1010px] top-[120px] flex"
      >
        <StatusBadge tone="review" size="sm">
          In review
        </StatusBadge>
      </motion.span>

      {[
        { x: 184, tag: "v1", sub: "Obsolete · Jan 18", isMasterSlot: false },
        { x: 526, tag: "v2", sub: "Obsolete · Jun 12", isMasterSlot: false },
        { x: 776, tag: "v3", sub: "Oct 14 · Inspect read-only", isMasterSlot: true },
        { x: 1044, tag: "v4", sub: "WF-019 · Active", isMasterSlot: false },
      ].map((v) => {
        const expanded = v.isMasterSlot && v3MasterConnected;
        return (
          <div
            key={v.tag}
            className="absolute top-[270px] flex -translate-x-1/2 flex-col items-center gap-1.5"
            style={{ left: v.x }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={expanded ? `${v.tag}-master` : v.tag}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className={cn(
                  "flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 font-mono text-[10.5px] font-medium tabular-nums",
                  expanded
                    ? "border-transparent bg-invert text-invert-foreground shadow-[0_8px_18px_-8px_rgba(0,0,0,0.4)]"
                    : "border-border bg-muted text-muted-foreground dark:border-edge-2 dark:bg-surface-3",
                )}
              >
                {expanded && (
                  <span
                    aria-hidden="true"
                    className="inline-block size-1.5 shrink-0 rounded-full bg-stage-released"
                  />
                )}
                <span>{expanded ? `${v.tag} Released · Master` : v.tag}</span>
              </motion.span>
            </AnimatePresence>
            <span className="whitespace-nowrap font-ui text-[10.5px] text-muted-foreground tabular-nums">
              {v.sub}
            </span>
          </div>
        );
      })}
    </ScaledCanvas>
  );
}

export default function VersionTimelineSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="version-timeline-heading" className="contents">
        <SectionHeader
          id="version-timeline-heading"
          anchorId="timeline"
          title="Every past release,"
          mutedTitle="one click away."
        >
          Open the version timeline on any product to see who created, edited,
          and released each version—and inspect historical records in instant
          read-only mode.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-4 sm:py-6">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <VersionBranchGraph reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
