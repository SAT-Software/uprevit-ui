"use client";

import * as React from "react";
import Image from "next/image";
import { MotionConfig, motion, useInView } from "motion/react";
import { ArrowRight02Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
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
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

const REVIEWERS = [
  {
    avatar: "/images/avatars/marta.webp",
    name: "Marta Lindqvist",
    role: "Regulatory Affairs",
    y: 66,
    leftPath: "M386 146C434 146 434 66 488 66",
    rightPath: "M792 66C846 66 846 146 894 146",
    alwaysApproved: true,
  },
  {
    avatar: "/images/avatars/ravi.webp",
    name: "Ravi Kulkarni",
    role: "Quality Assurance",
    y: 146,
    leftPath: "M386 146H488",
    rightPath: "M792 146H894",
    alwaysApproved: false,
  },
  {
    avatar: "/images/avatars/sara.webp",
    name: "Sara Patel",
    role: "Labeling Lead",
    y: 226,
    leftPath: "M386 146C434 146 434 226 488 226",
    rightPath: "M792 226C846 226 846 146 894 146",
    alwaysApproved: true,
  },
] as const;

function LiveRedlineApprovalsFlow({ reduceMotion }: { reduceMotion: boolean }) {
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
      wait(1100, () => {
        setStage(2);
        wait(1800, () => {
          setStage(3);
          wait(3800, () => {
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
  const allApproved = activeStage >= 3;
  const signedCount = allApproved ? 3 : 2;
  const pct = allApproved ? 100 : 67;

  return (
    <ScaledCanvas ref={ref} width={1180} height={296} minScale={0.56} panX={590} panBelow={768} aria-hidden="true">
      <svg
        width="1180"
        height="296"
        viewBox="0 0 1180 296"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {REVIEWERS.map((rev, idx) => {
          const rightActive = rev.alwaysApproved ? activeStage >= 2 : allApproved;
          return (
            <g key={rev.name}>
              <DottedConnector
                d={rev.leftPath}
                active={activeStage >= 1}
                canvasWidth={1180}
                canvasHeight={296}
                baseOpacity={0.2}
                activeOpacity={0.65}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: FLOW_EASE }}
              />
              <DottedConnector
                d={rev.rightPath}
                active={rightActive}
                canvasWidth={1180}
                canvasHeight={296}
                baseOpacity={0.2}
                activeOpacity={0.68}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: FLOW_EASE }}
              />
              {!reduceMotion && inView && activeStage >= 1 && (
                <g opacity="0">
                  <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2" fill="currentColor" />
                  <animateMotion
                    path={rev.leftPath}
                    dur="2.1s"
                    begin={`${idx * 0.24}s`}
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
                    begin={`${idx * 0.24}s`}
                    repeatCount="indefinite"
                  />
                </g>
              )}
              {!reduceMotion && inView && rightActive && (
                <g opacity="0">
                  <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2" fill="currentColor" />
                  <animateMotion
                    path={rev.rightPath}
                    dur="2.1s"
                    begin={`${0.4 + idx * 0.24}s`}
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
                    begin={`${0.4 + idx * 0.24}s`}
                    repeatCount="indefinite"
                  />
                </g>
              )}
              <path
                d={`M488 ${rev.y - 3.25}A3.25 3.25 0 0 0 488 ${rev.y + 3.25}`}
                strokeWidth="1.2"
                className="fill-card stroke-foreground/40 dark:fill-surface-2"
              />
              <path
                d={`M792 ${rev.y - 3.25}A3.25 3.25 0 0 1 792 ${rev.y + 3.25}`}
                strokeWidth="1.2"
                className="fill-card stroke-foreground/40 dark:fill-surface-2"
              />
            </g>
          );
        })}
        <path
          d="M386 142.75A3.25 3.25 0 0 1 386 149.25"
          strokeWidth="1.2"
          className="fill-card stroke-foreground/45 dark:fill-surface-2"
        />
        <path
          d="M894 142.75A3.25 3.25 0 0 0 894 149.25"
          strokeWidth="1.2"
          className="fill-card stroke-foreground/45 dark:fill-surface-2"
        />
      </svg>

      {/* Left card: Live redline diff summary */}
      <div
        className={cn(
          "absolute left-[50px] top-[34px] w-[336px] rounded-[16px] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.14)]",
          FRAME,
        )}
      >
        <div className="overflow-hidden rounded-[11px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-10 items-center justify-between border-b border-separator px-3.5 dark:border-edge-1">
            <span className="font-ui text-[12px] font-semibold text-foreground">
              Live redline diff
            </span>
            <StatusBadge tone="review" size="sm">
              3 changes
            </StatusBadge>
          </div>

          <div className="divide-y divide-separator dark:divide-edge-1">
            <div className="flex h-[44px] items-center justify-between border-l-2 border-l-stage-released/70 bg-card px-3.5 dark:bg-surface-2">
              <span className="font-ui text-[11.5px] font-medium text-foreground">Shelf life</span>
              <span className="flex items-center gap-1.5 font-mono text-[10.5px]">
                <span className="text-destructive-strong line-through">3 years</span>
                <Icon icon={ArrowRight02Icon} size={10} strokeWidth={2} className="text-muted-foreground" />
                <span className="font-semibold text-success-strong">5 years</span>
              </span>
            </div>

            <div className="flex h-[44px] items-center justify-between border-l-2 border-l-stage-released/70 bg-card px-3.5 dark:bg-surface-2">
              <span className="font-ui text-[11.5px] font-medium text-foreground">Sterilization</span>
              <span className="flex items-center gap-1.5 font-mono text-[10.5px]">
                <span className="text-destructive-strong line-through">EO</span>
                <Icon icon={ArrowRight02Icon} size={10} strokeWidth={2} className="text-muted-foreground" />
                <span className="font-semibold text-success-strong">Irradiation</span>
              </span>
            </div>

            <div className="flex h-[44px] items-center justify-between border-l-2 border-l-stage-submitted/70 bg-card px-3.5 dark:bg-surface-2">
              <span className="font-ui text-[11.5px] font-medium text-foreground">
                ISO Symbol 5.2.8
              </span>
              <span className="font-mono text-[10.5px] font-semibold text-info-strong">
                + Pouch, Carton
              </span>
            </div>
          </div>

          <div className="flex h-9 items-center justify-between border-t border-separator bg-subtle/70 px-3.5 font-ui text-[10.5px] dark:border-edge-1 dark:bg-surface-3/30">
            <span className="font-mono text-muted-foreground">Workflow WF-019</span>
            <span className="font-medium text-foreground">All 7 tabs synced</span>
          </div>
        </div>
      </div>

      {/* Middle 3 reviewer cards (real avatars, consistent unselected styling, neutral dot-only badges) */}
      <div className="absolute left-[488px] top-[34px] flex w-[304px] flex-col gap-4">
        {REVIEWERS.map((rev, idx) => {
          const isApproved = rev.alwaysApproved || allApproved;
          const isLit = activeStage >= 1;
          return (
            <div key={rev.name} className="flex h-[64px] items-center">
              <motion.div
                initial={false}
                animate={{
                  opacity: isLit ? 1 : 0.6,
                  scale: isLit ? 1 : 0.985,
                }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: EASE_OUT }}
                className={cn(
                  "w-full rounded-[14px] p-1 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)]",
                  FRAME,
                )}
              >
                <div className="flex h-[54px] items-center justify-between gap-2 rounded-[10px] border border-border bg-card px-3 dark:border-edge-2 dark:bg-surface-2">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      width={32}
                      height={32}
                      className="size-8 shrink-0 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-ui text-[12px] font-semibold leading-4 text-foreground">
                        {rev.name}
                      </span>
                      <span className="truncate font-ui text-[10.5px] leading-[14px] text-muted-foreground">
                        {rev.role}
                      </span>
                    </span>
                  </span>

                  <StatusBadge tone={isApproved ? "released" : "review"} size="sm">
                    {isApproved ? "Approved" : "Reviewing"}
                  </StatusBadge>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Right dark Approval gate card */}
      <div className="absolute left-[894px] top-[90px] w-[236px] rounded-[16px] border border-foreground/10 bg-frame-surface p-1 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.28)] dark:border-edge-2 dark:bg-surface-1/75">
        <div className="flex flex-col gap-3 rounded-[12px] bg-invert p-3.5 text-invert-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 dark:border-black/10 dark:bg-black/10">
              <Icon icon={SecurityCheckIcon} size={15} strokeWidth={1.8} />
            </span>
            <div className="flex flex-col">
              <span className="font-ui text-[12.5px] font-semibold leading-4">Approval gate</span>
              <span className="font-ui text-[10.5px] leading-[14px] text-invert-foreground/70 tabular-nums">
                {signedCount} of 3 signed off
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15 dark:bg-black/15">
              <motion.div
                initial={false}
                animate={{ scaleX: pct / 100 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
                className="h-full origin-left rounded-full bg-stage-released"
              />
            </div>
            <div className="flex items-center justify-between font-ui text-[10px] text-invert-foreground/65">
              <span>{allApproved ? "Ready to release" : "Sign-offs anchored"}</span>
              <span className="font-mono tabular-nums">{pct}%</span>
            </div>
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

export default function RedlineApprovalsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="redline-approvals-heading" className="contents">
        <SectionHeader
          id="redline-approvals-heading"
          anchorId="approvals"
          title="Inspect live redlines"
          mutedTitle="where approvals happen."
        >
          Reviewers inspect automated redlines directly inside the product record
          and approval workflow in-app—so feedback and sign-offs stay anchored to
          the exact changed fields.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <LiveRedlineApprovalsFlow reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
