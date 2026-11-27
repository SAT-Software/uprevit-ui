"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  CubeIcon,
  LayoutTable01Icon,
  Search01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  SourceLibrary,
  SymbolLibrary,
  type LibrarySymbol,
} from "@/features/marketing/landing-page/FeaturesSection";
import { ActivityLog, GovTile } from "@/features/marketing/landing-page/GovernanceSection";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.28, bounce: 0 };

function SymbolGlyph({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

const MONO = {
  bg: "bg-[#F4F4F4] dark:bg-surface-3",
  ink: "text-foreground",
  ring: "rgba(127,127,127,0.16)",
};

const MONO_SYMBOLS: LibrarySymbol[] = [
  {
    ...MONO,
    code: "5.1.1",
    label: "Manufacturer",
    left: 72,
    top: 80,
    icon: (
      <SymbolGlyph>
        <path d="M3 20V11L8 14.5V11L13 14.5V11L16.5 13.5V4H20.5V20H3Z" fill="currentColor" strokeWidth={1.2} />
      </SymbolGlyph>
    ),
  },
  {
    ...MONO,
    code: "5.1.4",
    label: "Use-by date",
    left: 180,
    top: 80,
    icon: (
      <SymbolGlyph>
        <path d="M6 3H18M6 21H18" strokeWidth={1.8} />
        <path d="M7.5 3V6.5L12 12L16.5 6.5V3" />
        <path d="M7.5 21V17.5L12 12L16.5 17.5V21" fill="currentColor" fillOpacity={0.15} />
      </SymbolGlyph>
    ),
  },
  {
    ...MONO,
    code: "5.3.7",
    label: "Temperature limit",
    left: 288,
    top: 80,
    icon: (
      <SymbolGlyph>
        <path d="M10.2 4.5a1.8 1.8 0 0 1 3.6 0v9.6a3.4 3.4 0 1 1-3.6 0V4.5z" />
        <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <path d="M12 10.5V16" />
        <path d="M4 15.5H7.5L16.5 6.5H20" strokeWidth={1.5} />
      </SymbolGlyph>
    ),
  },
  {
    ...MONO,
    code: "5.1.6",
    label: "Catalogue number",
    left: 72,
    top: 190,
    icon: (
      <span className="flex h-[22px] items-center justify-center rounded-[2px] border-[1.6px] border-current px-[5px] font-mono text-[11px] leading-3 tracking-[-0.04em]">
        REF
      </span>
    ),
  },
  {
    ...MONO,
    code: "5.2.4",
    label: "Sterilized using irradiation",
    left: 180,
    top: 190,
    icon: (
      <span className="flex h-5 overflow-hidden rounded-[2px] border-[1.5px] border-current font-mono leading-[10px]">
        <span className="flex items-center px-[3px] text-[7.5px] tracking-[0.02em]">STERILE</span>
        <span className="flex items-center border-l-[1.5px] border-current px-[3.5px] text-[9px]">R</span>
      </span>
    ),
  },
  {
    ...MONO,
    code: "5.4.2",
    label: "Do not re-use",
    left: 288,
    top: 190,
    icon: (
      <SymbolGlyph>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M6 18L18 6" />
        <path d="M9.6 9.6C9.6 8.2 10.6 7.4 12 7.4C13.4 7.4 14.4 8.2 14.4 9.5C14.4 10.7 13.4 11.6 9.6 15.2H14.5" />
      </SymbolGlyph>
    ),
  },
];

const QUERY = "PX-2042";
const MATCH_DELAYS = [0, 0.085, 0.155, 0.215] as const;

const MATCHES: { title: string; meta: string; tag: string; mono: boolean; icon: IconSvgElement }[] = [
  {
    title: "IV Extension Set, 150 cm",
    meta: "PX-2042 · Infusion Therapy › IV Sets",
    tag: "v4 · In review",
    mono: true,
    icon: CubeIcon,
  },
  {
    title: "PX-2042_specs.xlsx",
    meta: "Source file · 48 specification rows",
    tag: "Source files",
    mono: false,
    icon: LayoutTable01Icon,
  },
  {
    title: "WF-019 · PX-2042 EU MDR Release",
    meta: "Approval workflow · 2 of 3 approved",
    tag: "Workflow",
    mono: false,
    icon: CheckmarkCircle02Icon,
  },
  {
    title: "ISO 15223-1 · Sterile EO (5.2.3)",
    meta: "Symbol · Mapped to Pouch & Carton labels",
    tag: "Symbols",
    mono: false,
    icon: Tag01Icon,
  },
];

type SearchPhase =
  | "idle"
  | "focused"
  | "typing"
  | "ready"
  | "enter"
  | "panel"
  | "results"
  | "navigating"
  | "closing";

function GlobalSearch({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const [phase, setPhase] = React.useState<SearchPhase>(reduceMotion ? "navigating" : "idle");
  const [typed, setTyped] = React.useState(reduceMotion ? QUERY.length : 0);
  const [step, setStep] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number, fn: () => void) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const runCycle = () => {
      setPhase("idle");
      setTyped(0);
      setStep(0);

      wait(1400, () => {
        setPhase("focused");
        wait(450, () => {
          setPhase("typing");
          let count = 0;
          const typeNext = () => {
            count += 1;
            setTyped(count);
            if (count < QUERY.length) {
              wait(150 + (count % 3) * 30, typeNext);
            } else {
              setPhase("ready");
              wait(520, () => {
                setPhase("enter");
                wait(460, () => {
                  setPhase("panel");
                  wait(500, () => {
                    setPhase("results");
                    wait(620, () => {
                      setPhase("navigating");
                      wait(4850, () => {
                        setPhase("closing");
                        wait(360, runCycle);
                      });
                    });
                  });
                });
              });
            }
          };
          wait(140, typeNext);
        });
      });
    };

    wait(0, runCycle);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const activePhase: SearchPhase = reduceMotion ? "navigating" : phase;
  const length = reduceMotion ? QUERY.length : typed;
  const isFocused = activePhase !== "idle";
  const isWide =
    length > 0 ||
    activePhase === "ready" ||
    activePhase === "enter" ||
    activePhase === "panel" ||
    activePhase === "results" ||
    activePhase === "navigating" ||
    activePhase === "closing";
  const isTop =
    activePhase === "panel" ||
    activePhase === "results" ||
    activePhase === "navigating" ||
    activePhase === "closing";
  const showPanel =
    activePhase === "panel" || activePhase === "results" || activePhase === "navigating";
  const showMatches = activePhase === "results" || activePhase === "navigating";
  const isNavigating = activePhase === "navigating";
  const isEnter = activePhase === "enter";
  const showCaret =
    activePhase === "focused" ||
    activePhase === "typing" ||
    activePhase === "ready" ||
    activePhase === "enter";
  const selected = hovered ?? (isNavigating ? step : null);

  React.useEffect(() => {
    if (!isNavigating || reduceMotion || hovered !== null || !inView) return;
    const id = setInterval(() => setStep((value) => (value < 2 ? value + 1 : value)), 1550);
    return () => clearInterval(id);
  }, [isNavigating, reduceMotion, hovered, inView]);

  return (
    <ScaledCanvas ref={ref} aria-hidden="true" width={576} height={310} minScale={0.62} panX={288} panBelow={640}>
      <div className="relative h-full w-full">
        <motion.div
          initial={false}
          animate={{
            y: isTop ? 0 : 122,
          }}
          transition={{ duration: 0.56, ease: EASE_OUT }}
          className="relative z-20 flex justify-center"
        >
          <motion.div
            initial={false}
            animate={{
              width: isWide ? 576 : 292,
            }}
            transition={{ duration: 0.58, ease: EASE_OUT }}
            className="shrink-0 rounded-[14px] border border-foreground/[0.06] bg-frame-surface p-1 dark:border-edge-1"
          >
            <div
              className={cn(
                "flex h-[38px] items-center justify-between gap-2 rounded-lg border bg-white px-3 transition-[border-color,box-shadow] duration-250 ease-out dark:bg-surface-2",
                isFocused
                  ? "border-foreground/25 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.1)] dark:border-edge-3"
                  : "border-stroke-strong shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)] dark:border-edge-2",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon
                  icon={Search01Icon}
                  size={14}
                  strokeWidth={1.8}
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    isFocused ? "text-foreground" : "text-muted-foreground",
                  )}
                />
                <span className="relative flex items-center gap-px font-mono text-[12.5px] leading-4 text-foreground">
                  {length === 0 ? (
                    <span className="font-ui text-[12.5px] text-placeholder">
                      Search workspace…
                    </span>
                  ) : (
                    QUERY.slice(0, length)
                  )}
                  {showCaret && inView && (
                    <motion.span
                      aria-hidden="true"
                      className="h-3.5 w-[1.5px] rounded-[1px] bg-foreground"
                      animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
                    />
                  )}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <AnimatePresence initial={false}>
                  {showMatches && (
                    <motion.span
                      key="match-count"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="whitespace-nowrap font-mono text-[10px] leading-3 text-placeholder"
                    >
                      8 matches
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span
                  initial={false}
                  animate={{
                    scale: isEnter ? 0.86 : 1,
                  }}
                  transition={{ duration: 0.14, ease: EASE_OUT }}
                  className={cn(
                    "flex h-5 min-w-[24px] items-center justify-center rounded-[5px] border px-1.5 font-mono text-[10px] leading-3 transition-colors duration-150",
                    isEnter
                      ? "border-foreground bg-foreground text-background"
                      : "border-stroke-primary bg-muted text-muted-foreground dark:border-edge-2 dark:bg-surface-3",
                  )}
                >
                  {activePhase === "ready" || isEnter ? "↵" : "⌘K"}
                </motion.span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              key="search-dropdown"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.42, delay: reduceMotion ? 0 : 0.12, ease: EASE_OUT },
              }}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { opacity: 0, y: 6, scale: 0.985, transition: { duration: 0.22, ease: EASE_OUT } }
              }
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 bottom-0 top-[58px] flex flex-col rounded-2xl border border-foreground/[0.06] bg-frame-surface p-[5px] shadow-[0_14px_28px_-14px_rgba(0,0,0,0.12)] dark:border-edge-1"
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[11px] border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2">
                <div className="relative flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-2 pt-2">
                  <span className="shrink-0 px-1.5 pb-0.5 font-ui text-[9.5px] font-medium uppercase leading-3 tracking-[0.08em] text-faint-foreground">
                    Top matches
                  </span>
                  {showMatches &&
                    MATCHES.map((match, index) => {
                      const isSelected = selected === index;
                      return (
                        <motion.div
                          key={match.title}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: EASE_OUT,
                            delay: reduceMotion ? 0 : MATCH_DELAYS[index],
                          }}
                          onMouseEnter={() => setHovered(index)}
                          onMouseLeave={() => setHovered(null)}
                          className="relative flex h-[46px] shrink-0 cursor-default items-center justify-between gap-3 rounded-[9px] px-2.5"
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="global-search-selection"
                              transition={SPRING}
                              className="absolute inset-0 z-0 rounded-[9px] bg-[#1A1A1A] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)] dark:bg-[#2E2E2E] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                            />
                          )}
                          <span className="relative z-10 flex min-w-0 items-center gap-2.5">
                            <span
                              className={cn(
                                "flex size-7 shrink-0 items-center justify-center rounded-[7px] border transition-colors duration-150",
                                isSelected
                                  ? "border-white/[0.12] bg-white/[0.08] text-white"
                                  : "border-stroke-primary bg-muted text-foreground dark:border-edge-2 dark:bg-surface-3",
                              )}
                            >
                              <Icon icon={match.icon} size={14} strokeWidth={1.7} />
                            </span>
                            <span className="flex min-w-0 flex-col gap-px">
                              <span
                                className={cn(
                                  "truncate font-ui text-[12px] font-medium leading-[15px] transition-colors duration-150",
                                  isSelected ? "text-white" : "text-foreground",
                                )}
                              >
                                {match.title}
                              </span>
                              <span
                                className={cn(
                                  "truncate text-[10.5px] leading-[13px] transition-colors duration-150",
                                  match.mono ? "font-mono text-[10px]" : "font-ui",
                                  isSelected ? "text-white/60" : "text-icon",
                                )}
                              >
                                {match.meta}
                              </span>
                            </span>
                          </span>
                          <span className="relative z-10 flex shrink-0 items-center gap-1.5">
                            <span
                              className={cn(
                                "rounded-[5px] border px-1.5 py-0.5 text-[10px] leading-3 transition-colors duration-150",
                                match.mono ? "font-mono" : "font-ui font-medium",
                                isSelected
                                  ? "border-transparent bg-white/[0.08] text-white/80"
                                  : "border-stroke-primary bg-muted text-muted-foreground dark:border-edge-2 dark:bg-surface-3",
                              )}
                            >
                              {match.tag}
                            </span>
                            <motion.span
                              initial={false}
                              animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.85 }}
                              transition={{ duration: 0.18, ease: EASE_OUT }}
                              className="flex size-[18px] items-center justify-center rounded-[5px] bg-white/[0.14] font-mono text-[10px] leading-3 text-white"
                            >
                              ↵
                            </motion.span>
                          </span>
                        </motion.div>
                      );
                    })}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-9 bg-gradient-to-t from-white via-white/75 to-transparent dark:from-surface-2 dark:via-surface-2/75"
                  />
                </div>
                <div className="flex h-7 shrink-0 items-center justify-between border-t border-separator bg-subtle px-3 font-mono text-[9.5px] leading-3 text-placeholder dark:border-edge-1 dark:bg-surface-3/50">
                  <span className="flex gap-2.5">
                    <span>↑↓ navigate</span>
                    <span>↵ open record</span>
                  </span>
                  <span>ESC to close</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScaledCanvas>
  );
}

export default function PlatformInspectionSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="platform-inspection-heading" className="contents">
        <SectionHeader
          id="platform-inspection-heading"
          anchorId="inspection"
          title="Built for inspection."
          mutedTitle="Shared across every team."
        >
          Keep reusable assets in one shared library and record every workspace
          action automatically—without maintaining external logs.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Workspace audit trail"
            body="Every edit, move, submission, approval, and release logged with actor, scope, and timestamp."
            maxWidth={520}
          >
            <ActivityLog reduceMotion={reduceMotion} variant="compact" />
          </GovTile>
          <GovTile
            title="ISO standard symbol library"
            body="Insert standardized ISO 15223-1 symbols with reference numbers and track presence per label."
            maxWidth={520}
          >
            <SymbolLibrary
              reduceMotion={reduceMotion}
              symbols={MONO_SYMBOLS}
              activeClassName="bg-invert text-invert-foreground"
            />
          </GovTile>
        </TileRow>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Source files & linked folders"
            body="Keep supplier certificates, die-lines, and reference IFUs organized and linked directly to products."
            maxWidth={520}
            className="pb-6 sm:pb-10"
          >
            <div className="px-5 sm:px-8 lg:px-10">
              <SourceLibrary reduceMotion={reduceMotion} variant="compact" />
            </div>
          </GovTile>
          <GovTile
            title="Global search (⌘K)"
            body="Jump to any product record, symbol, workflow, or source file in your workspace from the keyboard."
            maxWidth={520}
            className="pb-6 sm:pb-10"
          >
            <div className="px-5 sm:px-8 lg:px-10">
              <GlobalSearch reduceMotion={reduceMotion} />
            </div>
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
