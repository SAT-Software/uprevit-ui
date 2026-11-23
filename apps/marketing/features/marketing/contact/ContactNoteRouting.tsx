"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { Mail01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";

export type ContactTopicId = "demo" | "pricing" | "security" | "support";

const PULSE_EASE = [0.45, 0, 0.25, 1] as const;

interface RouteChipSpec {
  id: ContactTopicId;
  label: string;
  dotClass: string;
  left: number;
  top: number;
  spoke: string;
  pulseFrom: readonly [number, number];
  pulseTo: readonly [number, number];
}

const ROUTE_CHIPS: RouteChipSpec[] = [
  {
    id: "demo",
    label: "Demo",
    dotClass: "bg-primary",
    left: 26,
    top: 100,
    spoke: "M191 161L128 122",
    pulseFrom: [191, 161],
    pulseTo: [128, 122],
  },
  {
    id: "pricing",
    label: "Pricing",
    dotClass: "bg-chart-2",
    left: 274,
    top: 80,
    spoke: "M248 160L322 106",
    pulseFrom: [248, 160],
    pulseTo: [322, 106],
  },
  {
    id: "support",
    label: "Support",
    dotClass: "bg-chart-3",
    left: 6,
    top: 252,
    spoke: "M191 199L108 254",
    pulseFrom: [191, 199],
    pulseTo: [108, 254],
  },
  {
    id: "security",
    label: "Security review",
    dotClass: "bg-chart-1",
    left: 254,
    top: 232,
    spoke: "M249 198L310 234",
    pulseFrom: [249, 198],
    pulseTo: [310, 234],
  },
];

const PULSE_OFFSETS = ["0s", "-1.8s"];

export function ContactNoteRouting({
  selectedTopic,
  onSelectTopic,
  reduceMotion,
}: {
  selectedTopic: ContactTopicId;
  onSelectTopic: (topic: ContactTopicId) => void;
  reduceMotion: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const [pulseCount, setPulseCount] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setInterval(() => {
      setPulseCount((count) => count + 1);
    }, 3400);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  const activeChip =
    ROUTE_CHIPS.find((chip) => chip.id === selectedTopic) ?? ROUTE_CHIPS[0];

  return (
    <div
      ref={ref}
      className="relative hidden h-[360px] w-full shrink-0 items-center justify-center lg:flex"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-0 -translate-y-1/2 border-t border-dashed border-foreground/[0.14] dark:border-file-line"
      />

      <ScaledCanvas width={440} height={360} className="w-full">
        <span
          aria-hidden="true"
          className="absolute left-[128px] top-[88px] size-[184px] rounded-full border border-dashed border-foreground/[0.16] dark:border-foreground/[0.18]"
        />
        <span
          aria-hidden="true"
          className="absolute left-[88px] top-[48px] size-[264px] rounded-full border border-dashed border-foreground/[0.11] dark:border-edge-3"
        />
        <span
          aria-hidden="true"
          className="absolute left-[48px] top-[8px] size-[344px] rounded-full border border-dashed border-foreground/[0.07] dark:border-edge-2"
        />

        {!reduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[186px] top-[146px] flex size-[68px] items-center justify-center"
          >
            {PULSE_OFFSETS.map((delay) => (
              <span
                key={delay}
                className="faq-pulse-ring absolute size-[68px] rounded-full border border-primary/35 dark:border-primary/40"
                style={{
                  animationDelay: delay,
                  animationPlayState: inView ? "running" : "paused",
                }}
              />
            ))}
          </div>
        )}

        <svg
          width="440"
          height="360"
          viewBox="0 0 440 360"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {ROUTE_CHIPS.map((chip) => {
            const isActive = chip.id === selectedTopic;
            return (
              <DottedConnector
                key={chip.id}
                d={chip.spoke}
                active={isActive}
                canvasWidth={440}
                canvasHeight={360}
                baseOpacity={0}
                activeOpacity={0.34}
                transition={{
                  duration: isActive ? 0.38 : 0.2,
                  ease: PULSE_EASE,
                }}
              />
            );
          })}
          {!reduceMotion && inView && (
            <g key={`${activeChip.id}-${pulseCount}`}>
              <motion.circle
                r="4.5"
                fill="var(--primary)"
                fillOpacity={0.18}
                initial={{
                  cx: activeChip.pulseFrom[0],
                  cy: activeChip.pulseFrom[1],
                  opacity: 0,
                }}
                animate={{
                  cx: activeChip.pulseTo[0],
                  cy: activeChip.pulseTo[1],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  cx: { duration: 0.55, ease: PULSE_EASE },
                  cy: { duration: 0.55, ease: PULSE_EASE },
                  opacity: {
                    duration: 0.55,
                    times: [0, 0.15, 0.85, 1],
                    ease: "linear",
                  },
                }}
              />
              <motion.circle
                r="2.2"
                fill="var(--primary)"
                initial={{
                  cx: activeChip.pulseFrom[0],
                  cy: activeChip.pulseFrom[1],
                  opacity: 0,
                }}
                animate={{
                  cx: activeChip.pulseTo[0],
                  cy: activeChip.pulseTo[1],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  cx: { duration: 0.55, ease: PULSE_EASE },
                  cy: { duration: 0.55, ease: PULSE_EASE },
                  opacity: {
                    duration: 0.55,
                    times: [0, 0.15, 0.85, 1],
                    ease: "linear",
                  },
                }}
              />
            </g>
          )}
        </svg>

        <div className="absolute left-[186px] top-[146px] flex size-[68px] items-center justify-center rounded-full border-[0.8px] border-file-frame bg-card shadow-[0_0_0_3px_#F5F5F5,0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:border-edge-2 dark:bg-surface-2 dark:shadow-[0_0_0_3px_#1A1A1A,0_1px_3px_rgba(0,0,0,0.25)]">
          <Icon
            icon={Mail01Icon}
            size={28}
            strokeWidth={1.5}
            className="text-foreground"
          />
          <motion.span
            key={selectedTopic}
            initial={reduceMotion ? false : { scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_0_2px_#FFFFFF,0_4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_2px_#141414,0_4px_6px_-1px_rgba(0,0,0,0.3)]"
          >
            <Icon icon={Tick02Icon} size={12} strokeWidth={2.5} />
          </motion.span>
        </div>

        {ROUTE_CHIPS.map((chip) => {
          const isActive = chip.id === selectedTopic;
          return (
            <div
              key={chip.id}
              className="absolute flex h-7 w-[160px] justify-center"
              style={{ left: chip.left, top: chip.top }}
            >
              <motion.button
                type="button"
                onClick={() => onSelectTopic(chip.id)}
                aria-pressed={isActive}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: isActive ? 1.04 : 1, y: isActive ? -1 : 0 }
                }
                transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                className={cn(
                  "flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border bg-card px-2.5 font-ui text-body-s leading-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring dark:bg-surface-3 dark:shadow-[0_1px_2px_rgba(0,0,0,0.24)]",
                  isActive
                    ? "border-foreground/20 font-medium text-foreground dark:border-foreground/25 dark:text-foreground"
                    : "border-border text-muted-foreground hover:border-stroke-strong hover:text-foreground dark:border-edge-3 dark:hover:border-edge-4",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 shrink-0 rounded-full", chip.dotClass)}
                />
                <span>{chip.label}</span>
              </motion.button>
            </div>
          );
        })}
      </ScaledCanvas>
    </div>
  );
}
