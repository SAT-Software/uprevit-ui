"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  CubeIcon,
  FingerPrintIcon,
  PencilEdit02Icon,
  SecurityCheckIcon,
  Settings01Icon,
  Tag01Icon,
  UserMultipleIcon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { BrandMark } from "@/components/BrandLogo";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "./DotsBackdrop";
import { DottedConnector } from "./DottedConnector";
import { ScaledCanvas } from "./ScaledCanvas";
import { SectionHeader } from "./SectionHeader";
import { usePlayback } from "./usePlayback";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.45, bounce: 0 };

function useTicker(intervalMs: number, enabled: boolean) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || !inView) return;
    const id = setInterval(() => setTick((value) => value + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, inView, intervalMs]);

  return [ref, tick] as const;
}

export function GovTile({
  title,
  body,
  maxWidth = 420,
  className,
  children,
}: {
  title: string;
  body: string;
  maxWidth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "relative flex min-w-0 flex-col gap-5 overflow-hidden rounded-tile bg-tile pt-6 sm:gap-7 sm:pt-10",
        className,
      )}
    >
      <DotsBackdrop
        className="top-24 opacity-30"
        dotsClassName="[mask-image:radial-gradient(ellipse_76%_72%_at_50%_50%,transparent_58%,#000_78%,transparent_96%)]"
      />
      <div className="relative flex flex-col gap-1.5 px-5 sm:px-8 lg:px-10">
        <h3 className="font-ui text-[16px] font-medium leading-[22px] text-foreground">
          {title}
        </h3>
        <p
          className="font-ui text-[14px] leading-[22px] text-muted-foreground"
          style={{ maxWidth }}
        >
          {body}
        </p>
      </div>
      {children}
    </article>
  );
}

/* ---------------------------- Role-based access --------------------------- */

const ROLES: {
  label: string;
  description: string;
  left: number;
  top: number;
  labelLeft: number;
  labelTop: number;
  spoke: string;
  pulseFrom: readonly [number, number];
  pulseTo: readonly [number, number];
  icon: IconSvgElement;
}[] = [
  {
    label: "Admin",
    description: "Manage workspace, members & approvals",
    left: 192,
    top: 24,
    labelLeft: 250,
    labelTop: 42,
    spoke: "M218 95L218 75",
    pulseFrom: [218, 98],
    pulseTo: [218, 72],
    icon: Settings01Icon,
  },
  {
    label: "User",
    description: "Create and edit product records",
    left: 292,
    top: 124,
    labelLeft: 350,
    labelTop: 142,
    spoke: "M273 150L293 150",
    pulseFrom: [270, 150],
    pulseTo: [296, 150],
    icon: PencilEdit02Icon,
  },
  {
    label: "Approver",
    description: "Review and approve assigned workflows",
    left: 192,
    top: 224,
    labelLeft: 250,
    labelTop: 242,
    spoke: "M218 205L218 225",
    pulseFrom: [218, 202],
    pulseTo: [218, 228],
    icon: CheckmarkBadge01Icon,
  },
  {
    label: "Manager",
    description: "Manage billing and invoices",
    left: 92,
    top: 124,
    labelLeft: 36,
    labelTop: 142,
    spoke: "M163 150L143 150",
    pulseFrom: [166, 150],
    pulseTo: [140, 150],
    icon: UserShield01Icon,
  },
];

const PULSE_EASE = [0.45, 0, 0.25, 1] as const;
const WHEEL_SPRING = { type: "spring" as const, duration: 0.65, bounce: 0.08 };
const ORBIT_SLOTS = [
  { left: 74, top: -26 },
  { left: 174, top: 74 },
  { left: 74, top: 174 },
  { left: -26, top: 74 },
] as const;

function RotatingRoleWheel({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const [rotationStep, setRotationStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [pillWidth, setPillWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (reduceMotion || !inView || paused) return;
    const id = setInterval(() => setRotationStep((value) => value + 1), 2600);
    return () => clearInterval(id);
  }, [reduceMotion, inView, paused]);

  const active = ((rotationStep % ROLES.length) + ROLES.length) % ROLES.length;
  const activeRole = ROLES[active];
  const wheelAngle = -rotationStep * 90;
  const [announcement, setAnnouncement] = React.useState("");

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setPillWidth(Math.ceil(el.offsetWidth));
  }, [active]);

  const handleSelectRole = (targetIndex: number) => {
    const target = ROLES[targetIndex];
    if (target) {
      setAnnouncement(`${target.label}: ${target.description}`);
    }
    const diff = ((targetIndex - active + 5) % ROLES.length) - 1;
    if (diff === 0) return;
    setRotationStep((value) => value + diff);
  };

  return (
    <ScaledCanvas
      ref={ref}
      width={436}
      height={356}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      className="[mask-image:linear-gradient(#000_92%,transparent_100%)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1.5 flex flex-col items-center"
      >
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute flex h-[30px] items-center gap-2 whitespace-nowrap px-3"
        >
          <span className="font-mono text-[10px] uppercase leading-3">{activeRole.label}</span>
          <span className="h-2.5 w-px shrink-0" />
          <span className="font-ui text-[12px] font-medium leading-4">{activeRole.description}</span>
        </span>

        <motion.div
          initial={false}
          animate={pillWidth ? { width: pillWidth } : undefined}
          transition={{ type: "spring", duration: 0.24, bounce: 0 }}
          className="relative flex h-[30px] items-center justify-center overflow-hidden rounded-md bg-tooltip shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={activeRole.label}
              className="flex items-center gap-2 whitespace-nowrap px-3"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, filter: "blur(3px)" }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <span className="font-mono text-[10px] uppercase leading-3 text-white/60">
                {activeRole.label}
              </span>
              <span className="h-2.5 w-px shrink-0 bg-white/15" />
              <span className="font-ui text-[12px] font-medium leading-4 text-tooltip-foreground">
                {activeRole.description}
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <svg
          width="12"
          height="6"
          viewBox="0 0 12 6"
          aria-hidden="true"
          className="text-tooltip"
        >
          <path d="M0 0L6 6L12 0z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute inset-x-0 top-6 h-[340px]">
        <div
          aria-hidden="true"
          className="absolute left-12 top-[-20px] size-[340px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(23,23,23,0.08)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(237,237,237,0.08)_0%,transparent_65%)]"
        />
        <span
          aria-hidden="true"
          className="absolute left-[118px] top-[50px] size-[200px] rounded-full border border-dashed border-stroke-strong dark:border-edge-3"
        />

        <svg
          width="436"
          height="340"
          viewBox="0 0 436 340"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {ROLES.map((role, index) => (
            <DottedConnector
              key={role.label}
              d={role.spoke}
              active={index === 0}
              canvasWidth={436}
              canvasHeight={340}
              baseOpacity={0.18}
              activeOpacity={0.78}
              transition={{ duration: 0.35, ease: PULSE_EASE }}
            />
          ))}
          {!reduceMotion && rotationStep > 0 && (
            <motion.g
              key={rotationStep}
              initial={{ x: 218, y: 98, opacity: 0 }}
              animate={{ x: 218, y: 72, opacity: [0, 1, 1, 0] }}
              transition={{
                x: { duration: 0.38, delay: 0.14, ease: PULSE_EASE },
                y: { duration: 0.38, delay: 0.14, ease: PULSE_EASE },
                opacity: { duration: 0.38, delay: 0.14, times: [0, 0.16, 0.84, 1], ease: "linear" },
              }}
            >
              <circle cx="0" cy="0" r="4.5" fill="currentColor" fillOpacity={0.09} />
              <circle cx="0" cy="0" r="2" fill="currentColor" />
            </motion.g>
          )}
        </svg>

        <div className="absolute left-[162px] top-[94px] size-28 rounded-full bg-white/60 p-[5px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_12px_28px_-12px_rgba(0,0,0,0.25)] dark:bg-[#14141499] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_12px_28px_-12px_rgba(0,0,0,0.4)]">
          <div className="flex size-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7F7F7_0%,#E9E9E9_100%)] shadow-[inset_0_0_0_1px_#FFFFFF,inset_0_-2px_6px_rgba(0,0,0,0.06)] dark:bg-[linear-gradient(180deg,#191919_0%,#212121_100%)] dark:shadow-[inset_0_0_0_1px_#141414,inset_0_-2px_6px_rgba(0,0,0,0.1)]">
            <Icon icon={SecurityCheckIcon} size={36} strokeWidth={1.5} className="shrink-0 text-foreground" />
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ rotate: wheelAngle }}
          transition={reduceMotion ? { duration: 0 } : WHEEL_SPRING}
          className="absolute left-[118px] top-[50px] size-[200px]"
        >
          {ROLES.map((role, index) => {
            const isActive = index === active;
            const slot = ORBIT_SLOTS[index];
            return (
              <div
                key={role.label}
                className="absolute size-[52px]"
                style={{ left: slot.left, top: slot.top }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: -wheelAngle }}
                  transition={reduceMotion ? { duration: 0 } : WHEEL_SPRING}
                  className="relative size-full"
                >
                  <motion.button
                    type="button"
                    aria-label={`${role.label}: ${role.description}`}
                    aria-pressed={isActive}
                    onClick={() => handleSelectRole(index)}
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    transition={{ type: "spring", duration: 0.24, bounce: 0 }}
                    className="size-full cursor-pointer rounded-full bg-white/70 p-[3px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_4px_10px_-4px_rgba(0,0,0,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-[#141414B3] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_4px_10px_-4px_rgba(0,0,0,0.3)]"
                  >
                    <span className="relative flex size-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F4F4_100%)] shadow-[inset_0_0_0_1px_rgba(23,23,23,0.08)] dark:bg-[linear-gradient(180deg,#141414_0%,#1B1B1B_100%)] dark:shadow-[inset_0_0_0_1px_rgba(237,237,237,0.08)]">
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 0.9,
                        }}
                        transition={{ duration: 0.28, ease: EASE_OUT }}
                        className="absolute inset-0 rounded-full bg-[#1A1A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_5px_rgba(23,23,23,0.08)] dark:bg-[#EDEDED] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_5px_rgba(237,237,237,0.1)]"
                      />
                      <span
                        className={cn(
                          "relative z-10 flex transition-colors duration-300 ease-out",
                          isActive ? "text-white dark:text-[#141414]" : "text-foreground/75",
                        )}
                      >
                        <Icon icon={role.icon} size={18} strokeWidth={1.6} />
                      </span>
                    </span>
                  </motion.button>
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      opacity: isActive && !reduceMotion ? 0 : isActive ? 1 : 0.65,
                      y: isActive && !reduceMotion ? -3 : 0,
                    }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    className="pointer-events-none absolute left-1/2 top-[57px] -translate-x-1/2 whitespace-nowrap font-ui text-[11px] font-medium leading-[14px] text-muted-foreground"
                  >
                    {role.label}
                  </motion.span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </div>
    </ScaledCanvas>
  );
}

export function RoleBasedAccess({
  reduceMotion,
  badgeVariant = "simple",
  activeRoleIndex,
  onRoleHover,
}: {
  reduceMotion: boolean;
  badgeVariant?: "simple" | "detailed" | "tooltip";
  activeRoleIndex?: number | null;
  onRoleHover?: (index: number | null) => void;
}) {
  if (badgeVariant === "tooltip") {
    return <RotatingRoleWheel reduceMotion={reduceMotion} />;
  }

  return (
    <StaticRoleBasedAccess
      reduceMotion={reduceMotion}
      badgeVariant={badgeVariant}
      activeRoleIndex={activeRoleIndex}
      onRoleHover={onRoleHover}
    />
  );
}

function StaticRoleBasedAccess({
  reduceMotion,
  badgeVariant = "simple",
  activeRoleIndex,
  onRoleHover,
}: {
  reduceMotion: boolean;
  badgeVariant?: "simple" | "detailed";
  activeRoleIndex?: number | null;
  onRoleHover?: (index: number | null) => void;
}) {
  const [internalHovered, setInternalHovered] = React.useState<number | null>(null);
  const hovered = activeRoleIndex !== undefined ? activeRoleIndex : internalHovered;
  const setHovered = React.useCallback(
    (index: number | null) => {
      setInternalHovered(index);
      onRoleHover?.(index);
    },
    [onRoleHover],
  );
  const [ref, tick] = useTicker(2200, !reduceMotion && hovered === null);
  const active = hovered ?? tick % ROLES.length;
  const activeRole = ROLES[active];
  const hasTransitioned = tick > 0 || hovered !== null;
  const pulseDuration = hovered !== null ? 0.24 : 0.42;
  const activationDelay = !reduceMotion && hasTransitioned ? (hovered !== null ? 0.14 : 0.3) : 0;
  const pulseTransition = {
    cx: { duration: pulseDuration, ease: PULSE_EASE },
    cy: { duration: pulseDuration, ease: PULSE_EASE },
    opacity: { duration: pulseDuration, times: [0, 0.16, 0.84, 1], ease: "linear" as const },
  };

  return (
    <ScaledCanvas
      ref={ref}
      width={436}
      height={340}
      className="[mask-image:linear-gradient(#000_85%,transparent_100%)]"
    >
      <div className="absolute inset-x-0 top-0 h-[340px]">
        <div
          aria-hidden="true"
          className="absolute left-12 top-[-20px] size-[340px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(23,23,23,0.08)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(237,237,237,0.08)_0%,transparent_65%)]"
        />
        <span
          aria-hidden="true"
          className="absolute left-[118px] top-[50px] size-[200px] rounded-full border border-dashed border-stroke-strong dark:border-edge-3"
        />

        <svg
          width="436"
          height="340"
          viewBox="0 0 436 340"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {ROLES.map((role, index) => (
            <DottedConnector
              key={role.label}
              d={role.spoke}
              active={index === active}
              canvasWidth={436}
              canvasHeight={340}
              baseOpacity={0.18}
              activeOpacity={0.78}
              transition={{
                duration: index === active ? pulseDuration * 0.9 : 0.25,
                ease: PULSE_EASE,
              }}
            />
          ))}
          {!reduceMotion && hasTransitioned && (
            <g key={`${active}-${tick}`}>
              <motion.circle
                r="4.5"
                fill="currentColor"
                fillOpacity={0.09}
                initial={{ cx: activeRole.pulseFrom[0], cy: activeRole.pulseFrom[1], opacity: 0 }}
                animate={{
                  cx: activeRole.pulseTo[0],
                  cy: activeRole.pulseTo[1],
                  opacity: [0, 1, 1, 0],
                }}
                transition={pulseTransition}
              />
              <motion.circle
                r="2"
                fill="currentColor"
                initial={{ cx: activeRole.pulseFrom[0], cy: activeRole.pulseFrom[1], opacity: 0 }}
                animate={{
                  cx: activeRole.pulseTo[0],
                  cy: activeRole.pulseTo[1],
                  opacity: [0, 1, 1, 0],
                }}
                transition={pulseTransition}
              />
            </g>
          )}
        </svg>

        <div className="absolute left-[162px] top-[94px] size-28 rounded-full bg-white/60 p-[5px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_12px_28px_-12px_rgba(0,0,0,0.25)] dark:bg-[#14141499] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_12px_28px_-12px_rgba(0,0,0,0.4)]">
          <div className="flex size-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7F7F7_0%,#E9E9E9_100%)] shadow-[inset_0_0_0_1px_#FFFFFF,inset_0_-2px_6px_rgba(0,0,0,0.06)] dark:bg-[linear-gradient(180deg,#191919_0%,#212121_100%)] dark:shadow-[inset_0_0_0_1px_#141414,inset_0_-2px_6px_rgba(0,0,0,0.1)]">
            <Icon icon={SecurityCheckIcon} size={36} strokeWidth={1.5} className="shrink-0 text-foreground" />
          </div>
        </div>

        {ROLES.map((role, index) => {
          const isActive = index === active;
          const delay = isActive ? activationDelay : 0;
          return (
            <React.Fragment key={role.label}>
              <motion.button
                type="button"
                aria-label={role.label}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                animate={{ scale: isActive ? 1.08 : 1 }}
                transition={{ type: "spring", duration: 0.55, bounce: 0.16, delay }}
                className="absolute size-[52px] cursor-default rounded-full bg-white/70 p-[3px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_4px_10px_-4px_rgba(0,0,0,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-[#141414B3] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_4px_10px_-4px_rgba(0,0,0,0.3)]"
                style={{ left: role.left, top: role.top }}
              >
                <span className="relative flex size-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F4F4_100%)] shadow-[inset_0_0_0_1px_rgba(23,23,23,0.08)] dark:bg-[linear-gradient(180deg,#141414_0%,#1B1B1B_100%)] dark:shadow-[inset_0_0_0_1px_rgba(237,237,237,0.08)]">
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.86,
                    }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0, delay }}
                    className="absolute inset-0 rounded-full bg-[#1A1A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_5px_rgba(23,23,23,0.08)] dark:bg-[#EDEDED] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_5px_rgba(237,237,237,0.1)]"
                  />
                  <span
                    className={cn(
                      "relative z-10 flex transition-colors duration-400 ease-out",
                      isActive
                        ? "text-white dark:text-[#141414]"
                        : "text-foreground/75",
                    )}
                    style={{ transitionDelay: `${delay}s` }}
                  >
                    <Icon icon={role.icon} size={18} strokeWidth={1.6} />
                  </span>
                </span>
              </motion.button>
              <motion.span
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.55,
                  y: isActive ? -1 : 0,
                }}
                transition={{ duration: 0.35, ease: EASE_OUT, delay }}
                className={cn(
                  "absolute font-ui text-[11px] font-medium leading-[14px] transition-colors duration-400",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
                style={{ left: role.labelLeft, top: role.labelTop, transitionDelay: `${delay}s` }}
              >
                {role.label}
              </motion.span>
            </React.Fragment>
          );
        })}

      </div>

      {badgeVariant === "detailed" ? (
        <div className="absolute inset-x-0 top-[296px] flex justify-center">
          <div className="flex h-[30px] items-center gap-2 rounded-md border border-stroke-primary bg-card pl-1.5 pr-3 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-50 shadow-[inset_0_0_0_1px_rgba(127,34,254,0.15)] dark:bg-primary-soft dark:shadow-[inset_0_0_0_1px_rgba(143,64,255,0.28)]">
              <Icon
                icon={SecurityCheckIcon}
                size={12}
                strokeWidth={2}
                className="text-primary dark:text-primary-text"
              />
            </span>
            <span className="whitespace-nowrap font-ui text-label font-medium leading-4 text-foreground">
              Access by role
            </span>
            <span className="h-3 w-px shrink-0 bg-stroke-strong dark:bg-edge-3" />
            <span className="whitespace-nowrap font-mono text-caption leading-[14px] text-muted-foreground">
              4 roles
            </span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-0 top-[292px] flex justify-center">
          <div className="flex h-7 items-center gap-1.5 rounded-sm border border-stroke-primary bg-card px-3 font-ui text-[12px] font-medium leading-4 text-foreground shadow-[0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2">
            Access by role
          </div>
        </div>
      )}
    </ScaledCanvas>
  );
}

/* ------------------------ Timestamped activity log ------------------------ */

const LOG_SOURCES: { label: string; top: number; y: number; icon: IconSvgElement }[] = [
  { label: "Products", top: 43, y: 69, icon: CubeIcon },
  { label: "Workflows", top: 133, y: 159, icon: CheckmarkBadge01Icon },
  { label: "Team", top: 223, y: 249, icon: UserMultipleIcon },
];

const LOG_LAYOUT = {
  default: { width: 873, offset: 0, sourceLeft: 140, lineX: 192, panelLeft: 360, panelWidth: 480, curve: [74, 86], panX: 600 },
  compact: { width: 582, offset: 0, sourceLeft: 12, lineX: 64, panelLeft: 154, panelWidth: 422, curve: [42, 42], panX: 380 },
};

function logPath(y: number, layout: (typeof LOG_LAYOUT)["default"]) {
  const { lineX, panelLeft, curve } = layout;
  if (y === 159) return `M${lineX} 159H${panelLeft}`;
  return `M${lineX} ${y}C${lineX + curve[0]} ${y} ${panelLeft - curve[1]} 159 ${panelLeft} 159`;
}

const LOG_ENTRIES: {
  time: string;
  tag: string;
  tone: "success" | "info" | "neutral";
  text: string;
  source: number;
}[] = [
  { time: "10:42:08", tag: "Released", tone: "success", text: "IV Extension Set v5 released", source: 0 },
  { time: "10:31:55", tag: "Approved", tone: "info", text: "Ravi K. approved review round 2", source: 1 },
  { time: "10:12:40", tag: "Edited", tone: "neutral", text: "Shelf life changed from 3 to 5 years", source: 0 },
  { time: "09:58:17", tag: "Imported", tone: "neutral", text: "48 rows from PX-2042_specs.xlsx", source: 0 },
  { time: "09:41:02", tag: "Invited", tone: "neutral", text: "Marta L. invited as Approver", source: 2 },
];

const LOG_BADGE = {
  success:
    "border-stage-released/25 bg-success-soft text-success-strong uppercase dark:border-stage-released/30 dark:text-success",
  info: "border-stage-submitted/25 bg-info-soft text-info-strong uppercase dark:border-stage-submitted/30 dark:text-diff-added",
  neutral:
    "border-stroke-primary bg-muted text-muted-foreground uppercase dark:border-edge-2 dark:bg-surface-3 dark:text-muted-foreground",
};

export function ActivityLog({
  reduceMotion,
  variant = "default",
}: {
  reduceMotion: boolean;
  variant?: keyof typeof LOG_LAYOUT;
}) {
  const [ref, on, inView] = usePlayback(reduceMotion, 8500);
  const layout = LOG_LAYOUT[variant];

  return (
    <ScaledCanvas
      ref={ref}
      aria-hidden="true"
      width={layout.width}
      height={340}
      minScale={0.68}
      panX={layout.panX}
      panBelow={640}
      className="[mask-image:linear-gradient(#000_85%,transparent_100%)]"
    >
      <div className="relative h-[340px]" style={{ width: layout.width }}>
        <svg
          width={layout.width}
          height="340"
          viewBox={`0 0 ${layout.width} 340`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {LOG_SOURCES.map((source, index) => (
            <g key={source.label}>
              <path
                d={logPath(source.y, layout)}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.22}
                strokeWidth="1.2"
                strokeDasharray="3 4"
              />
              {!reduceMotion && on && inView && (
                <g opacity="0">
                  <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2" fill="currentColor" />
                  <animateMotion
                    path={logPath(source.y, layout)}
                    dur="2.8s"
                    begin={`${0.15 + index * 0.75}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.45 0 0.25 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.82;1"
                    dur="2.8s"
                    begin={`${0.15 + index * 0.75}s`}
                    repeatCount="indefinite"
                  />
                </g>
              )}
            </g>
          ))}
          {LOG_SOURCES.map((source) => (
            <path
              key={source.y}
              d={`M${layout.lineX} ${source.y - 3.25}A3.25 3.25 0 0 1 ${layout.lineX} ${source.y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/40 dark:fill-surface-2"
            />
          ))}
          <path
            d={`M${layout.panelLeft} 155.75A3.25 3.25 0 0 0 ${layout.panelLeft} 162.25`}
            strokeWidth="1.2"
            className="fill-card stroke-foreground/40 dark:fill-surface-2"
          />
        </svg>

        {LOG_SOURCES.map((source) => (
          <div
            key={source.label}
            className="absolute flex flex-col items-center gap-1.5"
            style={{ left: layout.sourceLeft, top: source.top }}
          >
            <div className="size-[52px] rounded-[14px] border border-foreground/5 bg-[#F5F5F5BF] p-[3px] dark:border-separator dark:bg-[#1A1A1ABF]">
              <div className="flex size-full items-center justify-center rounded-[11px] bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]">
                <Icon icon={source.icon} size={18} strokeWidth={1.6} className="shrink-0 text-foreground" />
              </div>
            </div>
            <span className="font-ui text-[11px] leading-[14px] text-placeholder">
              {source.label}
            </span>
          </div>
        ))}

        <div
          className="absolute top-6 rounded-2xl border border-foreground/5 bg-[#F5F5F5BF] p-[5px] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.18)] dark:border-separator dark:bg-[#1A1A1ABF]"
          style={{ left: layout.panelLeft, width: layout.panelWidth }}
        >
          <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-separator bg-subtle px-4 dark:border-edge-1 dark:bg-[#171717]">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="size-2 shrink-0 rounded-full bg-foreground/15" />
              ))}
              <span className="ml-1.5 font-ui text-[12px] font-medium leading-4 text-muted-foreground">
                Workspace activity
              </span>
              <span className="flex-1" />
              <span className="font-ui text-[11px] leading-[14px] text-placeholder">Today</span>
            </div>
            {LOG_ENTRIES.map((entry, index) => {
              const orderFromBottom = LOG_ENTRIES.length - 1 - index;
              return (
                <motion.div
                  key={entry.time}
                  initial={false}
                  animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={
                    on
                      ? {
                          duration: 0.4,
                          ease: EASE_OUT,
                          delay: 0.25 + orderFromBottom * 0.55,
                        }
                      : { duration: 0.2 }
                  }
                  className={cn(
                    "flex h-10 shrink-0 items-center",
                    variant === "compact" ? "gap-2.5 px-3.5" : "gap-3 px-4",
                    index < LOG_ENTRIES.length - 1 && "border-b border-separator dark:border-edge-1",
                  )}
                >
                  <span className={cn("font-mono leading-4 text-placeholder", variant === "compact" ? "text-[11px]" : "text-[12px]")}>
                    {entry.time}
                  </span>
                  <span className={cn("flex shrink-0", variant === "compact" ? "w-[68px]" : "w-[72px]")}>
                    <span
                      className={cn(
                        "flex h-5 items-center rounded-[5px] border px-1.5 font-mono text-[10px] leading-3",
                        LOG_BADGE[entry.tone],
                      )}
                    >
                      {entry.tag}
                    </span>
                  </span>
                  <span className={cn("whitespace-nowrap font-ui leading-4 text-foreground", variant === "compact" ? "text-[12.5px]" : "text-[13px]")}>
                    {entry.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

/* ---------------------------- Data in, data out --------------------------- */

const DATA_PATHS = [
  "M144 110C210 110 210 155 276 155",
  "M144 230C210 230 210 185 276 185",
  "M596 155C662 155 662 110 728 110",
  "M596 185C662 185 662 230 728 230",
];

function DataFileTile({
  kind,
  left,
  top,
}: {
  kind: "xlsx" | "pdf" | "csv";
  left: number;
  top: number;
}) {
  return (
    <div
      className="absolute flex rounded-l-[9px] rounded-r-[9px] rounded-tr-[14px] border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2"
      style={{ left, top }}
    >
      <div className="flex h-[50px] w-10 shrink-0 flex-col gap-[3px] rounded-l-[7px] rounded-br-[7px] rounded-tr-[11px] bg-file-sheet px-[7px] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        {kind === "xlsx" &&
          [true, false, false, false].map((head, row) => (
            <div key={row} className="flex gap-0.5">
              {[0, 1, 2].map((cell) => (
                <span
                  key={cell}
                  className={cn(
                    "h-[5px] flex-1 rounded-[1px]",
                    head ? "bg-[#05966933] dark:bg-[#34D39973]" : "bg-file-line",
                  )}
                />
              ))}
            </div>
          ))}
        {kind === "pdf" && (
          <>
            <span className="h-3 w-full shrink-0 rounded-[2px] bg-[#E7000B14] dark:bg-[#F8717173]" />
            {[86, 92, 64].map((w, i) => (
              <span
                key={w}
                className={cn("h-[3px] shrink-0 rounded-full bg-file-line", i === 0 && "mt-px")}
                style={{ width: `${w}%` }}
              />
            ))}
          </>
        )}
        {kind === "csv" &&
          [true, false, false, false].map((head, row) => (
            <div key={row} className="mb-px flex gap-0.5">
              {[8, 10, 6].map((w) => (
                <span
                  key={w}
                  className={cn(
                    "h-[3px] shrink-0 rounded-full",
                    head ? "bg-[#14B8A666]" : "bg-foreground/10",
                  )}
                  style={{ width: w }}
                />
              ))}
            </div>
          ))}
      </div>
      <span
        className={cn(
          "absolute -left-2.5 bottom-2 z-10 rounded-sm border px-[5px] py-0.5 font-ui text-[10px] font-medium leading-3 text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:text-surface-0",
          kind === "xlsx" && "border-[#04785733] bg-success dark:border-[#34D39944]",
          kind === "pdf" && "border-[#B91C1C33] bg-destructive dark:border-[#F8717144]",
          kind === "csv" && "border-[#0F766E33] bg-teal dark:border-[#2DD4BF44]",
        )}
      >
        .{kind}
      </span>
    </div>
  );
}

function DataInOut({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on] = usePlayback(reduceMotion, 8000);
  const inView = useInView(ref, { margin: "-80px" });
  const [ledTick, setLedTick] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setInterval(() => setLedTick((value) => (value + 1) % 4), 750);
    return () => clearInterval(id);
  }, [reduceMotion, inView]);

  const litLeds = reduceMotion ? 2 : ledTick;

  return (
    <ScaledCanvas
      ref={ref}
      aria-hidden="true"
      width={873}
      height={340}
      minScale={0.54}
      panX={436}
      panBelow={640}
      className="[mask-image:linear-gradient(#000_85%,transparent_100%)]"
    >
      {[72, 277].map((top) => (
        <span
          key={top}
          aria-hidden="true"
          className="absolute left-40 h-0 w-[553px] border-t border-dashed border-foreground/15 [mask-image:linear-gradient(to_right,transparent_0%,#000_20%,#000_80%,transparent_100%)]"
          style={{ top }}
        />
      ))}
      {[276, 596].map((left) => (
        <span
          key={left}
          aria-hidden="true"
          className="absolute top-0 h-[340px] w-0 border-l border-dashed border-foreground/15 [mask-image:linear-gradient(transparent_0%,#000_22%,#000_78%,transparent_100%)]"
          style={{ left }}
        />
      ))}

      <div className="absolute left-[276px] top-[72px] w-80 rounded-[24px] border border-foreground/5 bg-frame-surface p-1.5 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.25)] dark:border-separator">
        <div className="flex gap-2 rounded-[18px] bg-[#EEEEEE] p-1.5 shadow-[inset_0_0_0_1px_rgba(23,23,23,0.04)] dark:bg-[#1E1E1E] dark:shadow-[inset_0_0_0_1px_rgba(237,237,237,0.04)]">
          <div className="relative flex h-[180px] w-[196px] shrink-0 flex-col justify-between rounded-xl bg-card px-3 py-2.5 shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]">
            <div className="flex items-center justify-between">
              <span className="size-1.5 rounded-full border border-foreground/20 bg-subtle dark:bg-[#171717]" />
              <span className="font-mono text-[9px] leading-3 text-foreground/40">
                48 products, 7 tabs
              </span>
              <span className="size-1.5 rounded-full border border-foreground/20 bg-subtle dark:bg-[#171717]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="size-1.5 rounded-full border border-foreground/20 bg-subtle dark:bg-[#171717]" />
              <span className="font-mono text-[9px] uppercase leading-3 text-foreground/40">Uprevit</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((dot) => {
                  const lit = dot < litLeds;
                  return (
                    <span
                      key={dot}
                      className={cn(
                        "size-[5px] rounded-full transition-[background-color,box-shadow] duration-300 ease-out",
                        lit
                          ? "bg-success shadow-[0_0_6px_rgba(5,150,105,0.45)] dark:shadow-[0_0_6px_rgba(52,211,153,0.45)]"
                          : "bg-foreground/15 shadow-none",
                      )}
                    />
                  );
                })}
              </span>
            </div>
            <div className="absolute left-[43px] top-[35px] flex size-[110px] items-center justify-center rounded-full border border-dashed border-foreground/15">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((pin) => (
                    <span key={pin} className="h-[7px] w-[1.5px] rounded-[2px] bg-foreground/20" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex flex-col gap-1.5">
                    {[0, 1, 2, 3].map((pin) => (
                      <span key={pin} className="h-[1.5px] w-[7px] rounded-[2px] bg-foreground/20" />
                    ))}
                  </div>
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F4F4_100%)] shadow-[0_0_0_1px_var(--stroke-primary),0_6px_14px_-6px_rgba(0,0,0,0.2)] dark:bg-[linear-gradient(180deg,#141414_0%,#1B1B1B_100%)] dark:shadow-[0_0_0_1px_var(--edge-2),0_6px_14px_-6px_rgba(0,0,0,0.4)]">
                    <BrandMark
                      className="h-[28px] w-[33.5px]"
                      markColor="currentColor"
                      arrowColor="var(--logo-chevron)"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[0, 1, 2, 3].map((pin) => (
                      <span key={pin} className="h-[1.5px] w-[7px] rounded-[2px] bg-foreground/20" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((pin) => (
                    <span key={pin} className="h-[7px] w-[1.5px] rounded-[2px] bg-foreground/20" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { label: "Products", icon: CubeIcon },
              { label: "Labels", icon: Tag01Icon },
            ].map((card) => (
              <div
                key={card.label}
                className="flex h-[86px] w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]"
              >
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-muted shadow-[inset_0_0_0_1px_var(--stroke-primary)] dark:bg-surface-3 dark:shadow-[inset_0_0_0_1px_var(--edge-2)]">
                  <Icon icon={card.icon} size={16} strokeWidth={1.6} className="shrink-0 text-foreground" />
                </span>
                <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">
                  {card.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="absolute left-24 top-[54px] w-12 text-center font-ui text-[11px] font-medium leading-[14px] text-placeholder">
        Import
      </span>
      <span className="absolute left-[728px] top-[54px] w-12 text-center font-ui text-[11px] font-medium leading-[14px] text-placeholder">
        Export
      </span>

      <DataFileTile kind="xlsx" left={96} top={81} />
      <DataFileTile kind="csv" left={96} top={201} />
      <DataFileTile kind="pdf" left={728} top={81} />
      <DataFileTile kind="xlsx" left={728} top={201} />

      <svg
        width="873"
        height="340"
        viewBox="0 0 873 340"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {DATA_PATHS.map((d, index) => (
          <g key={d}>
            <path
              d={d}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.22}
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            {!reduceMotion && on && inView && (
              <g opacity="0">
                <circle r="4.5" fill="currentColor" fillOpacity={0.08} />
                <circle r="2" fill="currentColor" />
                <animateMotion
                  path={d}
                  dur="3.2s"
                  begin={`${index < 2 ? index * 0.6 : 0.9 + (index - 2) * 0.6}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.82;1"
                  dur="3.2s"
                  begin={`${index < 2 ? index * 0.6 : 0.9 + (index - 2) * 0.6}s`}
                  repeatCount="indefinite"
                />
              </g>
            )}
          </g>
        ))}
        {[
          [144, 110],
          [144, 230],
          [728, 110],
          [728, 230],
          [276, 155],
          [276, 185],
          [596, 155],
          [596, 185],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3.25"
            strokeWidth="1.2"
            className="fill-card stroke-foreground/40 dark:fill-surface-2"
          />
        ))}
      </svg>
    </ScaledCanvas>
  );
}

/* ----------------------------- Single sign-on ----------------------------- */

export function SingleSignOn({
  reduceMotion,
  caption = "SAML or OIDC",
}: {
  reduceMotion: boolean;
  caption?: string;
}) {
  const [ref, on, inView] = usePlayback(reduceMotion, 7600);
  const [scanDone, setScanDone] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    if (!on) {
      const resetId = setTimeout(() => setScanDone(false), 0);
      return () => clearTimeout(resetId);
    }
    const id = setTimeout(() => setScanDone(true), 2550);
    return () => clearTimeout(id);
  }, [on, reduceMotion]);

  const verified = reduceMotion || (on && scanDone);

  return (
    <ScaledCanvas
      ref={ref}
      aria-hidden="true"
      width={436}
      height={340}
      className="[mask-image:linear-gradient(#000_85%,transparent_100%)]"
    >
      <div
        aria-hidden="true"
        className="absolute left-12 top-[-30px] size-[340px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(23,23,23,0.07)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(237,237,237,0.07)_0%,transparent_65%)]"
      />
      <span
        aria-hidden="true"
        className="absolute left-[114px] top-9 size-[208px] rounded-full border border-dashed border-border"
      />
      <span
        aria-hidden="true"
        className="absolute left-[68px] top-[-10px] size-[300px] rounded-full border border-dashed border-foreground/[0.07]"
      />
      <div
        aria-hidden="true"
        className="absolute left-36 top-[66px] size-[148px] rounded-full border-2 border-separator bg-[radial-gradient(circle_at_50%_15%,#FFFFFF_0%,#F1F1F1_55%,#E2E2E2_100%)] dark:border-edge-1 dark:bg-[radial-gradient(circle_at_50%_15%,#141414_0%,#1C1C1C_55%,#252525_100%)]"
      />
      <div className="absolute left-[156px] top-[78px] size-[124px] rounded-full bg-white/60 p-[5px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_12px_28px_-12px_rgba(0,0,0,0.25)] dark:bg-[#14141499] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_12px_28px_-12px_rgba(0,0,0,0.4)]">
        <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(180deg,#F7F7F7_0%,#E6E6E6_100%)] shadow-[inset_0_0_0_1px_#FFFFFF] dark:bg-[linear-gradient(180deg,#191919_0%,#232323_100%)] dark:shadow-[inset_0_0_0_1px_#141414]">
          <Icon
            icon={FingerPrintIcon}
            size={52}
            strokeWidth={1.4}
            className={cn(
              "shrink-0 transition-colors duration-500 ease-out",
              verified ? "text-foreground/75" : "text-foreground/30",
            )}
          />
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 top-0 flex flex-col items-center"
              initial={false}
              animate={
                on
                  ? {
                      y: [18, 92, 24, 92],
                      opacity: [0, 1, 1, 0],
                    }
                  : { y: 18, opacity: 0 }
              }
              transition={
                on
                  ? {
                      y: {
                        duration: 2.35,
                        times: [0, 0.34, 0.67, 1],
                        ease: EASE_IN_OUT,
                        delay: 0.15,
                      },
                      opacity: {
                        duration: 2.45,
                        times: [0, 0.1, 0.88, 1],
                        ease: "linear",
                        delay: 0.15,
                      },
                    }
                  : { duration: 0.15 }
              }
            >
              <span className="h-[1.5px] w-full rounded-full bg-foreground/55 shadow-[0_0_8px_1px_rgba(23,23,23,0.3)] dark:bg-white/70 dark:shadow-[0_0_10px_1px_rgba(255,255,255,0.4)]" />
              <span className="h-5 w-full bg-gradient-to-b from-foreground/15 to-transparent dark:from-white/15" />
            </motion.span>
          )}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ scale: verified ? 1 : 0.95 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        className="absolute left-[248px] top-[170px] flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#EAEAEA] shadow-[0_4px_10px_-2px_rgba(0,0,0,0.22)] dark:border-surface-1 dark:bg-[#262626]"
      >
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            scale: verified ? 1 : 0.9,
            opacity: verified ? 1 : 0,
          }}
          transition={{ duration: verified ? 0.24 : 0.18, ease: EASE_OUT }}
          className="absolute inset-0 rounded-full bg-invert"
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="relative z-10"
        >
          {!reduceMotion && inView && (
            <motion.g
              initial={false}
              animate={{ opacity: verified ? 0 : 1 }}
              transition={{
                duration: verified ? 0.16 : 0.2,
                delay: verified ? 0.1 : 0,
                ease: EASE_OUT,
              }}
              className="text-foreground/65 dark:text-foreground/70"
            >
              <circle
                cx="10"
                cy="10"
                r="6.25"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.2}
                strokeWidth="2"
              />
              <g className="origin-center animate-spin motion-reduce:animate-none [animation-duration:850ms] [transform-box:fill-box]">
                <motion.circle
                  cx="10"
                  cy="10"
                  r="6.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ pathLength: verified ? 1 : 0.28 }}
                  transition={{ duration: verified ? 0.22 : 0.2, ease: EASE_OUT }}
                />
              </g>
            </motion.g>
          )}
          <motion.path
            d="M5.75 10.5L8.65 13.4L14.5 7.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white dark:text-[#171717]"
            initial={false}
            animate={
              verified
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={
              verified
                ? {
                    pathLength: { duration: 0.34, ease: EASE_OUT, delay: 0.14 },
                    opacity: { duration: 0.04, delay: 0.14 },
                  }
                : {
                    pathLength: { duration: 0.16, ease: EASE_OUT },
                    opacity: { duration: 0.14, ease: EASE_OUT },
                  }
            }
          />
        </svg>
      </motion.div>

      <div className="absolute inset-x-0 top-[252px] flex flex-col items-center gap-3">
        <motion.div
          layout
          transition={SPRING}
          className="relative flex h-7 items-center gap-1.5 overflow-hidden rounded-sm border border-stroke-primary bg-card px-3 font-ui text-[12px] font-medium leading-4 text-foreground shadow-[0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2"
        >
          {!reduceMotion && !verified && on && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-foreground/35"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.4, ease: "linear", delay: 0.15 }}
            />
          )}
          <AnimatePresence initial={false} mode="popLayout">
            {verified ? (
              <motion.span
                key="verified"
                initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-success" />
                Verified
              </motion.span>
            ) : (
              <motion.span
                key="verifying"
                initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground"
              >
                <span className="size-1.5 shrink-0 animate-pulse motion-reduce:animate-none rounded-full bg-foreground/45" />
                Verifying…
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <span className="text-center font-mono text-[10px] leading-3 text-foreground/40">
          {caption}
        </span>
      </div>
    </ScaledCanvas>
  );
}

/* --------------------------------- Section --------------------------------- */

export default function GovernanceSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="governance-heading" className="contents">
        <SectionHeader
          id="governance-heading"
          anchorId="workspace"
          title="Access control and audit trail,"
          mutedTitle="built in."
        >
          Control who can see and change what, keep a timestamped record of
          every change, and take your data with you whenever you need it.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[1fr_2fr]"
        >
          <GovTile
            title="Role-based access"
            body="Admins, users and approvers each see and do only what their role allows."
          >
            <RoleBasedAccess reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Timestamped activity log"
            body="Every change is recorded with who made it and when."
          >
            <ActivityLog reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[2fr_1fr]"
        >
          <GovTile
            title="Data in, data out"
            body="Import from Excel or CSV, export to PDF or Excel. Your data is never locked in."
          >
            <DataInOut reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Single sign-on"
            body="Sign in through your company identity provider, with SAML or OIDC."
          >
            <SingleSignOn reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
