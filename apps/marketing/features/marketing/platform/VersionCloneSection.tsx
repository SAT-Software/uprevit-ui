"use client";

import * as React from "react";
import { MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Copy01Icon,
  GitBranchIcon,
  SquareLock02Icon,
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

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const CLONE_STEPS: {
  label: string;
  badge: string;
  badgeKind: "locked" | "count" | "version";
  icon: IconSvgElement;
  leftPath: string;
  rightPath: string;
  y: number;
}[] = [
  {
    label: "Live master untouched",
    badge: "Locked",
    badgeKind: "locked",
    icon: SquareLock02Icon,
    leftPath: "M282 124C346 124 344 52 406 52",
    rightPath: "M714 52C776 52 774 124 838 124",
    y: 52,
  },
  {
    label: "All 7 tabs cloned cleanly",
    badge: "7 of 7",
    badgeKind: "count",
    icon: Copy01Icon,
    leftPath: "M282 124H406",
    rightPath: "M714 124H838",
    y: 124,
  },
  {
    label: "Draft ready to edit",
    badge: "v4.0",
    badgeKind: "version",
    icon: Tick02Icon,
    leftPath: "M282 124C346 124 344 196 406 196",
    rightPath: "M714 196C776 196 774 124 838 124",
    y: 196,
  },
];

function CloneRevisionFlow({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [stage, setStage] = React.useState(reduceMotion ? 3 : 0);

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
          wait(4600, () => {
            setStage(0);
            wait(550, run);
          });
        });
      });
    };

    wait(200, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const activeStage = reduceMotion ? 3 : stage;

  return (
    <ScaledCanvas ref={ref} aria-hidden="true" width={1120} height={260} minScale={0.58} panX={560} panBelow={768}>
      <svg
        width="1120"
        height="260"
        viewBox="0 0 1120 260"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {CLONE_STEPS.map((step, idx) => (
          <g key={step.label}>
            <DottedConnector
              d={step.leftPath}
              active={activeStage >= 1}
              canvasWidth={1120}
              canvasHeight={260}
              baseOpacity={0.22}
              activeOpacity={0.62}
              transition={{ duration: 0.48, delay: idx * 0.08, ease: EASE_OUT }}
            />
            <DottedConnector
              d={step.rightPath}
              active={activeStage >= 2}
              canvasWidth={1120}
              canvasHeight={260}
              baseOpacity={0.22}
              activeOpacity={0.62}
              transition={{ duration: 0.48, delay: idx * 0.08, ease: EASE_OUT }}
            />
            {!reduceMotion && inView && activeStage >= 1 && (
              <g opacity="0">
                <circle r="4" fill="currentColor" fillOpacity={0.12} />
                <circle r="2.2" fill="currentColor" />
                <animateMotion
                  path={step.leftPath}
                  dur="2.4s"
                  begin={`${idx * 0.25}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.14;0.86;1"
                  dur="2.4s"
                  begin={`${idx * 0.25}s`}
                  repeatCount="indefinite"
                />
              </g>
            )}
            {!reduceMotion && inView && activeStage >= 2 && (
              <g opacity="0">
                <circle r="4" fill="currentColor" fillOpacity={0.12} />
                <circle r="2.2" fill="currentColor" />
                <animateMotion
                  path={step.rightPath}
                  dur="2.4s"
                  begin={`${0.55 + idx * 0.25}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.14;0.86;1"
                  dur="2.4s"
                  begin={`${0.55 + idx * 0.25}s`}
                  repeatCount="indefinite"
                />
              </g>
            )}
            <circle cx="406" cy={step.y} r="3" strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
            <circle cx="714" cy={step.y} r="3" strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
          </g>
        ))}
        <circle cx="282" cy="124" r="3" strokeWidth="1.2" className="fill-card stroke-foreground/45 dark:fill-surface-2" />
        <circle cx="838" cy="124" r="3" strokeWidth="1.2" className="fill-card stroke-foreground/45 dark:fill-surface-2" />
      </svg>

      <div className="absolute left-[198px] top-[82px] flex w-[84px] flex-col items-center gap-2.5">
        <div className="size-[84px] rounded-[20px] border border-foreground/5 bg-frame-surface p-1 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.28)] dark:border-edge-2">
          <div className="flex size-full items-center justify-center rounded-[16px] bg-invert text-invert-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
            <Icon icon={SquareLock02Icon} size={28} strokeWidth={1.6} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="whitespace-nowrap font-ui text-[13px] font-semibold leading-4 text-foreground">
            v3.0 Master
          </span>
          <span className="whitespace-nowrap font-ui text-[11px] leading-4 text-muted-foreground">
            Locked live master
          </span>
        </div>
      </div>

      <div className="absolute left-[406px] top-[25px] flex w-[308px] flex-col gap-[18px]">
        {CLONE_STEPS.map((step, idx) => {
          const isLit = activeStage >= 2;
          return (
            <div key={step.label} className="flex h-[54px] items-center">
              <motion.div
                initial={false}
                animate={{
                  opacity: isLit ? 1 : 0.55,
                  scale: isLit ? 1 : 0.96,
                }}
                transition={{ duration: 0.34, delay: idx * 0.08, ease: EASE_OUT }}
                className="w-full rounded-[14px] border border-foreground/5 bg-frame-surface p-1 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)] dark:border-edge-1"
              >
                <div className="flex h-[44px] items-center justify-between gap-2 overflow-hidden rounded-[10px] border border-border bg-card pl-2.5 pr-2 dark:border-edge-2 dark:bg-surface-2">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg border",
                        step.badgeKind === "version"
                          ? "border-success/25 bg-success-soft text-success-strong dark:text-success"
                          : "border-stroke-primary bg-subtle text-foreground/75 dark:border-edge-2 dark:bg-surface-3",
                      )}
                    >
                      <Icon icon={step.icon} size={13} strokeWidth={2} />
                    </span>
                    <span className="font-ui text-[12.5px] font-medium leading-4 text-foreground">
                      {step.label}
                    </span>
                  </span>
                  {step.badgeKind === "locked" && (
                    <StatusBadge tone="released" size="sm">
                      {step.badge}
                    </StatusBadge>
                  )}
                  {step.badgeKind === "count" && (
                    <span className="flex h-6 items-center rounded-md border border-stroke-primary bg-subtle px-2 font-mono text-[10.5px] font-medium text-muted-foreground tabular-nums dark:border-edge-2 dark:bg-surface-3">
                      {step.badge}
                    </span>
                  )}
                  {step.badgeKind === "version" && (
                    <span className="flex h-6 items-center rounded-md bg-invert px-2 font-mono text-[10.5px] font-medium text-invert-foreground tabular-nums">
                      {step.badge}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={false}
        animate={{ scale: activeStage >= 3 ? 1.03 : 1 }}
        transition={{ type: "spring", duration: 0.32, bounce: 0 }}
        className="absolute left-[838px] top-[82px] flex w-[84px] flex-col items-center gap-2.5"
      >
        <div
          className={cn(
            "size-[84px] rounded-[20px] border p-1 transition-[border-color,box-shadow] duration-300",
            activeStage >= 3
              ? "border-foreground/15 bg-file-frame shadow-[0_14px_28px_-14px_rgba(0,0,0,0.18)] dark:border-edge-3 dark:bg-surface-3/60"
              : "border-foreground/5 bg-frame-surface dark:border-edge-1",
          )}
        >
          <div className="flex size-full items-center justify-center rounded-[16px] border border-border bg-card text-foreground shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] dark:border-edge-2 dark:bg-surface-2">
            <Icon icon={GitBranchIcon} size={26} strokeWidth={1.7} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="whitespace-nowrap font-ui text-[13px] font-semibold leading-4 text-foreground">
            v4.0 Draft
          </span>
          <span className="whitespace-nowrap font-ui text-[11px] leading-4 text-muted-foreground">
            Editable revision
          </span>
        </div>
      </motion.div>
    </ScaledCanvas>
  );
}

export default function VersionCloneSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="version-clone-heading" className="contents">
        <SectionHeader
          id="version-clone-heading"
          anchorId="clone"
          title="Edit the next revision"
          mutedTitle="without touching live."
        >
          Released versions stay permanently locked. Starting a new change
          clones the live master into a fresh draft so production records are
          never disturbed.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <CloneRevisionFlow reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
