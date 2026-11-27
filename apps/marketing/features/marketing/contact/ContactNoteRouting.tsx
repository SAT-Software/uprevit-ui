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
  anchorX: number;
  anchorY: number;
  anchorEdge: "bottom" | "top";
  spoke: string;
  pulseFrom: readonly [number, number];
  pulseTo: readonly [number, number];
}

const ROUTE_CHIPS: RouteChipSpec[] = [
  {
    id: "demo",
    label: "Demo",
    dotClass: "bg-primary",
    anchorX: 104,
    anchorY: 112,
    anchorEdge: "bottom",
    spoke: "M188 161L104 112",
    pulseFrom: [188, 161],
    pulseTo: [104, 112],
  },
  {
    id: "pricing",
    label: "Pricing",
    dotClass: "bg-success",
    anchorX: 338,
    anchorY: 104,
    anchorEdge: "bottom",
    spoke: "M251 160L338 104",
    pulseFrom: [251, 160],
    pulseTo: [338, 104],
  },
  {
    id: "support",
    label: "Support",
    dotClass: "bg-info",
    anchorX: 98,
    anchorY: 252,
    anchorEdge: "top",
    spoke: "M188 199L98 252",
    pulseFrom: [188, 199],
    pulseTo: [98, 252],
  },
  {
    id: "security",
    label: "Security review",
    dotClass: "bg-foreground/70",
    anchorX: 334,
    anchorY: 246,
    anchorEdge: "top",
    spoke: "M252 199L334 246",
    pulseFrom: [252, 199],
    pulseTo: [334, 246],
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
    }, 3200);
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
                className="faq-pulse-ring absolute size-[68px] rounded-full border border-foreground/30 dark:border-foreground/35"
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
              <g key={chip.id}>
                <DottedConnector
                  d={chip.spoke}
                  active={isActive}
                  canvasWidth={440}
                  canvasHeight={360}
                  baseOpacity={0.22}
                  activeOpacity={0.78}
                  transition={{
                    duration: isActive ? 0.5 : 0.25,
                    ease: PULSE_EASE,
                  }}
                />
                <circle
                  cx={chip.pulseFrom[0]}
                  cy={chip.pulseFrom[1]}
                  r="3"
                  strokeWidth="1.2"
                  className={cn(
                    "fill-card transition-colors duration-300 dark:fill-surface-2",
                    isActive ? "stroke-foreground/70" : "stroke-foreground/30",
                  )}
                />
                <circle
                  cx={chip.pulseTo[0]}
                  cy={chip.pulseTo[1]}
                  r="3"
                  strokeWidth="1.2"
                  className={cn(
                    "fill-card transition-colors duration-300 dark:fill-surface-2",
                    isActive ? "stroke-foreground/70" : "stroke-foreground/30",
                  )}
                />
              </g>
            );
          })}

          {!reduceMotion && inView && (
            <motion.g
              key={`${activeChip.id}-${pulseCount}`}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: activeChip.pulseTo[0] - activeChip.pulseFrom[0],
                y: activeChip.pulseTo[1] - activeChip.pulseFrom[1],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                x: { duration: 0.72, delay: 0.12, ease: PULSE_EASE },
                y: { duration: 0.72, delay: 0.12, ease: PULSE_EASE },
                opacity: {
                  duration: 0.72,
                  delay: 0.12,
                  times: [0, 0.16, 0.84, 1],
                  ease: "linear",
                },
              }}
            >
              <circle
                cx={activeChip.pulseFrom[0]}
                cy={activeChip.pulseFrom[1]}
                r="4.5"
                fill="currentColor"
                fillOpacity={0.1}
              />
              <circle
                cx={activeChip.pulseFrom[0]}
                cy={activeChip.pulseFrom[1]}
                r="2.2"
                fill="currentColor"
              />
            </motion.g>
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
            transition={{ type: "spring", duration: 0.24, bounce: 0 }}
            className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-success text-white shadow-[0_0_0_2px_#FFFFFF,0_4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_2px_#141414,0_4px_6px_-1px_rgba(0,0,0,0.3)]"
          >
            <Icon icon={Tick02Icon} size={12} strokeWidth={2.5} />
          </motion.span>
        </div>

        {ROUTE_CHIPS.map((chip) => {
          const isActive = chip.id === selectedTopic;
          const top = chip.anchorEdge === "bottom" ? chip.anchorY - 28 : chip.anchorY;
          return (
            <div
              key={chip.id}
              className="absolute -translate-x-1/2"
              style={{ left: chip.anchorX, top }}
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
                transition={{ type: "spring", duration: 0.22, bounce: 0 }}
                className={cn(
                  "inline-flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] bg-card px-2.5 font-ui text-body-s leading-4 outline-none transition-[box-shadow,color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] dark:bg-surface-2",
                  isActive
                    ? "font-medium text-foreground shadow-[inset_0_0_0_1px_rgba(23,23,23,0.22),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24),0_4px_12px_-4px_rgba(0,0,0,0.35)]"
                    : "text-muted-foreground shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.03)] hover:text-foreground dark:shadow-[inset_0_0_0_1px_var(--edge-3)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-[5.5px] shrink-0 rounded-full", chip.dotClass)}
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
