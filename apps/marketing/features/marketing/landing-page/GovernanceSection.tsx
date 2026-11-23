"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
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
  const inView = useInView(ref, { margin: "-80px" });
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || !inView) return;
    const id = setInterval(() => setTick((value) => value + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, inView, intervalMs]);

  return [ref, tick] as const;
}

function Svg({
  size,
  viewBox = "0 0 24 24",
  strokeWidth = 1.6,
  className,
  children,
}: {
  size: number;
  viewBox?: string;
  strokeWidth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      {children}
    </svg>
  );
}

function GovTile({
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
        "relative flex min-w-0 flex-col gap-7 overflow-hidden rounded-tile bg-tile pt-10",
        className,
      )}
    >
      <DotsBackdrop
        className="top-24 opacity-30"
        dotsClassName="[mask-image:radial-gradient(ellipse_76%_72%_at_50%_50%,transparent_58%,#000_78%,transparent_96%)]"
      />
      <div className="relative flex flex-col gap-1.5 px-6 sm:px-10">
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
  left: number;
  top: number;
  labelLeft: number;
  labelTop: number;
  spoke: string;
  pulseFrom: readonly [number, number];
  pulseTo: readonly [number, number];
  icon: React.ReactNode;
}[] = [
  {
    label: "Admin",
    left: 192,
    top: 24,
    labelLeft: 250,
    labelTop: 42,
    spoke: "M218 95L218 75",
    pulseFrom: [218, 98],
    pulseTo: [218, 72],
    icon: (
      <>
        <path d="M3.956 10.583L3.033 9.071C2.745 8.6 2.739 8.01 3.017 7.533L3.635 6.471C3.91 6.001 4.417 5.716 4.962 5.727L6.691 5.762C6.926 5.767 7.154 5.687 7.343 5.548C7.795 5.217 8.283 4.933 8.8 4.701C9.012 4.607 9.192 4.452 9.305 4.249L10.12 2.78C10.385 2.303 10.886 2.008 11.431 2.008H12.694C13.238 2.008 13.74 2.303 14.005 2.78L14.82 4.249C14.933 4.452 15.113 4.607 15.325 4.701C15.842 4.933 16.33 5.217 16.782 5.548C16.971 5.687 17.199 5.767 17.434 5.762L19.163 5.727C19.708 5.716 20.215 6 20.49 6.471L21.108 7.533C21.386 8.01 21.38 8.6 21.093 9.071L20.169 10.583C20.048 10.78 20.002 11.013 20.023 11.244C20.071 11.749 20.071 12.267 20.023 12.772C20.002 13.002 20.048 13.235 20.169 13.433L21.092 14.945C21.38 15.415 21.386 16.006 21.108 16.482L20.49 17.544C20.215 18.015 19.708 18.3 19.163 18.289L17.434 18.253C17.199 18.248 16.971 18.328 16.782 18.467C16.33 18.798 15.842 19.083 15.325 19.314C15.113 19.409 14.933 19.564 14.82 19.767L14.005 21.236C13.74 21.712 13.238 22.008 12.694 22.008H11.431C10.887 22.008 10.385 21.712 10.12 21.236L9.305 19.767C9.192 19.564 9.012 19.409 8.8 19.314C8.283 19.083 7.795 18.798 7.343 18.467C7.154 18.328 6.926 18.248 6.691 18.253L4.962 18.289C4.417 18.3 3.91 18.015 3.635 17.544L3.017 16.482C2.739 16.006 2.745 15.415 3.033 14.945L3.956 13.433C4.077 13.235 4.123 13.002 4.102 12.771C4.054 12.267 4.054 11.749 4.102 11.244C4.123 11.014 4.077 10.78 3.956 10.583Z" />
        <circle cx="12.063" cy="12.008" r="3.5" />
      </>
    ),
  },
  {
    label: "User",
    left: 292,
    top: 124,
    labelLeft: 350,
    labelTop: 142,
    spoke: "M273 150L293 150",
    pulseFrom: [270, 150],
    pulseTo: [296, 150],
    icon: (
      <>
        <path d="M16.425 4.605L17.415 3.615C18.235 2.795 19.565 2.795 20.385 3.615C21.205 4.435 21.205 5.765 20.385 6.585L19.395 7.575M16.425 4.605L9.766 11.264C9.258 11.772 8.898 12.408 8.724 13.104L8 16L10.896 15.276C11.592 15.102 12.228 14.742 12.736 14.234L19.395 7.575M16.425 4.605L19.395 7.575" />
        <path d="M19 13.5C19 16.788 19 18.431 18.092 19.538C17.926 19.74 17.74 19.926 17.538 20.092C16.431 21 14.787 21 11.5 21H11C7.229 21 5.343 21 4.172 19.828C3 18.657 3 16.771 3 13V12.5C3 9.213 3 7.569 3.908 6.462C4.074 6.26 4.26 6.074 4.462 5.908C5.569 5 7.213 5 10.5 5" />
      </>
    ),
  },
  {
    label: "Approver",
    left: 192,
    top: 224,
    labelLeft: 250,
    labelTop: 242,
    spoke: "M218 205L218 225",
    pulseFrom: [218, 202],
    pulseTo: [218, 228],
    icon: (
      <>
        <path d="M18.991 19H19M18.991 19C18.368 19.617 17.239 19.464 16.448 19.464C15.476 19.464 15.009 19.654 14.315 20.347C13.725 20.937 12.934 22 12 22C11.066 22 10.275 20.937 9.685 20.347C8.991 19.654 8.523 19.464 7.552 19.464C6.761 19.464 5.632 19.617 5.009 19C4.382 18.378 4.536 17.244 4.536 16.448C4.536 15.441 4.316 14.979 3.599 14.262C2.533 13.196 2 12.662 2 12C2 11.338 2.533 10.804 3.599 9.738C4.239 9.098 4.536 8.464 4.536 7.552C4.536 6.761 4.382 5.632 5 5.009C5.622 4.382 6.756 4.536 7.552 4.536C8.464 4.536 9.098 4.239 9.738 3.599C10.804 2.533 11.338 2 12 2C12.662 2 13.196 2.533 14.262 3.599C14.902 4.239 15.536 4.536 16.448 4.536C17.239 4.536 18.368 4.382 18.991 5C19.618 5.622 19.464 6.756 19.464 7.552C19.464 8.559 19.684 9.021 20.401 9.738C21.467 10.804 22 11.338 22 12C22 12.662 21.467 13.196 20.401 14.262C19.684 14.979 19.464 15.441 19.464 16.448C19.464 17.244 19.618 18.378 18.991 19Z" />
        <path d="M9 12.893C9 12.893 10.2 13.545 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" />
      </>
    ),
  },
  {
    label: "Manager",
    left: 92,
    top: 124,
    labelLeft: 36,
    labelTop: 142,
    spoke: "M163 150L143 150",
    pulseFrom: [166, 150],
    pulseTo: [140, 150],
    icon: (
      <>
        <path d="M11.995 13.566L11 13.5C10.645 13.51 10.313 13.523 10.001 13.538C6.3 13.719 3.284 16.806 3 20.5" />
        <circle cx="11" cy="6.5" r="4" />
        <path d="M21 17.47V16.24C21 15.668 20.548 15.212 20.006 15.105C19.432 14.993 18.947 14.802 18.597 14.634C18.225 14.455 17.775 14.455 17.403 14.634C17.053 14.802 16.568 14.993 15.994 15.105C15.452 15.212 15 15.668 15 16.24V17.47C15 20.05 16.986 21.131 17.726 21.444C17.903 21.519 18.097 21.519 18.274 21.444C19.014 21.131 21 20.05 21 17.47Z" />
      </>
    ),
  },
];

const PULSE_EASE = [0.45, 0, 0.25, 1] as const;

function RoleBasedAccess({ reduceMotion }: { reduceMotion: boolean }) {
  const [hovered, setHovered] = React.useState<number | null>(null);
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
          <Svg size={36} strokeWidth={1.5} className="text-foreground">
            <path d="M18.709 3.495C16.817 2.554 14.501 2 12 2C9.499 2 7.184 2.554 5.291 3.495C4.363 3.957 3.899 4.188 3.45 4.914C3 5.64 3 6.342 3 7.748V11.237C3 16.921 7.542 20.08 10.173 21.434C10.907 21.811 11.274 22 12 22C12.726 22 13.093 21.811 13.827 21.434C16.458 20.08 21 16.921 21 11.237L21 7.748C21 6.342 21 5.64 20.55 4.914C20.101 4.188 19.637 3.957 18.709 3.495Z" />
            <path d="M9 11.5C9 11.5 10.408 11.752 11 13.5C11 13.5 12.5 10.5 15 9.5" />
          </Svg>
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
                  <Svg size={18} strokeWidth={1.6}>
                    {role.icon}
                  </Svg>
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

      <div className="absolute left-[162px] top-[292px] flex h-7 items-center gap-1.5 rounded-sm border border-stroke-primary bg-card px-3 font-ui text-[12px] font-medium leading-4 text-foreground shadow-[0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2">
        Access by role
      </div>
    </ScaledCanvas>
  );
}

/* ------------------------ Timestamped activity log ------------------------ */

const LOG_SOURCES: { label: string; top: number; y: number; path: string; icon: React.ReactNode }[] = [
  {
    label: "Products",
    top: 43,
    y: 69,
    path: "M162 69C236 69 244 159 330 159",
    icon: (
      <>
        <path d="M12 19C12.209 19 12.404 18.901 12.793 18.703L15.923 17.113C17.308 16.409 18 16.057 18 15.5V8.5M12 19C11.791 19 11.596 18.901 11.207 18.703L8.077 17.113C6.692 16.409 6 16.057 6 15.5V8.5M12 19V12M6 8.5C6 9.057 6.692 9.409 8.077 10.113L11.207 11.703C11.596 11.901 11.791 12 12 12C12.209 12 12.404 11.901 12.793 11.703L15.923 10.113C17.308 9.409 18 9.057 18 8.5C18 7.943 17.308 7.591 15.923 6.887L12.793 5.297C12.404 5.099 12.209 5 12 5C11.791 5 11.596 5.099 11.207 5.297L8.077 6.887C6.692 7.591 6 7.943 6 8.5Z" />
        <path d="M13.19 21.576L17.884 19.304C19.961 18.299 21 17.796 21 17V7C21 6.204 19.961 5.701 17.884 4.696L13.19 2.424L13.19 2.424C12.606 2.141 12.314 2 12 2C11.686 2 11.394 2.141 10.81 2.424L6.116 4.696C4.039 5.701 3 6.204 3 7V17C3 17.796 4.039 18.299 6.116 19.304L6.116 19.304L10.81 21.576C11.394 21.859 11.686 22 12 22C12.314 22 12.606 21.859 13.19 21.576Z" />
      </>
    ),
  },
  {
    label: "Workflows",
    top: 133,
    y: 159,
    path: "M162 159H330",
    icon: (
      <>
        <path d="M18.991 19H19M18.991 19C18.368 19.617 17.239 19.464 16.448 19.464C15.476 19.464 15.009 19.654 14.315 20.347C13.725 20.937 12.934 22 12 22C11.066 22 10.275 20.937 9.685 20.347C8.991 19.654 8.523 19.464 7.552 19.464C6.761 19.464 5.632 19.617 5.009 19C4.382 18.378 4.536 17.244 4.536 16.448C4.536 15.441 4.316 14.979 3.599 14.262C2.533 13.196 2 12.662 2 12C2 11.338 2.533 10.804 3.599 9.738C4.239 9.098 4.536 8.464 4.536 7.552C4.536 6.761 4.382 5.632 5 5.009C5.622 4.382 6.756 4.536 7.552 4.536C8.464 4.536 9.098 4.239 9.738 3.599C10.804 2.533 11.338 2 12 2C12.662 2 13.196 2.533 14.262 3.599C14.902 4.239 15.536 4.536 16.448 4.536C17.239 4.536 18.368 4.382 18.991 5C19.618 5.622 19.464 6.756 19.464 7.552C19.464 8.559 19.684 9.021 20.401 9.738C21.467 10.804 22 11.338 22 12C22 12.662 21.467 13.196 20.401 14.262C19.684 14.979 19.464 15.441 19.464 16.448C19.464 17.244 19.618 18.378 18.991 19Z" />
        <path d="M9 12.893C9 12.893 10.2 13.545 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" />
      </>
    ),
  },
  {
    label: "Team",
    top: 223,
    y: 249,
    path: "M162 249C236 249 244 159 330 159",
    icon: (
      <>
        <path d="M16 21C15.767 18.069 13.342 15.748 10.309 15.552L9.5 15.5C9.211 15.508 8.942 15.518 8.688 15.53C5.681 15.672 3.231 18.097 3 21" />
        <path d="M12.75 9.75C12.75 11.545 11.295 13 9.5 13C7.705 13 6.25 11.545 6.25 9.75C6.25 7.955 7.705 6.5 9.5 6.5C11.295 6.5 12.75 7.955 12.75 9.75Z" />
        <path d="M21 17.501C20.771 14.631 18.454 12.275 15.5 11.996" />
        <path d="M15.988 9C16.896 8.424 17.5 7.408 17.5 6.25C17.5 4.455 16.05 3 14.26 3C13.381 3 12.584 3.351 12 3.921" />
      </>
    ),
  },
];

const LOG_ENTRIES: {
  time: string;
  tag: string;
  tone: "success" | "info" | "neutral";
  text: string;
  source: number;
}[] = [
  { time: "10:42:08", tag: "RELEASED", tone: "success", text: "IV Extension Set v5 released", source: 0 },
  { time: "10:31:55", tag: "APPROVED", tone: "info", text: "Ravi K. approved review round 2", source: 1 },
  { time: "10:12:40", tag: "EDITED", tone: "neutral", text: "Shelf life changed from 3 to 5 years", source: 0 },
  { time: "09:58:17", tag: "IMPORTED", tone: "neutral", text: "48 rows from PX-2042_specs.xlsx", source: 0 },
  { time: "09:41:02", tag: "INVITED", tone: "neutral", text: "Marta L. invited as Approver", source: 2 },
];

const LOG_BADGE = {
  success:
    "border-[#22C55E33] bg-success-soft text-success-strong dark:border-[#34D39944] dark:bg-success-soft dark:text-success",
  info: "border-[#3B82F633] bg-info-soft text-info-strong dark:border-[#60A5FA44] dark:bg-info-soft dark:text-diff-added",
  neutral:
    "border-stroke-primary bg-muted text-muted-foreground dark:border-edge-2 dark:bg-surface-3 dark:text-muted-foreground",
};

function ActivityLog({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on] = usePlayback(reduceMotion, 8500);

  return (
    <ScaledCanvas
      ref={ref}
      width={873}
      height={340}
      className="[mask-image:linear-gradient(#000_85%,transparent_100%)]"
    >
      <div className="relative ml-[30px] h-[340px] w-[873px]">
        <svg
          width="873"
          height="340"
          viewBox="0 0 873 340"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {LOG_SOURCES.map((source, index) => (
            <g key={source.label}>
              <path
                d={source.path}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.22}
                strokeWidth="1.2"
                strokeDasharray="3 4"
              />
              {!reduceMotion && on && (
                <g opacity="0">
                  <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2" fill="currentColor" />
                  <animateMotion
                    path={source.path}
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
              d={`M162 ${source.y - 3.25}A3.25 3.25 0 0 1 162 ${source.y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/40 dark:fill-surface-2"
            />
          ))}
          <path
            d="M330 155.75A3.25 3.25 0 0 0 330 162.25"
            strokeWidth="1.2"
            className="fill-card stroke-foreground/40 dark:fill-surface-2"
          />
        </svg>

        {LOG_SOURCES.map((source) => (
          <div
            key={source.label}
            className="absolute left-[110px] flex flex-col items-center gap-1.5"
            style={{ top: source.top }}
          >
            <div className="size-[52px] rounded-[14px] border border-foreground/5 bg-[#F5F5F5BF] p-[3px] dark:border-separator dark:bg-[#1A1A1ABF]">
              <div className="flex size-full items-center justify-center rounded-[11px] bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]">
                <Svg size={18} strokeWidth={1.6} className="text-foreground">
                  {source.icon}
                </Svg>
              </div>
            </div>
            <span className="font-ui text-[11px] leading-[14px] text-placeholder">
              {source.label}
            </span>
          </div>
        ))}

        <div className="absolute left-[330px] top-6 w-[480px] rounded-2xl border border-foreground/5 bg-[#F5F5F5BF] p-[5px] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.18)] dark:border-separator dark:bg-[#1A1A1ABF]">
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
                    "flex h-10 shrink-0 items-center gap-3 px-4",
                    index < LOG_ENTRIES.length - 1 && "border-b border-separator dark:border-edge-1",
                  )}
                >
                  <span className="font-mono text-[12px] leading-4 text-placeholder">
                    {entry.time}
                  </span>
                  <span className="flex w-[72px] shrink-0">
                    <span
                      className={cn(
                        "flex h-5 items-center rounded-[5px] border px-1.5 font-mono text-[10px] leading-3",
                        LOG_BADGE[entry.tone],
                      )}
                    >
                      {entry.tag}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-ui text-[13px] leading-4 text-foreground">
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
      width={873}
      height={340}
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

      <div className="absolute left-[276px] top-[72px] w-80 rounded-[20px] border border-foreground/5 bg-[#F5F5F5BF] p-1.5 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.25)] dark:border-separator dark:bg-[#1A1A1ABF]">
        <div className="flex gap-2 rounded-[15px] bg-[#EEEEEE] p-1.5 shadow-[inset_0_0_0_1px_rgba(23,23,23,0.04)] dark:bg-[#1E1E1E] dark:shadow-[inset_0_0_0_1px_rgba(237,237,237,0.04)]">
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
              <span className="font-mono text-[9px] leading-3 text-foreground/40">UPREVIT</span>
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
              {
                label: "Products",
                icon: (
                  <>
                    <path d="M12 19C12.209 19 12.404 18.901 12.793 18.703L15.923 17.113C17.308 16.409 18 16.057 18 15.5V8.5M12 19C11.791 19 11.596 18.901 11.207 18.703L8.077 17.113C6.692 16.409 6 16.057 6 15.5V8.5M12 19V12M6 8.5C6 9.057 6.692 9.409 8.077 10.113L11.207 11.703C11.596 11.901 11.791 12 12 12C12.209 12 12.404 11.901 12.793 11.703L15.923 10.113C17.308 9.409 18 9.057 18 8.5C18 7.943 17.308 7.591 15.923 6.887L12.793 5.297C12.404 5.099 12.209 5 12 5C11.791 5 11.596 5.099 11.207 5.297L8.077 6.887C6.692 7.591 6 7.943 6 8.5Z" />
                    <path d="M13.19 21.576L17.884 19.304C19.961 18.299 21 17.796 21 17V7C21 6.204 19.961 5.701 17.884 4.696L13.19 2.424L13.19 2.424C12.606 2.141 12.314 2 12 2C11.686 2 11.394 2.141 10.81 2.424L6.116 4.696C4.039 5.701 3 6.204 3 7V17C3 17.796 4.039 18.299 6.116 19.304L6.116 19.304L10.81 21.576C11.394 21.859 11.686 22 12 22C12.314 22 12.606 21.859 13.19 21.576Z" />
                  </>
                ),
              },
              {
                label: "Labels",
                icon: (
                  <>
                    <path d="M8 2H9.015C10.241 2 10.854 2 11.405 2.228C11.957 2.457 12.39 2.89 13.257 3.757L21.126 11.626C21.684 12.187 21.998 12.945 22 13.736L22 13.75L22 13.764C21.998 14.555 21.684 15.313 21.126 15.874L15.874 21.126C15.313 21.684 14.555 21.998 13.764 22L13.75 22L13.736 22C12.945 21.998 12.187 21.684 11.626 21.126L3.757 13.257C2.89 12.39 2.457 11.957 2.228 11.405C2 10.854 2 10.241 2 9.015V8C2 5.172 2 3.757 2.879 2.879C3.757 2 5.172 2 8 2Z" />
                    <path d="M7.5 7.25V7.5M8 7.5C8 7.776 7.776 8 7.5 8C7.224 8 7 7.776 7 7.5C7 7.224 7.224 7 7.5 7C7.776 7 8 7.224 8 7.5Z" />
                  </>
                ),
              },
            ].map((card) => (
              <div
                key={card.label}
                className="flex h-[86px] w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]"
              >
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-muted shadow-[inset_0_0_0_1px_var(--stroke-primary)] dark:bg-surface-3 dark:shadow-[inset_0_0_0_1px_var(--edge-2)]">
                  <Svg size={16} strokeWidth={1.6} className="text-foreground">
                    {card.icon}
                  </Svg>
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
            {!reduceMotion && on && (
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

const FINGERPRINT_PATHS = (
  <>
    <path d="M7.429 3.362C11.4 0.664 17.136 2.124 19.23 6.418M10.857 21.924C15.584 22.582 20 18.895 20 14.21V10.333M7.429 20.606C5.356 19.198 4 16.858 4 14.21V9.758C4 8.573 4.271 7.45 4.757 6.444" />
    <path d="M16 13.8C16 16.12 14.209 18 12 18C9.791 18 8 16.12 8 13.8V10.2C8 9.556 8.138 8.946 8.385 8.4M12 6C14.209 6 16 7.88 16 10.2" />
    <path d="M12 10.5L12 13.5" />
  </>
);

function SingleSignOn({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on] = usePlayback(reduceMotion, 7600);
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
          <Svg
            size={52}
            strokeWidth={1.4}
            className={cn(
              "transition-colors duration-500 ease-out",
              verified ? "text-foreground/75" : "text-foreground/30",
            )}
          >
            {FINGERPRINT_PATHS}
          </Svg>
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
        transition={{ type: "spring", duration: 0.45, bounce: 0.24 }}
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
          className="absolute inset-0 rounded-full bg-[#1A1A1A] dark:bg-[#EDEDED]"
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="relative z-10"
        >
          {!reduceMotion && (
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
              <g className="origin-center animate-spin [animation-duration:850ms] [transform-box:fill-box]">
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
                <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-foreground/45" />
                Verifying…
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <span className="text-center font-mono text-[10px] leading-3 text-foreground/40">
          SAML or OIDC
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
      <section id="workspace" aria-labelledby="governance-heading" className="contents">
        <SectionHeader
          id="governance-heading"
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
