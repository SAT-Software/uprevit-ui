"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";

export type ContactTopicId = "demo" | "pricing" | "support";

const PULSE_EASE = [0.45, 0, 0.25, 1] as const;

type Point = readonly [number, number];

interface RouteChipSpec {
  id: ContactTopicId;
  label: string;
  dotClass: string;
  anchorX: number;
  anchorY: number;
  anchorEdge: "bottom" | "top";
  curve: readonly [Point, Point, Point, Point];
}

const ROUTE_CHIPS: RouteChipSpec[] = [
  {
    id: "demo",
    label: "Demo",
    dotClass: "bg-primary",
    anchorX: 104,
    anchorY: 112,
    anchorEdge: "bottom",
    curve: [
      [188.8, 162],
      [162.8, 147],
      [104, 152],
      [104, 112],
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    dotClass: "bg-success",
    anchorX: 336,
    anchorY: 112,
    anchorEdge: "bottom",
    curve: [
      [251.2, 162],
      [277.2, 147],
      [336, 152],
      [336, 112],
    ],
  },
  {
    id: "support",
    label: "Support",
    dotClass: "bg-info",
    anchorX: 220,
    anchorY: 276,
    anchorEdge: "top",
    curve: [
      [220, 216],
      [220, 236],
      [220, 256],
      [220, 276],
    ],
  },
];

const toPath = ([p0, p1, p2, p3]: RouteChipSpec["curve"]) =>
  `M${p0.join(" ")}C${p1.join(" ")} ${p2.join(" ")} ${p3.join(" ")}`;

const pointAt = ([p0, p1, p2, p3]: RouteChipSpec["curve"], t: number) => {
  const m = 1 - t;
  return [0, 1].map(
    (i) =>
      m * m * m * p0[i] + 3 * m * m * t * p1[i] + 3 * m * t * t * p2[i] + t * t * t * p3[i],
  );
};

const PULSE_STEPS = Array.from(
  { length: 17 },
  (_, i) => (1 - Math.cos((Math.PI * i) / 16)) / 2,
);

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
  const topicIndex = Math.max(
    0,
    ROUTE_CHIPS.findIndex((chip) => chip.id === selectedTopic),
  );
  const [pulse, setPulse] = React.useState({ index: topicIndex, count: 0 });
  const [prevTopic, setPrevTopic] = React.useState(selectedTopic);

  if (prevTopic !== selectedTopic) {
    setPrevTopic(selectedTopic);
    setPulse((prev) => ({ index: topicIndex, count: prev.count + 1 }));
  }

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setInterval(() => {
      setPulse((prev) => ({
        index: (prev.index + 1) % ROUTE_CHIPS.length,
        count: prev.count + 1,
      }));
    }, 2400);
    return () => clearInterval(id);
  }, [inView, reduceMotion, selectedTopic]);

  const activeChip = ROUTE_CHIPS[pulse.index];

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
            const isActive = chip.id === activeChip.id;
            return (
              <g key={chip.id}>
                <DottedConnector
                  d={toPath(chip.curve)}
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
                  cx={chip.curve[0][0]}
                  cy={chip.curve[0][1]}
                  r="3"
                  strokeWidth="1.2"
                  className={cn(
                    "fill-card transition-colors duration-300 dark:fill-surface-2",
                    isActive ? "stroke-foreground/70" : "stroke-foreground/30",
                  )}
                />
                <circle
                  cx={chip.curve[3][0]}
                  cy={chip.curve[3][1]}
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
              key={pulse.count}
              initial={{ opacity: 0 }}
              animate={{
                x: PULSE_STEPS.map((t) => pointAt(activeChip.curve, t)[0]),
                y: PULSE_STEPS.map((t) => pointAt(activeChip.curve, t)[1]),
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.72,
                delay: 0.12,
                ease: "linear",
                opacity: {
                  duration: 0.72,
                  delay: 0.12,
                  times: [0, 0.16, 0.84, 1],
                  ease: "linear",
                },
              }}
            >
              <circle r="4.5" fill="currentColor" fillOpacity={0.1} />
              <circle r="2.2" fill="currentColor" />
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
        </div>

        {ROUTE_CHIPS.map((chip) => {
          const isSelected = chip.id === selectedTopic;
          const top = chip.anchorEdge === "bottom" ? chip.anchorY - 24 : chip.anchorY;
          return (
            <div
              key={chip.id}
              className="absolute flex -translate-x-1/2"
              style={{ left: chip.anchorX, top }}
            >
              <motion.button
                type="button"
                onClick={() => onSelectTopic(chip.id)}
                aria-pressed={isSelected}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: isSelected ? 1.04 : 1, y: isSelected ? -1 : 0 }
                }
                transition={{ type: "spring", duration: 0.22, bounce: 0 }}
                className={cn(
                  "inline-flex h-6 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md bg-card px-2 font-ui text-xs leading-4 outline-none transition-[box-shadow,color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] dark:bg-surface-2",
                  isSelected
                    ? "font-medium text-foreground shadow-[inset_0_0_0_1px_rgba(23,23,23,0.22),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24),0_4px_12px_-4px_rgba(0,0,0,0.35)]"
                    : "text-muted-foreground shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.03)] hover:text-foreground dark:shadow-[inset_0_0_0_1px_var(--edge-3)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-[5px] shrink-0 rounded-full", chip.dotClass)}
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
