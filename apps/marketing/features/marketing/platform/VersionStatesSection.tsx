"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Archive01Icon,
  BubbleChatIcon,
  PencilEdit02Icon,
  SentIcon,
  SquareLock02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PULSE_EASE = [0.45, 0, 0.25, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.45, bounce: 0 };

const STATES: {
  label: string;
  sub: string;
  dot: string;
  version: string;
  caption: string;
  left: number;
  icon: IconSvgElement;
}[] = [
  {
    label: "Draft",
    sub: "Editable · 7 tabs",
    dot: "bg-stage-draft",
    version: "v4.0",
    caption: "Active authoring across all 7 tabs",
    left: 44,
    icon: PencilEdit02Icon,
  },
  {
    label: "Submitted",
    sub: "100% ready to route",
    dot: "bg-stage-submitted",
    version: "v3.0",
    caption: "All 7 tabs verified and queued for review",
    left: 280,
    icon: SentIcon,
  },
  {
    label: "In review",
    sub: "Guarded · 3 approvers",
    dot: "bg-stage-review",
    version: "v3.0",
    caption: "Guarded while RA, QA & Packaging sign off",
    left: 516,
    icon: BubbleChatIcon,
  },
  {
    label: "Released",
    sub: "Immutable live master",
    dot: "bg-stage-released",
    version: "v3.0",
    caption: "Locked for manufacturing & QMS audits",
    left: 752,
    icon: SquareLock02Icon,
  },
  {
    label: "Obsolete",
    sub: "Archived history",
    dot: "bg-stage-draft/60",
    version: "v2.0",
    caption: "Superseded automatically · read-only archive",
    left: 988,
    icon: Archive01Icon,
  },
];

const SEQUENCE = [0, 1, 2, 3, 3, 4] as const;
const CARD_W = 196;
const CONNECTORS = [
  [240, 280],
  [476, 516],
  [712, 752],
  [948, 988],
] as const;

function LifecycleDiagram({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [tick, setTick] = React.useState(3);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [pillWidth, setPillWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (reduceMotion || !inView || hovered !== null || selected !== null) return;
    const id = setInterval(() => setTick((value) => value + 1), 2100);
    return () => clearInterval(id);
  }, [reduceMotion, inView, hovered, selected]);

  const active = hovered ?? selected ?? (reduceMotion ? 3 : SEQUENCE[tick % SEQUENCE.length]);
  const activeState = STATES[active];
  const centerX = activeState.left + CARD_W / 2;

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setPillWidth(Math.ceil(el.offsetWidth));
  }, [active]);

  const effectivePillWidth = pillWidth ?? 300;
  const clampedX = Math.max(
    effectivePillWidth / 2 + 12,
    Math.min(1228 - effectivePillWidth / 2 - 12, centerX),
  );
  const caretOffset = centerX - clampedX;

  return (
    <ScaledCanvas
      ref={ref}
      width={1228}
      height={244}
      minScale={0.58}
      panX={centerX}
      panBelow={820}
    >
      {/* Subtle vertical column guide lines */}
      {STATES.map((st) => (
        <span
          key={st.label}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-[244px] w-0 border-l border-dashed border-foreground/[0.08] [mask-image:linear-gradient(transparent,#000_25%,#000_75%,transparent)]"
          style={{ left: st.left + CARD_W / 2 }}
        />
      ))}

      <svg
        width="1228"
        height="244"
        viewBox="0 0 1228 244"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {CONNECTORS.map(([from, to], idx) => {
          const isLit = idx < active;
          return (
            <g key={from}>
              <DottedConnector
                d={`M${from + 3} 108H${to - 3}`}
                active={isLit}
                canvasWidth={1228}
                canvasHeight={244}
                baseOpacity={0.22}
                activeOpacity={0.75}
                transition={{ duration: 0.4, ease: PULSE_EASE }}
              />
              <circle
                cx={(from + to) / 2}
                cy="108"
                r="2.4"
                fill="currentColor"
                opacity={isLit ? 0.9 : 0.22}
              />
              <circle
                cx={from + 2}
                cy="108"
                r="2.8"
                strokeWidth="1.2"
                className="fill-card stroke-foreground/35 dark:fill-surface-2"
              />
              <circle
                cx={to - 2}
                cy="108"
                r="2.8"
                strokeWidth="1.2"
                className="fill-card stroke-foreground/35 dark:fill-surface-2"
              />
            </g>
          );
        })}
      </svg>

      {STATES.map((st, idx) => {
        const isActive = idx === active;
        const isObsolete = idx === 4 && !isActive;
        return (
          <motion.button
            key={st.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => setSelected((prev) => (prev === idx ? null : idx))}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(idx)}
            onBlur={() => setHovered(null)}
            animate={{ scale: isActive ? 1.03 : 1 }}
            transition={{ type: "spring", duration: 0.24, bounce: 0 }}
            style={{ left: st.left, top: 72, width: CARD_W }}
            className={cn(
              "absolute cursor-pointer rounded-[17px] border p-1 text-left outline-none transition-[background-color,border-color,box-shadow,opacity,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
              isActive
                ? "z-10 border-foreground/15 bg-foreground/[0.06] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.25)] dark:border-edge-3 dark:bg-white/[0.06]"
                : "border-foreground/[0.06] bg-frame-surface dark:border-edge-1",
              isObsolete && "opacity-60 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-95",
            )}
          >
            <span
              className={cn(
                "flex h-[62px] items-center gap-3 rounded-[13px] border px-3 transition-colors duration-300",
                isActive
                  ? "border-white/10 bg-tooltip text-tooltip-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-white/15"
                  : "border-border bg-card text-foreground dark:border-edge-2 dark:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[10px] border transition-colors duration-300",
                  isActive
                    ? "border-white/[0.12] bg-white/[0.08] text-white"
                    : "border-stroke-primary bg-subtle text-foreground/80 dark:border-edge-2 dark:bg-surface-3",
                )}
              >
                <Icon icon={st.icon} size={16} strokeWidth={1.7} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="flex items-center gap-1.5 font-ui text-[13px] font-semibold leading-4">
                  <span className={cn("size-1.5 shrink-0 rounded-full", st.dot)} />
                  <span className="truncate">{st.label}</span>
                </span>
                <span
                  className={cn(
                    "truncate font-ui text-[11px] leading-[14px] transition-colors duration-300",
                    isActive ? "text-white/60" : "text-muted-foreground",
                  )}
                >
                  {st.sub}
                </span>
              </span>
            </span>
          </motion.button>
        );
      })}

      {/* Hidden mirror for smooth measured width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute flex h-[32px] items-center gap-2 whitespace-nowrap px-3.5"
      >
        <span className="font-mono text-[10.5px] leading-3">{activeState.version}</span>
        <span className="font-ui text-[11.5px] font-medium leading-4">{activeState.caption}</span>
      </span>

      <motion.div
        role="status"
        aria-live="polite"
        initial={false}
        animate={{ x: clampedX }}
        transition={SPRING}
        className="pointer-events-none absolute left-0 top-[156px] flex -translate-x-1/2 flex-col items-center"
      >
        <motion.svg
          width="10"
          height="5"
          viewBox="0 0 10 5"
          aria-hidden="true"
          initial={false}
          animate={{ x: caretOffset }}
          transition={SPRING}
          className="text-tooltip"
        >
          <path d="M0 5L5 0L10 5z" fill="currentColor" />
        </motion.svg>
        <motion.div
          initial={false}
          animate={pillWidth ? { width: pillWidth } : undefined}
          transition={{ type: "spring", duration: 0.24, bounce: 0 }}
          className="relative flex h-[32px] items-center justify-center overflow-hidden rounded-lg bg-tooltip shadow-[0_10px_22px_-8px_rgba(0,0,0,0.4)]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={activeState.label}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, filter: "blur(3px)" }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex items-center gap-2 whitespace-nowrap px-3.5"
            >
              <span className="font-mono text-[10.5px] leading-3 text-white/55 tabular-nums">
                {activeState.version}
              </span>
              <span className="font-ui text-[11.5px] font-medium leading-4 text-tooltip-foreground">
                {activeState.caption}
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </ScaledCanvas>
  );
}

export default function VersionStatesSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="version-states-heading" className="contents">
        <SectionHeader
          id="version-states-heading"
          anchorId="lifecycle"
          title="Five explicit states."
          mutedTitle="Zero guesswork."
        >
          Every product version carries a clear lifecycle state—separating
          active authoring from review, live production masters, and retired
          history.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <LifecycleDiagram reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
