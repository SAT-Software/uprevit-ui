"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  ArchiveIcon,
  ArrowLeft01Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  Bookmark01Icon,
  BubbleChatIcon,
  CheckmarkBadge01Icon,
  DashboardSquare01Icon,
  FileEditIcon,
  Folder02Icon,
  GitBranchIcon,
  GridTableIcon,
  Image01Icon,
  PencilEdit02Icon,
  Search01Icon,
  SentIcon,
  SquareLock02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconProps } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "./DotsBackdrop";
import { DottedConnector } from "./DottedConnector";
import { ScaledCanvas } from "./ScaledCanvas";
import { SectionHeader } from "./SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.45, bounce: 0 };

const FRAME = "border border-foreground/5 bg-[#F5F5F5BF] dark:bg-surface-1/75";
const CARD =
  "border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2";

type StepState = "idle" | "active" | "done";

const STEP_TRANSITION = "transition-[background-color,border-color,box-shadow,color] duration-500";

function stepTone(state: StepState) {
  const active = state === "active";
  return {
    frame: cn(
      "rounded-2xl border p-1",
      STEP_TRANSITION,
      active ? "border-border bg-surface-selected delay-200 dark:border-edge-2" : FRAME,
    ),
    card: cn(
      "border",
      STEP_TRANSITION,
      active
        ? "border-white/10 bg-[#1A1A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_16px_-8px_rgba(0,0,0,0.3)] delay-200 dark:border-white/15 dark:bg-[#2E2E2E]"
        : "border-border bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0),0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2",
    ),
    icon: cn(
      "flex shrink-0 items-center justify-center border",
      STEP_TRANSITION,
      active
        ? "border-white/[0.12] bg-white/[0.08] text-white delay-200"
        : cn(
            "border-border bg-muted dark:border-edge-2 dark:bg-surface-3",
            state === "done" ? "text-foreground" : "text-foreground/30",
          ),
    ),
    title: cn(STEP_TRANSITION, active ? "text-white delay-200" : "text-foreground"),
    meta: cn(STEP_TRANSITION, active ? "text-white/60 delay-200" : "text-muted-foreground"),
  };
}

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
  strokeWidth = 1.8,
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

function GuideLine({
  orientation,
  style,
  className,
}: {
  orientation: "h" | "v";
  style: React.CSSProperties;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute",
        orientation === "v"
          ? "w-0 border-l border-dashed [mask-image:linear-gradient(transparent,#000_22%,#000_78%,transparent)]"
          : "h-0 border-t border-dashed [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]",
        className ?? "border-stroke-strong",
      )}
      style={style}
    />
  );
}

function FeatureCopy({ title, body, maxWidth }: { title: string; body: string; maxWidth: number }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 sm:px-8 lg:px-10">
      <h3 className="font-ui text-[16px] font-medium leading-[22px] text-foreground">{title}</h3>
      <p className="font-ui text-[14px] leading-[22px] text-muted-foreground" style={{ maxWidth }}>
        {body}
      </p>
    </div>
  );
}

function FeatureTile({
  id,
  title,
  body,
  maxWidth,
  dotsClassName,
  className,
  children,
}: {
  id?: string;
  title: string;
  body: string;
  maxWidth: number;
  dotsClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className={cn(
        "relative flex min-w-0 flex-col gap-5 overflow-hidden rounded-tile bg-tile pt-6 sm:gap-8 sm:pt-10",
        id && "scroll-mt-14",
        className,
      )}
    >
      <DotsBackdrop
        className="top-24 opacity-30"
        dotsClassName={
          dotsClassName ??
          "[mask-image:radial-gradient(ellipse_76%_72%_at_50%_50%,transparent_58%,#000_78%,transparent_96%)]"
        }
      />
      <FeatureCopy title={title} body={body} maxWidth={maxWidth} />
      {children}
    </article>
  );
}

/* ----------------------------- Review cycles ----------------------------- */

const REVIEW_NODES: { title: string; meta: string; left: number; icon: IconProps["icon"] }[] = [
  { title: "Change request", meta: "CR-0142 · EU MDR", left: 101, icon: FileEditIcon },
  { title: "Review round 1", meta: "14 comments", left: 323, icon: BubbleChatIcon },
  { title: "Revisions", meta: "14 of 14 resolved", left: 545, icon: PencilEdit02Icon },
  { title: "Review round 2", meta: "3 of 3 approved", left: 767, icon: BubbleChatIcon },
];
const REVIEW_APPROVED = { title: "Approved", meta: "Ready for release", icon: CheckmarkBadge01Icon };
const REVIEW_HOLD = 3;
const REVIEW_LINKS = [
  [287, 323],
  [509, 545],
  [731, 767],
];
const BRANCH_YES = "M956.25 190C989 190 989 234 1019.75 234";

const REVIEW_PAN_X = [193, 415, 637, 859, 1020];

function ReviewCycles({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, tick] = useTicker(1400, !reduceMotion);
  const cycle = REVIEW_NODES.length + 1 + REVIEW_HOLD;
  const step = reduceMotion ? REVIEW_NODES.length : Math.min(tick % cycle, REVIEW_NODES.length);
  const approved = step >= REVIEW_NODES.length;

  return (
    <ScaledCanvas
      ref={ref}
      width={1310}
      height={380}
      minScale={0.68}
      panX={REVIEW_PAN_X[step]}
      panBelow={890}
      className="[mask-image:linear-gradient(#000_82%,transparent_100%)]"
    >
      <div
        aria-hidden="true"
        className="absolute left-[630px] top-[-40px] size-[460px] rounded-full bg-[radial-gradient(circle,rgba(23,23,23,0.11)_0%,rgba(23,23,23,0.04)_38%,transparent_66%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.025)_38%,transparent_66%)]"
      />
      {[194, 416, 638, 860, 1116].map((x) => (
        <GuideLine key={x} orientation="v" style={{ left: x, top: 0, height: 380 }} />
      ))}
      {[147, 233].map((y) => (
        <GuideLine key={y} orientation="h" style={{ left: 30, top: y, width: 963 }} />
      ))}


      {[...REVIEW_NODES, { ...REVIEW_APPROVED, left: 1023 }].map((node, index) => {
        const isApproval = index === REVIEW_NODES.length;
        const state: StepState = isApproval
          ? approved
            ? "active"
            : "idle"
          : approved || index < step
            ? "done"
            : index === step
              ? "active"
              : "idle";
        const tone = stepTone(state);
        return (
          <div key={node.title} className={cn("absolute", tone.frame)} style={{ left: node.left, top: isApproval ? 203 : 159 }}>
            <div className={cn("flex h-[52px] w-44 items-center gap-2.5 rounded-xl pl-2 pr-3", tone.card)}>
              <span className={cn("size-[34px] rounded-[9px]", tone.icon)}>
                <Icon icon={node.icon} size={16} strokeWidth={1.8} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className={cn("whitespace-nowrap font-ui text-[13px] font-semibold leading-[17px]", tone.title)}>{node.title}</span>
                <span className={cn("whitespace-nowrap font-ui text-[11px] leading-[14px]", tone.meta)}>{node.meta}</span>
              </span>
            </div>
          </div>
        );
      })}

      <div className={cn("absolute left-[1023px] top-[115px] opacity-45", stepTone("idle").frame)}>
        <div className={cn("flex h-[52px] w-44 items-center gap-2.5 rounded-xl pl-2 pr-3", stepTone("idle").card)}>
          <span className={cn("size-[34px] rounded-[9px]", stepTone("idle").icon)}>
            <Icon icon={ArrowReloadHorizontalIcon} size={16} strokeWidth={1.8} />
          </span>
          <span className="flex flex-col">
            <span className="font-ui text-[13px] font-semibold leading-[17px] text-foreground">Rejected</span>
            <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">Back to author</span>
          </span>
        </div>
      </div>

      <svg width="1310" height="380" viewBox="0 0 1310 380" aria-hidden="true" className="pointer-events-none absolute inset-0 text-foreground">
        {REVIEW_LINKS.map(([from, to], index) => (
          <g key={from}>
            <DottedConnector
              d={`M${from + 3.25} 190H${to - 3.25}`}
              active={step > index}
              canvasWidth={1310}
              canvasHeight={380}
              transition={{ duration: step > index ? 0.5 : 0.3, ease: [0.645, 0.045, 0.355, 1] }}
            />
            {step === index + 1 && !reduceMotion && (
              <motion.circle
                key={tick}
                cy="190"
                r="2"
                className="fill-foreground"
                initial={{ cx: from, opacity: 0 }}
                animate={{ cx: to, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.55, ease: [0.645, 0.045, 0.355, 1] }}
              />
            )}
          </g>
        ))}
        <path
          d={`M956.25 190C989 190 989 146 1019.75 146`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="3 4"
        />
        <DottedConnector
          d={BRANCH_YES}
          active={approved}
          canvasWidth={1310}
          canvasHeight={380}
          transition={{ duration: approved ? 0.55 : 0.3, ease: [0.645, 0.045, 0.355, 1] }}
        />
        {[287, 509, 731, 953].map((x) => (
          <path key={x} d={`M${x} 186.75A3.25 3.25 0 0 1 ${x} 193.25`} strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
        ))}
        {[
          [323, 190],
          [545, 190],
          [767, 190],
          [1023, 146],
          [1023, 234],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y - 3.25}A3.25 3.25 0 0 0 ${x} ${y + 3.25}`} strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
        ))}
      </svg>

      <span className="absolute left-[976px] top-[156px] flex h-[18px] items-center rounded-tile border border-border bg-card px-[7px] font-ui text-[10px] font-semibold leading-3 text-faint-foreground dark:border-edge-2 dark:bg-surface-2">
        No
      </span>
      <span
        className={cn(
          "absolute left-[974px] top-[206px] flex h-[18px] items-center rounded-tile px-[7px] font-ui text-[10px] font-semibold leading-3 transition-colors duration-500",
          approved ? "bg-foreground text-background delay-300" : "border border-border bg-card text-faint-foreground dark:border-edge-2 dark:bg-surface-2",
        )}
      >
        Yes
      </span>
    </ScaledCanvas>
  );
}

/* ------------------------------ Symbol library ----------------------------- */

export interface LibrarySymbol {
  code: string;
  label: string;
  left: number;
  top: number;
  bg: string;
  ink: string;
  ring: string;
  glyph?: React.ReactNode;
  icon?: React.ReactNode;
}

const SYMBOLS: LibrarySymbol[] = [
  {
    code: "5.1.1",
    label: "Manufacturer",
    left: 72,
    top: 80,
    bg: "bg-[#DCE8FF] dark:bg-[#111B36]",
    ink: "text-[#1D4ED8] dark:text-[#7DB4FF]",
    ring: "#155EEF1F",
    glyph: <path d="M3 16V8l4 3V8l4 3V4h3v12z" />,
  },
  {
    code: "5.1.4",
    label: "Use-by date",
    left: 180,
    top: 80,
    bg: "bg-[#FBDDE0] dark:bg-[#301111]",
    ink: "text-[#B91C1C] dark:text-[#FF8A8A]",
    ring: "#E7000B1A",
    glyph: <path d="M4 2h10M4 16h10M5 2c0 4 4 5 4 7s-4 3-4 7M13 2c0 4-4 5-4 7s4 3 4 7" />,
  },
  {
    code: "5.3.7",
    label: "Temperature limit",
    left: 288,
    top: 80,
    bg: "bg-[#D3F2E4] dark:bg-[#0C231D]",
    ink: "text-[#047857] dark:text-[#5EE38D]",
    ring: "#0596691F",
    glyph: (
      <>
        <path d="M6.5 3a1.5 1.5 0 0 1 3 0v8.4a3 3 0 1 1-3 0z" />
        <path d="M11.5 4h3M11.5 7h3M11.5 10h3" />
      </>
    ),
  },
  {
    code: "5.1.6",
    label: "Catalogue number",
    left: 72,
    top: 190,
    bg: "bg-[#D5EEF5] dark:bg-[#0E2228]",
    ink: "text-[#0E7490] dark:text-[#67D4EC]",
    ring: "#0E74901F",
    glyph: (
      <>
        <rect x="1" y="3" width="16" height="12" rx="1.5" />
        <path d="M4 7h10M4 11h6" />
      </>
    ),
  },
  {
    code: "5.2.4",
    label: "Sterilized using irradiation",
    left: 180,
    top: 190,
    bg: "bg-[#E9DEFF] dark:bg-[#25123E]",
    ink: "text-[#6A12DC] dark:text-[#C49EFF]",
    ring: "#7F22FE1F",
    glyph: (
      <>
        <rect x="1.5" y="4" width="15" height="10" rx="1.2" />
        <path d="M7.2 6.5v5M7.2 6.5h2.3a1.4 1.4 0 0 1 0 2.8H7.2M9.4 9.3l1.8 2.2" />
      </>
    ),
  },
  {
    code: "5.4.2",
    label: "Do not re-use",
    left: 288,
    top: 190,
    bg: "bg-[#ECECEC] dark:bg-[#262626]",
    ink: "text-[#171717] dark:text-[#EDEDED]",
    ring: "#1717171A",
    glyph: (
      <>
        <circle cx="9" cy="9" r="6.5" />
        <path d="M5 13l8-8" />
      </>
    ),
  },
];

export function SymbolLibrary({
  reduceMotion,
  symbols = SYMBOLS,
  activeClassName,
}: {
  reduceMotion: boolean;
  symbols?: LibrarySymbol[];
  activeClassName?: string;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [ref, tick] = useTicker(2200, !reduceMotion && hovered === null);
  const [base, setBase] = React.useState(4);
  const auto = (base + tick) % symbols.length;
  const active = hovered ?? auto;
  const symbol = symbols[active];
  const below = symbol.top > 100;

  return (
    <ScaledCanvas ref={ref} width={436} height={360} className="[mask-image:linear-gradient(#000_82%,transparent_100%)]">
      {[118, 228].map((y) => (
        <GuideLine key={y} orientation="h" style={{ left: 0, top: y, width: 436 }} className="border-foreground/15" />
      ))}
      {[110, 218, 326].map((x) => (
        <GuideLine key={x} orientation="v" style={{ left: x, top: 10, height: 320 }} className="border-foreground/15" />
      ))}

      {symbols.map((item, index) => (
        <motion.button
          key={item.code}
          type="button"
          aria-label={`${item.code} ${item.label}`}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => {
            setHovered(null);
            setBase((current) => current + index - ((current + tick) % symbols.length));
          }}
          onFocus={() => setHovered(index)}
          onBlur={() => setHovered(null)}
          animate={{ scale: index === active ? 1.04 : 1 }}
          transition={SPRING}
          className={cn(
            "absolute flex size-[76px] cursor-default items-center justify-center rounded-full border-[3px] border-white outline-none transition-[background-color,color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-ring dark:border-surface-2",
            index === active && activeClassName ? activeClassName : cn(item.bg, item.ink),
          )}
          style={{
            left: item.left,
            top: item.top,
            boxShadow: `0 0 0 1px rgba(23,23,23,0.05), 0 6px 14px -4px rgba(0,0,0,0.12)${index === active ? `, 0 0 0 7px ${item.ring}` : ""}`,
          }}
        >
          {item.icon ?? (
            <Svg size={30} viewBox="0 0 18 18" strokeWidth={1.4}>
              {item.glyph}
            </Svg>
          )}
        </motion.button>
      ))}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 flex w-56 flex-col items-center"
        initial={false}
        animate={{ x: symbol.left + 38 - 112, y: below ? symbol.top + 88 : symbol.top - 44 }}
        transition={SPRING}
      >
        {below && (
          <svg width="12" height="6" viewBox="0 0 12 6" className="text-tooltip">
            <path d="M0 6L6 0L12 6z" fill="currentColor" />
          </svg>
        )}
        <span className="flex h-[30px] shrink-0 items-center gap-2 rounded-md bg-tooltip px-2.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={symbol.code}
              className="flex items-center gap-2 whitespace-nowrap"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <span className="font-mono text-[10px] leading-3 text-white/60">{symbol.code}</span>
              <span className="font-ui text-[12px] font-medium leading-4 text-tooltip-foreground">{symbol.label}</span>
            </motion.span>
          </AnimatePresence>
        </span>
        {!below && (
          <svg width="12" height="6" viewBox="0 0 12 6" className="rotate-180 text-tooltip">
            <path d="M0 6L6 0L12 6z" fill="currentColor" />
          </svg>
        )}
      </motion.div>
    </ScaledCanvas>
  );
}

/* ------------------------------ Version control ---------------------------- */

function VersionTag({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <span
      className="absolute flex h-[18px] items-center rounded-[5px] border border-border bg-muted px-1.5 font-mono text-[10px] leading-3 text-muted-foreground dark:border-edge-2 dark:bg-surface-3"
      style={style}
    >
      {children}
    </span>
  );
}

function BranchLabel({
  children,
  color,
  style,
  show,
}: {
  children: React.ReactNode;
  color: string;
  style: React.CSSProperties;
  show: boolean;
}) {
  return (
    <motion.span
      initial={false}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 4 }}
      transition={{ ...SPRING, delay: show ? 0.35 : 0 }}
      className={cn("absolute flex h-[22px] origin-bottom-left items-center gap-[5px] rounded-sm px-2 font-ui text-[11px] font-medium leading-[14px] text-foreground", CARD)}
      style={style}
    >
      <Icon icon={GitBranchIcon} size={11} strokeWidth={2} className={cn("shrink-0", color)} />
      {children}
    </motion.span>
  );
}

const HISTORY_EASE = [0.645, 0.045, 0.355, 1] as const;
const HISTORY_CYCLE = 7;
const HISTORY_SEGMENTS = [
  { d: "M81 262H191", className: "stroke-foreground" },
  { d: "M191 262C231 262 227 182 261 182H401C435 182 431 262 471 262", className: "stroke-primary" },
  { d: "M471 262C511 262 507 102 541 102H681", className: "stroke-info" },
];
const HISTORY_DOTS: [number, number, string, number][] = [
  [121, 262, "fill-foreground", 1],
  [191, 262, "fill-foreground", 1],
  [261, 182, "fill-primary", 2],
  [331, 182, "fill-primary", 2],
  [401, 182, "fill-primary", 2],
  [541, 102, "fill-info", 3],
  [611, 102, "fill-info", 3],
  [681, 102, "fill-info", 3],
  [751, 262, "fill-foreground", 4],
];

const HISTORY_PAN_X = [240, 240, 360, 560, 620];

function RevisionHistory({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, tick] = useTicker(1300, !reduceMotion);
  const stage = reduceMotion ? 4 : tick % HISTORY_CYCLE;
  const panIndex = Math.min(stage, HISTORY_PAN_X.length - 1);

  return (
    <ScaledCanvas
      ref={ref}
      aria-hidden="true"
      width={873}
      height={360}
      minScale={0.6}
      panX={HISTORY_PAN_X[panIndex]}
      panBelow={640}
      className="[mask-image:linear-gradient(#000_82%,transparent_100%)]"
    >
      {[121, 191, 261, 331, 401, 471, 541, 611, 681, 751].map((x) => (
        <GuideLine key={x} orientation="v" style={{ left: x, top: 30, height: 300 }} className="border-foreground/[0.07]" />
      ))}
      {[102, 182].map((y) => (
        <GuideLine key={y} orientation="h" style={{ left: 20, top: y, width: 833 }} className="border-foreground/[0.07]" />
      ))}

      <svg width="873" height="360" viewBox="0 0 873 360" aria-hidden="true" className="absolute inset-0 text-foreground">
        <path d="M81 262H751" stroke="currentColor" strokeOpacity={0.2} strokeWidth="1.5" />
        {HISTORY_SEGMENTS.slice(1).map((segment) => (
          <path key={segment.d} d={segment.d} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="1.5" />
        ))}
        <path d="M681 102H751" fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth="1.5" strokeDasharray="3 4" />
        {HISTORY_SEGMENTS.map((segment, index) => (
          <motion.path
            key={segment.d}
            d={segment.d}
            fill="none"
            strokeWidth="1.5"
            className={segment.className}
            initial={false}
            animate={{ pathLength: stage > index ? 1 : 0, opacity: stage > index ? 1 : 0 }}
            transition={
              stage > index
                ? { pathLength: { duration: index ? 0.9 : 0.6, ease: HISTORY_EASE }, opacity: { duration: 0.1 } }
                : { duration: 0.35, ease: EASE_OUT }
            }
          />
        ))}
        <mask id="history-draft" maskUnits="userSpaceOnUse" x={0} y={0} width={873} height={360}>
          <motion.path
            d="M681 102H751"
            stroke="#fff"
            strokeWidth="4"
            initial={false}
            animate={{ pathLength: stage >= 4 ? 1 : 0 }}
            transition={{ duration: stage >= 4 ? 0.5 : 0.35, ease: HISTORY_EASE }}
          />
        </mask>
        <path d="M681 102H751" fill="none" strokeWidth="1.5" strokeDasharray="3 4" className="stroke-stage-draft" mask="url(#history-draft)" />
        {[121, 191, 261, 331, 401, 541, 611, 681, 751].map((x) => (
          <circle key={x} cx={x} cy="262" r="5.5" className="fill-[#D4D4D4] dark:fill-[#3A3A3A]" />
        ))}
        {[261, 331, 401].map((x) => (
          <circle key={x} cx={x} cy="182" r="5.5" className="fill-[#D4D4D4] dark:fill-[#3A3A3A]" />
        ))}
        {[541, 611, 681].map((x) => (
          <circle key={x} cx={x} cy="102" r="5.5" className="fill-[#D4D4D4] dark:fill-[#3A3A3A]" />
        ))}
        {HISTORY_DOTS.map(([cx, cy, fill, at]) => {
          const shown = stage >= at;
          const order = HISTORY_DOTS.filter((dot) => dot[3] === at).findIndex((dot) => dot[0] === cx);
          return (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="5.5"
              className={fill}
              initial={false}
              animate={{ scale: shown ? 1 : 0.85, opacity: shown ? 1 : 0 }}
              transition={{ ...SPRING, duration: 0.3, delay: shown && stage === at ? (at === 1 ? 0.1 : 0.25) + order * 0.15 : 0 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
        <circle cx="751" cy="102" r="5" strokeWidth="1.3" strokeDasharray="2.2 2" className="fill-card stroke-foreground/30 dark:fill-surface-2" />
        <motion.circle
          cx="751"
          cy="102"
          r="5"
          strokeWidth="1.3"
          strokeDasharray="2.2 2"
          className="fill-card stroke-stage-draft dark:fill-surface-2"
          initial={false}
          animate={{ opacity: stage >= 4 ? 1 : 0 }}
          transition={{ duration: 0.3, delay: stage >= 4 ? 0.4 : 0 }}
        />
        {stage >= 4 &&
          (reduceMotion ? (
            <circle cx="681" cy="102" r="11" className="fill-info/15" />
          ) : (
            <motion.circle
              cx="681"
              cy="102"
              r="13"
              className="fill-info"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.14, 0], scale: [0.6, 1.2, 1.3] }}
              transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity, delay: 0.5 }}
              style={{ transformOrigin: "681px 102px" }}
            />
          ))}
        <circle cx="471" cy="262" r="10" strokeWidth="1.2" className="fill-card stroke-foreground/25 dark:fill-surface-2" />
        <g transform="translate(465 256) scale(.5)" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="18" r="2" />
          <circle cx="7" cy="6" r="2" />
          <circle cx="17" cy="12" r="2" />
          <path d="M7.021 8.279V15.407M14.411 12.005L10.019 12.005C8.922 12.005 6.862 11.125 7.018 8.78" />
        </g>
      </svg>

      <BranchLabel color="text-foreground" style={{ left: 91, top: 222 }} show={stage >= 1}>
        Released
      </BranchLabel>
      <BranchLabel color="text-primary" style={{ left: 215, top: 142 }} show={stage >= 2}>
        Symbol updated
      </BranchLabel>
      <BranchLabel color="text-info" style={{ left: 495, top: 62 }} show={stage >= 3}>
        Manufacturer address updated
      </BranchLabel>
      <VersionTag style={{ left: 110, top: 278 }}>v2</VersionTag>
      <VersionTag style={{ left: 460, top: 280 }}>v3</VersionTag>
      <VersionTag style={{ left: 740, top: 278 }}>v4</VersionTag>
      <BranchLabel color="text-stage-draft" style={{ left: 712, top: 116 }} show={stage >= 4}>
        Draft
      </BranchLabel>
    </ScaledCanvas>
  );
}

/* ------------------------------- Source files ------------------------------ */

type FileKind = "pdf" | "docx" | "xlsx" | "png" | "csv";

const FILE_BADGE: Record<FileKind, string> = {
  pdf: "border-[#B91C1C33] bg-destructive",
  docx: "border-[#1D4ED833] bg-info",
  xlsx: "border-[#04785733] bg-success",
  png: "border-[#6A12DC33] bg-primary",
  csv: "border-[#0F766E33] bg-teal",
};

function FileSheet({ kind }: { kind: FileKind }) {
  if (kind === "xlsx") {
    return (
      <>
        {[true, false, false, false].map((head, row) => (
          <div key={row} className="flex gap-0.5">
            {[0, 1, 2].map((cell) => (
              <span key={cell} className={cn("h-[5px] flex-1 rounded-[1px]", head ? "bg-[#05966933]" : "bg-file-line")} />
            ))}
          </div>
        ))}
      </>
    );
  }
  if (kind === "csv") {
    return (
      <>
        {[true, false, false, false].map((head, row) => (
          <div key={row} className="mb-px flex gap-0.5">
            {[8, 10, 6].map((w) => (
              <span key={w} className={cn("h-[3px] rounded-full", head ? "bg-[#14B8A666]" : "bg-border")} style={{ width: w }} />
            ))}
          </div>
        ))}
      </>
    );
  }
  if (kind === "docx") {
    return (
      <>
        <span className="h-1 w-[60%] rounded-full bg-[#6A6A6A4D]" />
        {[92, 80, 86, 70].map((w, i) => (
          <span key={w} className={cn("h-[3px] rounded-full bg-file-line", i === 0 && "mt-0.5")} style={{ width: `${w}%` }} />
        ))}
      </>
    );
  }
  return (
    <>
      <span className={cn("w-full rounded-[2px]", kind === "png" ? "h-4 bg-[#7F22FE1A]" : "h-3 bg-[#E7000B14]")} />
      {[86, 92, 64].map((w, i) => (
        <span key={w} className={cn("h-[3px] rounded-full bg-file-line", i === 0 && "mt-px")} style={{ width: `${w}%` }} />
      ))}
    </>
  );
}

const LIBRARY_FILES: { name: string; kind: FileKind }[] = [
  { name: "Pouch_v4", kind: "pdf" },
  { name: "Carton_v2", kind: "pdf" },
  { name: "IFU_EN_r7", kind: "docx" },
  { name: "Specs_2042", kind: "xlsx" },
  { name: "Mockup_01", kind: "png" },
  { name: "IFU_DE_r3", kind: "docx" },
  { name: "Risk_RMF", kind: "pdf" },
  { name: "UDI_list", kind: "csv" },
];

const LIBRARY_TAGS = [
  ["EU MDR", "bg-info"],
  ["FDA 21 CFR 801", "bg-success"],
  ["Pending review", "bg-primary"],
] as const;

const LIBRARY_NAV: { label: string; count?: number; icon: IconProps["icon"] }[] = [
  { label: "All files", count: 48, icon: Folder02Icon },
  { label: "Artwork", count: 12, icon: Image01Icon },
  { label: "IFU", count: 9, icon: FileEditIcon },
  { label: "Specs", count: 14, icon: GridTableIcon },
  { label: "Bookmarked", icon: Bookmark01Icon },
];

export function SourceLibrary({
  reduceMotion,
  variant = "default",
}: {
  reduceMotion: boolean;
  variant?: "default" | "compact";
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [ref, tick] = useTicker(1800, !reduceMotion && hovered === null);
  const selected = hovered ?? (1 + tick) % LIBRARY_FILES.length;
  const compact = variant === "compact";
  const nav = compact ? LIBRARY_NAV.slice(0, 4) : LIBRARY_NAV;
  const tags = compact ? LIBRARY_TAGS.slice(0, 2) : LIBRARY_TAGS;

  return (
    <ScaledCanvas
      ref={ref}
      width={compact ? 576 : 654}
      height={compact ? 310 : 420}
      minScale={0.62}
      panX={compact ? 288 : 327}
      panBelow={640}
    >
      {!compact && (
        <>
          <GuideLine orientation="h" style={{ left: 0, top: 27, width: 654 }} className="border-border" />
          {[57, 597].map((x) => (
            <GuideLine key={x} orientation="v" style={{ left: x, top: 0, height: 380 }} className="border-border" />
          ))}
        </>
      )}
      <div
        className={cn(
          "absolute border border-separator bg-[#F3F3F3] dark:bg-surface-1",
          compact
            ? "inset-x-0 top-0 rounded-[18px] px-[5px] pb-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_36px_-20px_rgba(0,0,0,0.14)]"
            : "left-[57px] top-1 w-[540px] rounded-[20px] px-1.5 pb-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_24px_48px_-24px_rgba(0,0,0,0.15)]",
        )}
      >
        <div className={cn("flex items-center", compact ? "h-[38px] gap-2 px-1.5" : "h-[46px] gap-2.5 px-1.5")}>
          <div className={cn("flex", compact ? "gap-[5px]" : "gap-1.5")}>
            {[0, 1, 2].map((dot) => (
              <span key={dot} className={cn("rounded-full bg-foreground/[0.13]", compact ? "size-2" : "size-2.5")} />
            ))}
          </div>
          {!compact && (
            <div className="mx-0.5 flex gap-0.5 text-foreground/40">
              <Icon icon={ArrowLeft01Icon} size={16} strokeWidth={1.8} />
              <Icon icon={ArrowRight01Icon} size={16} strokeWidth={1.8} />
            </div>
          )}
          <div className={cn("flex flex-1 items-center rounded-sm", compact ? "h-6 gap-1.5 px-2" : "h-7 gap-2 px-2.5", CARD, "shadow-none")}>
            <Icon icon={Search01Icon} size={compact ? 11 : 13} strokeWidth={1.8} className="shrink-0 text-foreground/50" />
            <span className={cn("flex-1 font-ui text-faint-foreground", compact ? "text-[11px] leading-[14px]" : "text-[12px] leading-4")}>
              Search source files
            </span>
            <span className="font-ui text-[10px] leading-3 text-faint-foreground">⌘K</span>
          </div>
          {!compact && (
            <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-foreground", CARD)}>
              <Icon icon={DashboardSquare01Icon} size={13} strokeWidth={1.8} />
            </span>
          )}
        </div>
        <div className={cn("flex overflow-hidden", compact ? "h-[264px] rounded-[13px]" : "h-[340px] rounded-[14px]", CARD, "shadow-none")}>
          <div
            className={cn(
              "flex shrink-0 flex-col gap-0.5 border-r border-separator",
              compact ? "w-[126px] px-1.5 py-2.5" : "w-[150px] px-2 py-3.5",
            )}
          >
            <span
              className={cn(
                "font-ui font-medium leading-3 tracking-[0.08em] text-faint-foreground",
                compact ? "px-1.5 pb-1 text-[9.5px]" : "px-2 pb-1.5 text-[10px]",
              )}
            >
              LIBRARY
            </span>
            {nav.map((item, index) => (
              <span
                key={item.label}
                className={cn(
                  "flex shrink-0 items-center rounded-sm",
                  compact ? "h-6 gap-1.5 px-1.5" : "h-7 gap-2 px-2",
                  index === 0 && "bg-muted dark:bg-surface-3",
                )}
              >
                <Icon
                  icon={item.icon}
                  size={compact ? 12 : 14}
                  strokeWidth={1.6}
                  className={cn("shrink-0", index === 0 ? "text-foreground" : "text-foreground/60")}
                />
                <span
                  className={cn(
                    "flex-1 font-ui font-medium",
                    compact ? "text-[11px] leading-[14px]" : "text-[12px] leading-4",
                    index === 0 ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                {item.count && <span className="font-ui text-[10px] leading-3 text-faint-foreground">{item.count}</span>}
              </span>
            ))}
            <span className={cn("shrink-0", compact ? "h-2" : "h-3.5")} />
            <span
              className={cn(
                "font-ui font-medium leading-3 tracking-[0.08em] text-faint-foreground",
                compact ? "px-1.5 pb-1 text-[9.5px]" : "px-2 pb-1.5 text-[10px]",
              )}
            >
              TAGS
            </span>
            {tags.map(([label, dot]) => (
              <span
                key={label}
                className={cn("flex shrink-0 items-center", compact ? "h-5 gap-1.5 px-1.5" : "h-[22px] gap-2 px-2")}
              >
                <span className={cn("rounded-full", compact ? "size-1.5" : "size-[7px]", dot)} />
                <span className={cn("font-ui leading-[14px] text-muted-foreground", compact ? "text-[10.5px]" : "text-[11px]")}>
                  {label}
                </span>
              </span>
            ))}
          </div>
          <div className={cn("flex flex-1 flex-col", compact ? "gap-2 px-3 py-2.5" : "gap-2.5 p-3.5")}>
            <div className={cn("flex shrink-0 items-center gap-1.5", compact ? "h-4" : "h-5")}>
              <span className="font-ui text-[11px] leading-[14px] text-muted-foreground">IV Extension Set</span>
              <span className="font-ui text-[11px] leading-[14px] text-faint-foreground">›</span>
              <span className="flex-1 font-ui text-[11px] font-medium leading-[14px] text-foreground">All files</span>
              {compact ? (
                <span className="font-mono text-[9.5px] leading-3 text-faint-foreground">8 files · Synced</span>
              ) : (
                <span className="flex gap-[3px]">
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} className="size-1 rounded-full bg-ring" />
                  ))}
                </span>
              )}
            </div>
            <div className={cn("flex flex-wrap", compact ? "gap-x-2 gap-y-1.5" : "gap-x-1 gap-y-1.5 pt-1")}>
              {LIBRARY_FILES.map((file, index) => {
                const isSelected = index === selected;
                return (
                  <div
                    key={file.name}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "relative flex w-20 shrink-0 cursor-default flex-col items-center rounded-xl",
                      compact ? "gap-1.5 py-1.5" : "gap-2 pb-2 pt-3",
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId={`source-file-selection-${variant}`}
                        transition={SPRING}
                        className="absolute inset-0 z-0 rounded-xl border border-border bg-muted dark:border-edge-2 dark:bg-surface-3"
                      />
                    )}
                    <span className="relative z-10 flex shrink-0 rounded-l-[9px] rounded-r-[9px] rounded-tr-[14px] border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      <span className="flex h-[50px] w-10 shrink-0 flex-col gap-[3px] rounded-l-[7px] rounded-br-[7px] rounded-tr-[11px] bg-file-sheet px-[7px] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
                        <FileSheet kind={file.kind} />
                      </span>
                      <span
                        className={cn(
                          "absolute -left-2.5 bottom-2 rounded-sm border px-[5px] py-0.5 font-ui text-[10px] font-medium leading-3 text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:text-surface-0",
                          FILE_BADGE[file.kind],
                        )}
                      >
                        .{file.kind}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "relative z-10 whitespace-nowrap font-ui text-[10px] leading-3 transition-colors duration-200",
                        isSelected ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {file.name}
                    </span>
                  </div>
                );
              })}
            </div>
            {!compact && (
              <div className="mt-auto flex justify-between border-t border-separator pt-2.5 font-ui text-[10px] leading-3 text-faint-foreground">
                <span>8 files · 24.6 MB</span>
                <span>Synced</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

/* ---------------------------------- Status --------------------------------- */

const STATUS_NODES: { kicker: string; title: string; top: number; icon: IconProps["icon"] }[] = [
  { kicker: "Draft", title: "Label being prepared", top: 16, icon: PencilEdit02Icon },
  { kicker: "Submitted", title: "Sent to reviewers", top: 128, icon: SentIcon },
  { kicker: "In review", title: "Checked and approved", top: 240, icon: ViewIcon },
];

const STATUS_HOLD = 4;

const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;

function StatusCard({
  state,
  kicker,
  title,
  icon,
  className,
  style,
  iconSlot,
}: {
  state: StepState;
  kicker: string;
  title: string;
  icon: IconProps["icon"];
  className?: string;
  style?: React.CSSProperties;
  iconSlot?: React.ReactNode;
}) {
  const tone = stepTone(state);
  return (
    <div className={cn("absolute", tone.frame, className)} style={style}>
      <div className={cn("flex h-[58px] w-[262px] items-center gap-3 rounded-xl pl-[9px] pr-3.5", tone.card)}>
        <span className={cn("relative size-[38px] rounded-lg", tone.icon)}>
          {iconSlot ?? <Icon icon={icon} size={17} strokeWidth={1.7} />}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={cn("font-ui text-[10px] font-semibold uppercase leading-3 tracking-[0.08em]", tone.meta)}>{kicker}</span>
          <span className={cn("whitespace-nowrap font-ui text-[14px] font-medium leading-[18px]", tone.title)}>{title}</span>
        </span>
      </div>
    </div>
  );
}

const STATUS_LINKS = [
  [87.25, 124.75],
  [199.25, 236.75],
];
const RELEASE_BRANCH = "M327 311.25C327 350 478 338 478 376.75";

function StatusFlow({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, tick] = useTicker(1400, !reduceMotion);
  const cycle = STATUS_NODES.length + 2 + STATUS_HOLD;
  const step = reduceMotion ? STATUS_NODES.length + 1 : Math.min(tick % cycle, STATUS_NODES.length + 1);
  const branched = step >= STATUS_NODES.length;
  const locked = step > STATUS_NODES.length;
  const releasing = branched && !locked;

  return (
    <ScaledCanvas ref={ref} aria-hidden="true" width={654} height={480} minScale={0.6} panX={327} panBelow={640}>
      <span aria-hidden="true" className="absolute left-[207px] top-[50px] size-60 rounded-full border border-dashed border-stroke-primary" />
      <span aria-hidden="true" className="absolute left-[132px] top-[-25px] size-[390px] rounded-full border border-dashed border-foreground/5" />

      {STATUS_NODES.map((node, index) => (
        <StatusCard
          key={node.kicker}
          state={step > index ? "done" : step === index ? "active" : "idle"}
          kicker={node.kicker}
          title={node.title}
          icon={node.icon}
          className="left-[191px]"
          style={{ top: node.top }}
        />
      ))}

      <StatusCard
        state="idle"
        kicker="Obsolete"
        title="v4 retired, kept on file"
        className={cn("left-10 top-[380px] transition-opacity duration-500", branched ? "opacity-50" : "opacity-30")}
        icon={ArchiveIcon}
      />

      <StatusCard
        state={branched ? "active" : "idle"}
        kicker="Released"
        title="v5 approved and locked"
        className="left-[342px] top-[380px]"
        icon={SquareLock02Icon}
        iconSlot={
          <>
            {!reduceMotion && releasing && (
              <motion.svg
                width="17"
                height="17"
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="absolute"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22, ease: EASE_OUT, delay: 0.25 }}
              >
                <g className="origin-center animate-spin motion-reduce:animate-none [animation-duration:900ms] [transform-box:fill-box]">
                  <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="2" />
                  <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </g>
              </motion.svg>
            )}
            <motion.span
              className="flex"
              initial={false}
              animate={releasing && !reduceMotion ? { opacity: 0, scale: 0.88, filter: "blur(2px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", duration: 0.24, bounce: 0, delay: locked ? 0.1 : releasing ? 0.2 : 0 }}
            >
              <Icon icon={SquareLock02Icon} size={17} strokeWidth={1.7} />
            </motion.span>
          </>
        }
      />

      <svg width="654" height="480" viewBox="0 0 654 480" aria-hidden="true" className="pointer-events-none absolute inset-0 text-foreground">
        {STATUS_LINKS.map(([from, to], index) => (
          <g key={from}>
            <DottedConnector
              d={`M327 ${from}V${to}`}
              active={step > index}
              canvasWidth={654}
              canvasHeight={480}
              transition={{ duration: step > index ? 0.5 : 0.3, ease: FLOW_EASE }}
            />
            {step === index + 1 && !reduceMotion && (
              <motion.g
                key={tick}
                initial={{ x: 327, y: from - 3, opacity: 0 }}
                animate={{ x: 327, y: to + 3, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.55, ease: FLOW_EASE }}
              >
                <circle cx="0" cy="0" r="2" className="fill-foreground" />
              </motion.g>
            )}
          </g>
        ))}
        <path
          d="M327 311.25C327 350 176 338 176 376.75"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="3 4"
        />
        <DottedConnector
          d={RELEASE_BRANCH}
          active={branched}
          canvasWidth={654}
          canvasHeight={480}
          transition={{ duration: branched ? 0.55 : 0.3, ease: FLOW_EASE }}
        />
        {[84, 196, 308].map((y) => (
          <path key={y} d={`M323.75 ${y}A3.25 3.25 0 0 0 330.25 ${y}`} strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
        ))}
        {[
          [327, 128],
          [327, 240],
          [176, 380],
          [478, 380],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 3.25} ${y}A3.25 3.25 0 0 1 ${x + 3.25} ${y}`} strokeWidth="1.2" className="fill-card stroke-foreground/35 dark:fill-surface-2" />
        ))}
      </svg>

      <span className="absolute left-[226px] top-[335px] flex h-[18px] items-center rounded-tile border border-border bg-card px-[7px] font-ui text-[10px] font-semibold leading-3 text-faint-foreground dark:border-edge-2 dark:bg-surface-2">
        Old version
      </span>
      <span
        className={cn(
          "absolute left-[378px] top-[335px] flex h-[18px] items-center rounded-tile px-[7px] font-ui text-[10px] font-semibold leading-3 transition-colors duration-300",
          branched ? "bg-foreground text-background" : "border border-border bg-card text-faint-foreground dark:border-edge-2 dark:bg-surface-2",
        )}
      >
        New version
      </span>
    </ScaledCanvas>
  );
}

/* --------------------------------- Section --------------------------------- */

export default function FeaturesSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="features-heading" className="contents">
        <SectionHeader id="features-heading" anchorId="features" title="Everything around the label," mutedTitle="handled.">
          Review cycles, revision history, source files, ISO symbols and label
          status are managed for every product, so your team stays audit-ready
          without chasing documents.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1">
          <FeatureTile
            id="approvals"
            title="Review cycles, on the record"
            body="Route every labeling change through review rounds until every reviewer signs off. Comments, revisions and approvals stay on the change record."
            maxWidth={540}
          >
            <ReviewCycles reduceMotion={reduceMotion} />
          </FeatureTile>
        </TileRow>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[1fr_2fr]">
          <FeatureTile
            title="ISO 15223-1 symbols, built in"
            body="Place harmonized symbols from a controlled library, each linked to the label field it represents."
            maxWidth={360}
          >
            <SymbolLibrary reduceMotion={reduceMotion} />
          </FeatureTile>
          <FeatureTile
            title="Every revision, traceable"
            body="Released labels stay locked. Each update, like a new symbol or address, is drafted on its own and becomes the next version."
            maxWidth={440}
          >
            <RevisionHistory reduceMotion={reduceMotion} />
          </FeatureTile>
        </TileRow>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <FeatureTile
            title="Source files under control"
            body="Keep artwork, IFUs and specifications in one library per product, next to the label they support."
            maxWidth={420}
          >
            <SourceLibrary reduceMotion={reduceMotion} />
          </FeatureTile>
          <FeatureTile
            title="Always know where a product stands"
            body="Every product moves from draft to release. When a new version goes live, the old one becomes obsolete."
            maxWidth={420}
          >
            <StatusFlow reduceMotion={reduceMotion} />
          </FeatureTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
