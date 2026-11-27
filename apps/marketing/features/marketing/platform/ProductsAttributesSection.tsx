"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Book01Icon,
  CubeIcon,
  FilterIcon,
  Note01Icon,
  Tag01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { GovTile } from "@/features/marketing/landing-page/GovernanceSection";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PULSE_EASE = [0.45, 0, 0.25, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.24, bounce: 0 };
const FRAME = "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

function useTicker(intervalMs: number, enabled: boolean) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || !inView) return;
    const id = setInterval(() => setTick((value) => value + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, inView, intervalMs]);

  return [ref, tick, inView] as const;
}

const DOC_TOP_PATH =
  "M20 13V10.657C20 9.839 20 9.431 19.848 9.063C19.695 8.696 19.407 8.406 18.828 7.828L14.092 3.092C13.593 2.593 13.344 2.344 13.034 2.196C12.97 2.165 12.904 2.138 12.837 2.114C12.514 2 12.161 2 11.456 2C8.211 2 6.588 2 5.489 2.886C5.267 3.065 5.065 3.267 4.886 3.489C4 4.588 4 6.211 4 9.456V13M13 2.5V3C13 5.828 13 7.243 13.879 8.121C14.757 9 16.172 9 19 9H19.5";
const DOC_XLS_PATH =
  "M10.5 16V20C10.5 20.943 10.5 21.414 10.793 21.707C11.086 22 11.557 22 12.5 22H14M4 16L6 19M6 19L8 22M6 19L8 16M6 19L4 22M20 16H17.5C16.948 16 16.5 16.448 16.5 17V18C16.5 18.552 16.948 19 17.5 19H19C19.552 19 20 19.448 20 20V21C20 21.552 19.552 22 19 22H16.5";

function XlsxFileIcon() {
  return (
    <span className="relative flex size-[17px] shrink-0">
      <svg
        width={17}
        height={17}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 text-[#A1A1AA] dark:text-[#6E6E6E]"
      >
        <path d={DOC_TOP_PATH} />
        <path d={DOC_XLS_PATH} />
      </svg>
      <span className="absolute left-0 top-[8px] flex h-[7px] items-center justify-center rounded-[2px] bg-[#047857] px-[2px] font-ui text-[4.5px] font-bold leading-[6px] tracking-[0.02em] text-white">
        XLSX
      </span>
    </span>
  );
}

/* ------------------ Tile 1: Product Info & Compliance -------------------- */

const STANDARDS = [
  { id: "CE", kind: "ce" as const },
  { id: "ISO", kind: "iso" as const },
  { id: "FDA", kind: "fda" as const },
];

const LANGUAGES = [
  { code: "EN", colors: ["#1E3A8A", "#FFFFFF", "#DC2626"] as const },
  { code: "DE", colors: ["#171717", "#DC2626", "#FACC15"] as const },
  { code: "FR", colors: ["#1D4ED8", "#FFFFFF", "#DC2626"] as const },
  { code: "ES", colors: ["#DC2626", "#FACC15", "#DC2626"] as const },
  { code: "IT", colors: ["#15803D", "#FFFFFF", "#DC2626"] as const },
  { code: "NL", colors: ["#DC2626", "#FFFFFF", "#1D4ED8"] as const },
];

function MiniFlag({ colors, vertical }: { colors: readonly [string, string, string]; vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-2.5 w-3.5 shrink-0 overflow-hidden rounded-[2px] border border-black/10",
        vertical ? "flex-row" : "flex-col",
      )}
    >
      {colors.map((c, idx) => (
        <span key={idx} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

function ProductInfoCompliance({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, tick, inView] = useTicker(2200, !reduceMotion);
  const activeStd = reduceMotion ? 0 : tick % STANDARDS.length;
  const topActive = reduceMotion ? true : tick % 2 === 0;

  return (
    <ScaledCanvas ref={ref} width={560} height={304} minScale={0.62} panX={280} panBelow={640} aria-hidden="true">
      <svg
        width="560"
        height="304"
        viewBox="0 0 560 304"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        <DottedConnector
          d="M276 145C306 145 302 81 332 81"
          active={topActive}
          canvasWidth={560}
          canvasHeight={304}
          baseOpacity={0.22}
          activeOpacity={0.72}
          transition={{ duration: 0.45, ease: PULSE_EASE }}
        />
        <DottedConnector
          d="M276 145C306 145 302 219 332 219"
          active={!topActive}
          canvasWidth={560}
          canvasHeight={304}
          baseOpacity={0.22}
          activeOpacity={0.72}
          transition={{ duration: 0.45, ease: PULSE_EASE }}
        />
        {!reduceMotion && inView && (
          <>
            <g opacity="0">
              <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
              <circle r="2" fill="currentColor" />
              <animateMotion
                path="M276 145C306 145 302 81 332 81"
                dur="2.8s"
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
                repeatCount="indefinite"
              />
            </g>
            <g opacity="0">
              <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
              <circle r="2" fill="currentColor" />
              <animateMotion
                path="M276 145C306 145 302 219 332 219"
                dur="2.8s"
                begin="1.2s"
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
                begin="1.2s"
                repeatCount="indefinite"
              />
            </g>
          </>
        )}
        <path d="M276 141.75A3.25 3.25 0 0 1 276 148.25" strokeWidth="1.2" className="fill-card stroke-foreground/40 dark:fill-surface-2" />
        <path d="M332 77.75A3.25 3.25 0 0 0 332 84.25" strokeWidth="1.2" className="fill-card stroke-foreground/40 dark:fill-surface-2" />
        <path d="M332 215.75A3.25 3.25 0 0 0 332 222.25" strokeWidth="1.2" className="fill-card stroke-foreground/40 dark:fill-surface-2" />
      </svg>

      {/* Left product card */}
      <div className={cn("absolute left-5 top-8 w-[256px] rounded-[16px] p-1 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
        <div className="flex flex-col gap-3 rounded-[12px] border border-border bg-card p-3.5 dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-stroke-primary bg-subtle text-foreground dark:border-edge-2 dark:bg-surface-3">
                <Icon icon={CubeIcon} size={15} strokeWidth={1.7} />
              </span>
              <div className="flex flex-col">
                <span className="font-ui text-[12.5px] font-semibold leading-4 text-foreground">
                  IV Extension Set
                </span>
                <span className="font-mono text-[10px] leading-[14px] text-muted-foreground">
                  PX-2042 · 150 cm
                </span>
              </div>
            </div>
            <span className="flex h-5 items-center gap-1 rounded-full border border-stroke-primary bg-subtle px-2 font-mono text-[10px] font-medium text-foreground dark:border-edge-2 dark:bg-surface-3">
              <span className="size-1.5 rounded-full bg-stage-released" />
              v4
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[10px] border border-separator bg-subtle/80 px-3 py-2.5 dark:border-edge-1 dark:bg-surface-3/40">
            <div className="flex flex-col gap-0.5">
              <span className="font-ui text-[10px] leading-3 text-muted-foreground">Basic UDI-DI</span>
              <span className="font-mono text-[11px] font-medium leading-4 text-foreground">
                08714729004218X9
              </span>
            </div>
            <span className="flex size-6 items-center justify-center rounded-md border border-stroke-primary bg-card text-foreground dark:border-edge-2 dark:bg-surface-2">
              <Icon icon={Tick02Icon} size={12} strokeWidth={2.2} />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5 rounded-[10px] border border-separator bg-subtle/80 px-2.5 py-2 dark:border-edge-1 dark:bg-surface-3/40">
              <span className="font-ui text-[10px] leading-3 text-muted-foreground">Risk Class</span>
              <span className="font-ui text-[12px] font-semibold leading-4 text-foreground">Class IIa</span>
            </div>
            <div className="flex flex-col gap-0.5 rounded-[10px] border border-separator bg-subtle/80 px-2.5 py-2 dark:border-edge-1 dark:bg-surface-3/40">
              <span className="font-ui text-[10px] leading-3 text-muted-foreground">EMDN</span>
              <span className="font-mono text-[11.5px] font-medium leading-4 text-foreground">A030101</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-separator pt-2.5 dark:border-edge-1">
            <span className="font-ui text-[10.5px] leading-3 text-muted-foreground">Sterile · Single-use</span>
            <span className="font-ui text-[10.5px] font-semibold leading-3 text-foreground">MDR Annex VIII</span>
          </div>
        </div>
      </div>

      {/* Top right: Standards */}
      <div className={cn("absolute right-5 top-6 w-[208px] rounded-[15px] p-1 shadow-[0_10px_22px_-12px_rgba(0,0,0,0.1)]", FRAME)}>
        <div className="flex flex-col gap-2.5 rounded-[11px] border border-border bg-card p-3 dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-center justify-between">
            <span className="font-ui text-[11.5px] font-semibold leading-4 text-foreground">Standards</span>
            <span className="font-ui text-[10px] leading-3 text-muted-foreground tabular-nums">3 active</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {STANDARDS.map((std, idx) => {
              const isActive = idx === activeStd;
              return (
                <motion.div
                  key={std.id}
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={SPRING}
                  className={cn(
                    "flex h-[54px] items-center justify-center rounded-[10px] border transition-colors duration-200",
                    isActive
                      ? "border-foreground/25 bg-card shadow-[0_4px_10px_-4px_rgba(0,0,0,0.1)] dark:border-edge-3 dark:bg-surface-3"
                      : "border-separator bg-subtle/70 dark:border-edge-1 dark:bg-surface-3/40",
                  )}
                >
                  {std.kind === "ce" && (
                    <span className="font-sans text-[19px] font-semibold tracking-[-0.04em] text-foreground">
                      CE
                    </span>
                  )}
                  {std.kind === "iso" && (
                    <span className="flex size-7 items-center justify-center rounded-[5px] bg-[#DC2626] font-sans text-[10px] font-bold tracking-tight text-white">
                      ISO
                    </span>
                  )}
                  {std.kind === "fda" && (
                    <span className="font-sans text-[15px] font-bold tracking-[-0.03em] text-[#0369A1] dark:text-[#38BDF8]">
                      FDA
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom right: Label languages */}
      <div className={cn("absolute right-5 top-[160px] w-[208px] rounded-[15px] p-1 shadow-[0_10px_22px_-12px_rgba(0,0,0,0.1)]", FRAME)}>
        <div className="flex flex-col gap-2.5 rounded-[11px] border border-border bg-card p-3 dark:border-edge-2 dark:bg-surface-2">
          <div className="flex items-center justify-between">
            <span className="font-ui text-[11.5px] font-semibold leading-4 text-foreground">
              Label languages
            </span>
            <span className="font-ui text-[10px] leading-3 text-muted-foreground tabular-nums">6 markets</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {LANGUAGES.map((lang) => (
              <span
                key={lang.code}
                className="flex h-[26px] items-center justify-center gap-1.5 rounded-md border border-separator bg-subtle/80 px-1.5 dark:border-edge-1 dark:bg-surface-3/40"
              >
                <MiniFlag colors={lang.colors} vertical={lang.code === "FR" || lang.code === "IT"} />
                <span className="font-mono text-[10px] font-medium leading-3 text-foreground">
                  {lang.code}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

/* --------------- Tile 2: Label Components & ISO Symbols ------------------ */

const COMPONENT_CARDS: { title: string; meta: string; symbolIndex: number; path: string; icon: IconSvgElement }[] = [
  {
    title: "Pouch Label",
    meta: "120×80 mm · 5 marks",
    symbolIndex: 0,
    path: "M216 76H250V152H282",
    icon: Note01Icon,
  },
  {
    title: "Shelf Carton",
    meta: "150×100 mm · 6 marks",
    symbolIndex: 2,
    path: "M216 152H282",
    icon: CubeIcon,
  },
  {
    title: "Folded IFU",
    meta: "210×297 mm · 3 marks",
    symbolIndex: 4,
    path: "M216 228H250V152H282",
    icon: Book01Icon,
  },
];

const ISO_SYMBOLS = [
  { code: "5.1.1", label: "Manufacturer" },
  { code: "5.1.4", label: "Use-by date" },
  { code: "5.3.7", label: "Temperature limit" },
  { code: "5.1.6", label: "Catalogue number" },
  { code: "5.3.2", label: "Keep away from sunlight" },
  { code: "5.4.2", label: "Do not re-use" },
] as const;

const ARC_CX = 464;
const ARC_CY = 152;
const ARC_R = 148;
const ARC_SPRING = { type: "spring" as const, duration: 0.72, bounce: 0.05 };

function IsoGlyph({ index }: { index: number }) {
  if (index === 3) {
    return (
      <span className="flex h-[18px] items-center justify-center rounded-[2px] border-[1.5px] border-current px-1 font-mono text-[9.5px] leading-3 tracking-[-0.04em]">
        REF
      </span>
    );
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {index === 0 && (
        <path d="M3 20V11L8 14.5V11L13 14.5V11L16.5 13.5V4H20.5V20H3Z" fill="currentColor" strokeWidth={1.1} />
      )}
      {index === 1 && (
        <>
          <path d="M6 3H18M6 21H18" strokeWidth={1.8} />
          <path d="M7.5 3V6.5L12 12L16.5 6.5V3" />
          <path d="M7.5 21V17.5L12 12L16.5 17.5V21" fill="currentColor" fillOpacity={0.15} />
        </>
      )}
      {index === 2 && (
        <>
          <path d="M10.2 4.5a1.8 1.8 0 0 1 3.6 0v9.6a3.4 3.4 0 1 1-3.6 0V4.5z" />
          <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
          <path d="M12 10.5V16" />
          <path d="M4 15.5H7.5L16.5 6.5H20" strokeWidth={1.5} />
        </>
      )}
      {index === 4 && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />
        </>
      )}
      {index === 5 && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M6 18L18 6" />
          <path d="M9.6 9.6C9.6 8.2 10.6 7.4 12 7.4C13.4 7.4 14.4 8.2 14.4 9.5C14.4 10.7 13.4 11.6 9.6 15.2H14.5" />
        </>
      )}
    </svg>
  );
}

function LabelComponentsSymbols({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [step, setStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion || !inView || paused) return;
    const id = setInterval(() => setStep((v) => v + 1), 2600);
    return () => clearInterval(id);
  }, [reduceMotion, inView, paused]);

  const activeSymbol = ((step % ISO_SYMBOLS.length) + ISO_SYMBOLS.length) % ISO_SYMBOLS.length;
  const activeComp = Math.floor(activeSymbol / 2) % COMPONENT_CARDS.length;
  const symbol = ISO_SYMBOLS[activeSymbol];
  const wheelAngle = reduceMotion ? 0 : -step * 60;

  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [pillW, setPillW] = React.useState(156);

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setPillW(Math.ceil(el.offsetWidth));
  }, [activeSymbol]);

  const jumpToSymbol = (targetIndex: number) => {
    const diff = ((targetIndex - activeSymbol + 9) % ISO_SYMBOLS.length) - 3;
    if (diff === 0) return;
    setStep((v) => v + diff);
  };

  return (
    <ScaledCanvas
      ref={ref}
      width={572}
      height={304}
      minScale={0.6}
      panX={286}
      panBelow={640}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <svg
        width="572"
        height="304"
        viewBox="0 0 572 304"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        <defs>
          <linearGradient id="iso-arc-fade-x" x1="296" y1="0" x2="544" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="48%" stopColor="white" stopOpacity="0.85" />
            <stop offset="82%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="iso-arc-mask">
            <rect x="280" y="0" width="292" height="304" fill="url(#iso-arc-fade-x)" />
          </mask>
        </defs>

        {/* Dotted circular orbital arc faded smoothly on the right */}
        <circle
          cx={ARC_CX}
          cy={ARC_CY}
          r={ARC_R}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth="1.3"
          strokeDasharray="4 5"
          mask="url(#iso-arc-mask)"
        />

        {/* Component bus connectors feeding into the prominent center circle */}
        {COMPONENT_CARDS.map((comp, idx) => {
          const isActive = idx === activeComp;
          return (
            <g key={comp.title}>
              <DottedConnector
                d={comp.path}
                active={isActive}
                canvasWidth={572}
                canvasHeight={304}
                baseOpacity={0.2}
                activeOpacity={0.78}
                transition={{ duration: 0.45, ease: PULSE_EASE }}
              />
              {!reduceMotion && inView && isActive && (
                <g key={`${comp.title}-${step}`} opacity="0">
                  <circle r="4.5" fill="currentColor" fillOpacity={0.1} />
                  <circle r="2" fill="currentColor" />
                  <animateMotion
                    path={comp.path}
                    dur="1.4s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.45 0 0.25 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.14;0.84;1"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Port caps where left cards connect */}
        {[76, 152, 228].map((y) => (
          <path
            key={y}
            d={`M216 ${y - 3.25}A3.25 3.25 0 0 1 216 ${y + 3.25}`}
            strokeWidth="1.2"
            className="fill-card stroke-foreground/40 dark:fill-surface-2"
          />
        ))}
      </svg>

      {/* Left component cards (thin p-1 landing-page ring) */}
      <div className="absolute left-3 top-[44px] flex w-[204px] flex-col gap-3">
        {COMPONENT_CARDS.map((comp, idx) => {
          const isActive = idx === activeComp;
          return (
            <button
              key={comp.title}
              type="button"
              aria-pressed={isActive}
              onClick={() => jumpToSymbol(comp.symbolIndex)}
              onMouseEnter={() => jumpToSymbol(comp.symbolIndex)}
              className={cn(
                "flex h-[64px] w-full cursor-pointer items-center rounded-[14px] border p-1 text-left transition-[color,background-color,border-color,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                isActive
                  ? "border-border bg-surface-selected shadow-[0_8px_18px_-10px_rgba(0,0,0,0.14)] dark:border-edge-2"
                  : FRAME,
              )}
            >
              <span className="flex size-full items-center gap-2.5 rounded-[10px] border border-border bg-card px-2.5 dark:border-edge-2 dark:bg-surface-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200",
                    isActive
                      ? "border-invert bg-invert text-invert-foreground"
                      : "border-stroke-primary bg-subtle text-foreground/75 dark:border-edge-2 dark:bg-surface-3",
                  )}
                >
                  <Icon icon={comp.icon} size={15} strokeWidth={1.7} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-ui text-[12px] font-semibold leading-4 text-foreground">
                    {comp.title}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[9.5px] leading-[13px] text-muted-foreground">
                    {comp.meta}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Rotating orbital icon wheel: top & bottom gently cut off and faded, center prominent */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[268px] right-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{ rotate: wheelAngle }}
          transition={ARC_SPRING}
          className="absolute"
          style={{
            left: ARC_CX - 268 - ARC_R,
            top: ARC_CY - ARC_R,
            width: ARC_R * 2,
            height: ARC_R * 2,
          }}
        >
          {ISO_SYMBOLS.map((item, idx) => {
            const baseDeg = 180 + idx * 60;
            const rad = (baseDeg * Math.PI) / 180;
            const cx = Math.round(ARC_R + ARC_R * Math.cos(rad));
            const cy = Math.round(ARC_R + ARC_R * Math.sin(rad));
            const rel = ((idx - activeSymbol) % ISO_SYMBOLS.length + ISO_SYMBOLS.length) % ISO_SYMBOLS.length;
            const isCenter = rel === 0;
            const isAdjacent = rel === 1 || rel === ISO_SYMBOLS.length - 1;

            const isVisible = isCenter || isAdjacent;

            return (
              <motion.button
                key={item.code}
                type="button"
                aria-label={`${item.code} ${item.label}`}
                aria-pressed={isCenter}
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                onClick={() => jumpToSymbol(idx)}
                initial={false}
                animate={{
                  rotate: -wheelAngle,
                  scale: isCenter ? 1.08 : isAdjacent ? 0.94 : 0.78,
                  opacity: isCenter ? 1 : isAdjacent ? 0.72 : 0,
                }}
                transition={ARC_SPRING}
                style={{
                  left: cx - 31,
                  top: cy - 31,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
                className={cn(
                  "absolute flex size-[62px] cursor-pointer items-center justify-center rounded-full border-[3px] border-card outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring dark:border-surface-2",
                  isCenter
                    ? "z-10 bg-invert text-invert-foreground shadow-[0_0_0_5px_rgba(23,23,23,0.08),0_10px_22px_-8px_rgba(0,0,0,0.32)]"
                    : "bg-[#EAEAEA] text-foreground/65 shadow-[0_0_0_1px_rgba(23,23,23,0.07),0_4px_10px_-4px_rgba(0,0,0,0.08)] dark:bg-surface-3 dark:text-foreground/60",
                )}
              >
                <IsoGlyph index={idx} />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Hidden sizing mirror for smooth infotip pill width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute flex h-[32px] items-center gap-1.5 whitespace-nowrap px-3"
      >
        <span className="font-mono text-[10px] leading-3">{symbol.code}</span>
        <span className="font-ui text-[11.5px] font-medium leading-4">{symbol.label}</span>
      </span>

      {/* Infotip pill anchored cleanly to the right of the prominent center icon */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute left-[358px] top-1/2 z-20 flex -translate-y-1/2 items-center"
      >
        <svg
          width="5"
          height="10"
          viewBox="0 0 5 10"
          aria-hidden="true"
          className="shrink-0 text-tooltip"
        >
          <path d="M5 0L0 5L5 10z" fill="currentColor" />
        </svg>
        <motion.div
          initial={false}
          animate={{ width: pillW }}
          transition={SPRING}
          className="flex h-[32px] items-center justify-center overflow-hidden rounded-md bg-tooltip text-tooltip-foreground shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={symbol.code}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, filter: "blur(3px)" }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
              className="flex items-center gap-1.5 whitespace-nowrap px-3"
            >
              <span className="font-mono text-[10px] leading-3 text-tooltip-foreground/65">{symbol.code}</span>
              <span className="font-ui text-[11.5px] font-medium leading-4 text-tooltip-foreground">{symbol.label}</span>
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>
    </ScaledCanvas>
  );
}

/* --------- Tile 3: Product Specifications & Operational Parameters -------- */

type WorkbookSheet = "specs" | "ops";
type CellCoord = { row: number; col: 0 | 1 | 2 };

interface SheetRow {
  cells: [string, string, string];
  notes: [string, string, string];
}

const SHEETS: Record<
  WorkbookSheet,
  { label: string; headers: [string, string, string]; rows: SheetRow[] }
> = {
  specs: {
    label: "Product Specs",
    headers: ["Attribute", "Value", "Tolerance / Standard"],
    rows: [
      {
        cells: ["Tubing Length", "150 cm", "± 2.0 cm"],
        notes: [
          "Tubing Length · Dimensional spec attribute",
          "Tubing Length · 150 cm ± 2.0 cm nominal",
          "Calibrated scale · SOP-201 tolerance",
        ],
      },
      {
        cells: ["Internal Diameter", "3.0 mm", "Microbore PVC"],
        notes: [
          "Internal Diameter · Lumen geometry",
          "Internal Diameter · 3.0 mm microbore",
          "DEHP-free medical grade PVC tubing",
        ],
      },
      {
        cells: ["Max. Pressure", "325 kPa", "47 psi · ISO 80369"],
        notes: [
          "Max. Pressure · Mechanical rating",
          "Max. Pressure · 325 kPa ≤ 400 kPa limit",
          "47 psi · ISO 80369-7 leakage verified",
        ],
      },
      {
        cells: ["Sterilization Method", "Ethylene Oxide", "ISO 11135 · SAL 10⁻⁶"],
        notes: [
          "Sterilization Method · Primary barrier",
          "Ethylene Oxide · Cycle B validated",
          "ISO 11135 · Sterility assurance 10⁻⁶",
        ],
      },
      {
        cells: ["Storage & Shelf Life", "5 °C – 40 °C", "60 months · 30–75% RH"],
        notes: [
          "Storage & Shelf Life · Stability profile",
          "Storage range · 5 °C to 40 °C controlled",
          "60 months real-time & accelerated aging",
        ],
      },
    ],
  },
  ops: {
    label: "Operational Params",
    headers: ["Parameter", "Operating Range", "Compliance / Status"],
    rows: [
      {
        cells: ["Storage Temperature", "15 °C – 30 °C", "ISO 11607-1 · Verified"],
        notes: [
          "Storage Temperature · Warehouse limit",
          "Operating band · 15 °C to 30 °C",
          "ISO 11607-1 Section 5.3 · Verified",
        ],
      },
      {
        cells: ["Relative Humidity", "30% – 65% RH", "ISTA 3A · Verified"],
        notes: [
          "Relative Humidity · Conditioning limit",
          "Humidity range · 30% to 65% non-cond.",
          "ISTA 3A environmental test · Verified",
        ],
      },
      {
        cells: ["EO Exposure Temp.", "45 °C – 55 °C", "ISO 11135 · Cycle B"],
        notes: [
          "EO Exposure Temp. · Sterilizer chamber",
          "Chamber setpoint · 45 °C to 55 °C",
          "ISO 11135 Validation Cycle B · Passed",
        ],
      },
      {
        cells: ["EO Residual Limit", "≤ 4.0 mg/dev", "ISO 10993-7 · Pending"],
        notes: [
          "EO Residual Limit · Biocompatibility",
          "Max residual · ≤ 4.0 mg per device",
          "ISO 10993-7 limited contact · Pending lab",
        ],
      },
      {
        cells: ["Transit Pressure", "70 – 106 kPa", "ASTM D6653 · In review"],
        notes: [
          "Transit Pressure · Air freight rating",
          "Altitude band · 70 kPa to 106 kPa",
          "ASTM D6653 high-altitude · In review",
        ],
      },
    ],
  },
};

const COL_LETTERS = ["A", "B", "C"] as const;

function SpecsWorkbookTile({ reduceMotion }: { reduceMotion: boolean }) {
  const [sheet, setSheet] = React.useState<WorkbookSheet>("specs");
  const [picked, setPicked] = React.useState<CellCoord | null>(null);
  const [ref, tick] = useTicker(2400, !reduceMotion && picked === null);

  const currentSheet = SHEETS[sheet];
  const activeCell: CellCoord = picked ?? {
    row: reduceMotion ? 2 : (2 + tick) % currentSheet.rows.length,
    col: 1,
  };
  const cellRef = `${COL_LETTERS[activeCell.col]}${activeCell.row + 1}`;
  const noteText = currentSheet.rows[activeCell.row].notes[activeCell.col];

  const handleSheetChange = (next: WorkbookSheet) => {
    setSheet(next);
    setPicked((prev) => (prev ? { row: prev.row, col: prev.col } : { row: 2, col: 1 }));
  };

  return (
    <ScaledCanvas ref={ref} width={560} height={358} minScale={0.62} panX={280} panBelow={640}>
      <div className="absolute inset-x-5 top-2 flex flex-col items-center gap-3">
        <div className={cn("w-full rounded-[15px] p-[5px] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
          <div className="overflow-hidden rounded-[11px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
            <div className="flex h-9 items-center justify-between border-b border-separator px-3 dark:border-edge-1">
              <div className="flex h-full items-center gap-4">
                {(["specs", "ops"] as const).map((key) => {
                  const isCurrent = sheet === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isCurrent}
                      onClick={() => handleSheetChange(key)}
                      className={cn(
                        "relative flex h-full cursor-pointer items-center rounded-sm font-ui text-[11.5px] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                        isCurrent ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {SHEETS[key].label}
                      {isCurrent && (
                        <motion.span
                          layoutId="specs-sheet-underline"
                          transition={SPRING}
                          className="absolute inset-x-0 bottom-0 h-[1.5px] bg-foreground"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 items-center gap-1 rounded-md border border-stroke-primary bg-subtle px-2 font-ui text-[10.5px] text-foreground dark:border-edge-2 dark:bg-surface-3">
                  <Icon icon={FilterIcon} size={11} strokeWidth={1.8} />
                  Filter
                </span>
                <span
                  title="Export Excel (.xlsx)"
                  className="flex size-6 items-center justify-center rounded-md border border-stroke-primary bg-subtle dark:border-edge-2 dark:bg-surface-3"
                >
                  <XlsxFileIcon />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[28px_156px_138px_1fr] border-b border-separator bg-subtle/80 font-ui text-[10.5px] font-medium text-muted-foreground dark:border-edge-1 dark:bg-surface-3/40">
              <span className="flex h-7 items-center justify-center border-r border-separator dark:border-edge-1">#</span>
              {currentSheet.headers.map((header, i) => (
                <span
                  key={header}
                  className={cn(
                    "flex h-7 items-center px-2.5",
                    i < 2 && "border-r border-separator dark:border-edge-1",
                  )}
                >
                  {header}
                </span>
              ))}
            </div>

            <div className="divide-y divide-separator dark:divide-edge-1">
              {currentSheet.rows.map((row, rIdx) => {
                const isRowActive = rIdx === activeCell.row;
                return (
                  <div
                    key={`${sheet}-${row.cells[0]}`}
                    className={cn(
                      "grid h-[34px] w-full grid-cols-[28px_156px_138px_1fr] transition-colors duration-150",
                      isRowActive && "bg-subtle/50 dark:bg-surface-3/25",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center border-r border-separator font-mono text-[10px] dark:border-edge-1",
                        isRowActive ? "bg-[#F0F0F0] font-semibold text-foreground dark:bg-surface-3" : "text-placeholder",
                      )}
                    >
                      {rIdx + 1}
                    </span>
                    {([0, 1, 2] as const).map((cIdx) => {
                      const isCellSelected = isRowActive && activeCell.col === cIdx;
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          aria-pressed={isCellSelected}
                          onClick={() => setPicked({ row: rIdx, col: cIdx })}
                          className={cn(
                            "relative flex cursor-pointer items-center px-2.5 text-left outline-none transition-[background-color,transform] duration-150 hover:bg-foreground/[0.025] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:scale-[0.98]",
                            cIdx < 2 && "border-r border-separator dark:border-edge-1",
                            cIdx === 0 && (isRowActive ? "font-ui text-[11px] font-semibold text-foreground" : "font-ui text-[11px] text-foreground/85"),
                            cIdx === 1 && "font-mono text-[11px] text-foreground",
                            cIdx === 2 && "font-mono text-[10.5px] text-muted-foreground",
                          )}
                        >
                          {isCellSelected && (
                            <motion.span
                              layoutId="spec-active-cell"
                              transition={SPRING}
                              className="pointer-events-none absolute inset-0 z-10 border-[1.5px] border-foreground bg-foreground/[0.03]"
                            >
                              <span className="absolute -bottom-[2.5px] -right-[2.5px] size-[5px] bg-foreground" />
                            </motion.span>
                          )}
                          <span className="relative truncate">{row.cells[cIdx]}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="flex h-7 items-center justify-between border-t border-separator bg-subtle/60 px-3 font-ui text-[10px] text-muted-foreground dark:border-edge-1 dark:bg-surface-3/30">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-stage-released" />
                2 sheets
              </span>
              <span>✓ All changes saved</span>
            </div>
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="flex h-[28px] items-center gap-2 rounded-md bg-tooltip px-3 text-tooltip-foreground shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={`${sheet}-${cellRef}`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 3, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -3, filter: "blur(3px)" }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex items-center gap-2 whitespace-nowrap font-mono text-[10.5px] leading-3 text-tooltip-foreground"
            >
              <span className="text-tooltip-foreground/65">{cellRef}</span>
              <span>{noteText}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </ScaledCanvas>
  );
}

/* --------------------- Tile 4: Annotated Label Tags ---------------------- */

type LabelTabKey = "pouch" | "carton" | "device";

interface LabelPreset {
  tabLabel: string;
  dimensions: string;
  title: string;
  subtitle: string;
  footerLeft: string;
  footerRight: string;
  legend: { label: string; border: string; bg: string; swatch: string }[];
}

const LABEL_PRESETS: Record<LabelTabKey, LabelPreset> = {
  pouch: {
    tabLabel: "Pouch",
    dimensions: "100 × 70 mm",
    title: "Aspiration Catheter 6F",
    subtitle: "Thrombus Aspiration Catheter · 140 cm",
    footerLeft: "MedAxis Medical Ltd., Galway, Ireland",
    footerRight: "QTY: 1 · Rx Only",
    legend: [
      { label: "REF / Product Plan No.", border: "border-blue-500", bg: "bg-blue-500/[0.07]", swatch: "#3B82F6" },
      { label: "Sterilization & Symbols", border: "border-emerald-500", bg: "bg-emerald-500/[0.07]", swatch: "#10B981" },
      { label: "LOT & Expiry Block", border: "border-amber-500", bg: "bg-amber-500/[0.07]", swatch: "#F59E0B" },
      { label: "UDI-DI & GS1 Barcode", border: "border-foreground", bg: "bg-foreground/[0.03]", swatch: "var(--foreground)" },
    ],
  },
  carton: {
    tabLabel: "Carton",
    dimensions: "120 × 85 mm",
    title: "Aspiration Catheter 6F · Box",
    subtitle: "Shelf Unit Carton · 5 Sterile Pouches",
    footerLeft: "EC REP · MedAxis Europe GmbH, Munich",
    footerRight: "QTY: 5 Units",
    legend: [
      { label: "Box Qty & Catalog REF", border: "border-blue-500", bg: "bg-blue-500/[0.07]", swatch: "#3B82F6" },
      { label: "Storage & Temp Limits", border: "border-emerald-500", bg: "bg-emerald-500/[0.07]", swatch: "#10B981" },
      { label: "EU Auth. Rep & Batch", border: "border-amber-500", bg: "bg-amber-500/[0.07]", swatch: "#F59E0B" },
      { label: "Outer Case GS1-128", border: "border-foreground", bg: "bg-foreground/[0.03]", swatch: "var(--foreground)" },
    ],
  },
  device: {
    tabLabel: "Device Label",
    dimensions: "45 × 18 mm",
    title: "Catheter Hub Tag · 6F",
    subtitle: "Direct Part Marking · Single-Use Sterile",
    footerLeft: "MedAxis Medical Ltd.",
    footerRight: "0.014″ GW",
    legend: [
      { label: "French Size & REF", border: "border-blue-500", bg: "bg-blue-500/[0.07]", swatch: "#3B82F6" },
      { label: "Single-Use & CE Mark", border: "border-emerald-500", bg: "bg-emerald-500/[0.07]", swatch: "#10B981" },
      { label: "Lot Traceability Code", border: "border-amber-500", bg: "bg-amber-500/[0.07]", swatch: "#F59E0B" },
      { label: "UDI-DI Linear Carrier", border: "border-foreground", bg: "bg-foreground/[0.03]", swatch: "var(--foreground)" },
    ],
  },
};

const BARCODE = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1, 2, 1, 3];

interface ZoneRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function getRelativeRect(el: HTMLElement, container: HTMLElement): ZoneRect {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

function SelectionHandles({ color }: { color: string }) {
  return (
    <>
      <span
        className="absolute -left-[3.5px] -top-[3.5px] size-[7px] rounded-[1px] border-[1.4px] bg-white dark:bg-surface-2"
        style={{ borderColor: color }}
      />
      <span
        className="absolute -right-[3.5px] -top-[3.5px] size-[7px] rounded-[1px] border-[1.4px] bg-white dark:bg-surface-2"
        style={{ borderColor: color }}
      />
      <span
        className="absolute -bottom-[3.5px] -left-[3.5px] size-[7px] rounded-[1px] border-[1.4px] bg-white dark:bg-surface-2"
        style={{ borderColor: color }}
      />
      <span
        className="absolute -bottom-[3.5px] -right-[3.5px] size-[7px] rounded-[1px] border-[1.4px] bg-white dark:bg-surface-2"
        style={{ borderColor: color }}
      />
    </>
  );
}

type DragStage =
  | { mode: "idle"; legendCount: number; completedCount: number }
  | { mode: "moving"; legendCount: number; completedCount: number; targetIdx: number }
  | { mode: "dragging"; legendCount: number; completedCount: number; targetIdx: number }
  | { mode: "settled"; legendCount: number; completedCount: number; targetIdx: number };

const DRAG_EASE = [0.25, 0.1, 0.25, 1] as const;

function AnnotatedLabelTagsTile({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const artworkRef = React.useRef<HTMLDivElement>(null);
  const zoneRefs = React.useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const inView = useInView(ref, { margin: "-60px" });
  const [labelTab, setLabelTab] = React.useState<LabelTabKey>("pouch");
  const [runKey, setRunKey] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [rects, setRects] = React.useState<(ZoneRect | null)[]>([null, null, null, null]);
  const [stage, setStage] = React.useState<DragStage>(
    reduceMotion
      ? { mode: "idle", legendCount: 4, completedCount: 4 }
      : { mode: "idle", legendCount: 0, completedCount: 0 },
  );

  const preset = LABEL_PRESETS[labelTab];

  React.useLayoutEffect(() => {
    const container = artworkRef.current;
    if (!container) return;
    const measure = () => {
      setRects(
        zoneRefs.current.map((el) => (el ? getRelativeRect(el, container) : null)),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [labelTab]);

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
      setStage({ mode: "idle", legendCount: 0, completedCount: 0 });

      const drawStep = (idx: number) => {
        if (idx >= 4) {
          wait(3200, run);
          return;
        }
        // 1. Add legend entry and glide cursor to zone top-left
        setStage({ mode: "moving", legendCount: idx + 1, completedCount: idx, targetIdx: idx });
        wait(620, () => {
          // 2. Smoothly drag cursor diagonally to bottom-right while rectangle grows 1:1
          setStage({ mode: "dragging", legendCount: idx + 1, completedCount: idx, targetIdx: idx });
          wait(960, () => {
            // 3. Release and let crisp corner handles settle
            setStage({ mode: "settled", legendCount: idx + 1, completedCount: idx + 1, targetIdx: idx });
            wait(540, () => drawStep(idx + 1));
          });
        });
      };

      wait(420, () => drawStep(0));
    };

    wait(0, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion, labelTab, runKey]);

  const effectiveStage: DragStage = reduceMotion
    ? { mode: "idle", legendCount: 4, completedCount: 4 }
    : stage;

  const effectiveLegendCount = effectiveStage.legendCount;
  const effectiveCompletedCount = effectiveStage.completedCount;
  const currentTarget = effectiveStage.mode === "idle" ? -1 : effectiveStage.targetIdx;
  const activeIdx = hovered ?? (currentTarget >= 0 ? currentTarget : effectiveCompletedCount - 1);
  const activeColor = activeIdx >= 0 ? preset.legend[activeIdx].swatch : "#3B82F6";

  const showCursor =
    !reduceMotion &&
    effectiveStage.mode !== "idle" &&
    hovered === null &&
    rects[effectiveStage.targetIdx] !== null;

  const cursorRect =
    effectiveStage.mode !== "idle" ? rects[effectiveStage.targetIdx] : null;
  const cursorX = cursorRect
    ? effectiveStage.mode === "moving"
      ? cursorRect.left
      : cursorRect.left + cursorRect.width
    : 16;
  const cursorY = cursorRect
    ? effectiveStage.mode === "moving"
      ? cursorRect.top
      : cursorRect.top + cursorRect.height
    : 16;

  const handleSelectTab = (next: LabelTabKey) => {
    setLabelTab(next);
    setHovered(null);
    setRunKey((v) => v + 1);
  };

  return (
    <ScaledCanvas ref={ref} width={560} height={358} minScale={0.62} panX={280} panBelow={640}>
      <div className="absolute inset-x-5 top-1.5 flex flex-col items-center gap-2.5">
        {/* Realistic annotation toolbar: Cursor, Rectangle, Circle, Callout, Color swatch */}
        <div className="flex h-8 items-center gap-1 rounded-[10px] border border-border bg-white px-2 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2">
          <span
            title="Select"
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <path d="M3.5 2.5L12.5 8L8.5 9L7 13L3.5 2.5Z" />
            </svg>
          </span>
          <span
            title="Rectangle zone"
            className="flex size-6 items-center justify-center rounded-md bg-[#1A1A1A] text-white dark:bg-[#EDEDED] dark:text-[#141414]"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.5" y="3.5" width="11" height="9" rx="1.8" />
            </svg>
          </span>
          <span
            title="Circle zone"
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8" cy="8" r="5" />
            </svg>
          </span>
          <span
            title="Callout tag"
            className="flex h-6 items-center gap-1 rounded-md border border-stroke-primary bg-subtle px-2 font-ui text-[10px] font-medium text-foreground dark:border-edge-2 dark:bg-surface-3"
          >
            <Icon icon={Tag01Icon} size={11} strokeWidth={1.8} />
            Callout
          </span>
          <span className="mx-0.5 h-3.5 w-px bg-separator dark:bg-edge-2" />
          <span
            title="Zone color"
            className="flex h-6 items-center gap-1.5 rounded-md border border-stroke-primary bg-subtle px-1.5 dark:border-edge-2 dark:bg-surface-3"
          >
            <motion.span
              className="size-3 rounded-full"
              animate={{ backgroundColor: activeColor }}
              transition={{ duration: 0.25 }}
            />
            <span className="font-mono text-[9.5px] text-muted-foreground">Color</span>
          </span>
          <span className="mx-0.5 h-3.5 w-px bg-separator dark:bg-edge-2" />
          <span className="px-1 font-mono text-[10px] text-muted-foreground">100%</span>
        </div>

        {/* Main canvas frame (thin p-[5px] landing-page ring) */}
        <div className={cn("w-full rounded-[15px] p-[5px] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.12)]", FRAME)}>
          <div className="overflow-hidden rounded-[11px] border border-border bg-[#FAFAFA] dark:border-edge-2 dark:bg-surface-1">
            <div className="flex h-8 items-center justify-between border-b border-separator bg-white px-3 dark:border-edge-1 dark:bg-surface-2">
              <div className="flex h-full items-center gap-3.5 font-ui text-[11px]">
                {(["pouch", "carton", "device"] as const).map((key) => {
                  const isCurrent = labelTab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isCurrent}
                      onClick={() => handleSelectTab(key)}
                      className={cn(
                        "relative flex h-full cursor-pointer items-center rounded-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                        isCurrent ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {LABEL_PRESETS[key].tabLabel}
                      {isCurrent && (
                        <motion.span
                          layoutId="label-tag-preset-underline"
                          transition={SPRING}
                          className="absolute inset-x-0 bottom-0 h-[1.5px] bg-foreground"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{preset.dimensions}</span>
            </div>

            <div className="relative flex h-[238px] items-center gap-3 p-3.5">
              {/* Label artwork (overflow-visible so corner selection handles never clip) */}
              <div
                ref={artworkRef}
                className="relative flex flex-1 flex-col justify-between self-stretch overflow-visible rounded-xl border border-border bg-white p-3 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.12)] dark:border-edge-2 dark:bg-surface-2"
              >
                <div className="flex items-start justify-between gap-2 pb-2">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-ui text-[12px] font-semibold leading-4 text-foreground">
                      {preset.title}
                    </span>
                    <span className="truncate font-ui text-[9px] leading-3 text-muted-foreground">
                      {preset.subtitle}
                    </span>
                  </div>
                  <div
                    ref={(el) => {
                      zoneRefs.current[0] = el;
                    }}
                    className="relative flex h-6 shrink-0 items-center gap-1 rounded-[5px] px-1.5 font-mono text-[8.5px]"
                  >
                    <span className="rounded-[2px] border border-foreground/50 px-0.5 text-[7px]">
                      {labelTab === "carton" ? "QTY 5" : labelTab === "device" ? "6F" : "REF"}
                    </span>
                    <span className="font-medium text-foreground">
                      {labelTab === "carton" ? "CTN-1042" : labelTab === "device" ? "PX-2042" : "PPN1042001"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[1.2fr_1fr] gap-2 border-t border-separator pt-2 dark:border-edge-1">
                  <div
                    ref={(el) => {
                      zoneRefs.current[1] = el;
                    }}
                    className="relative flex h-10 items-center justify-center gap-1.5 rounded-md px-2"
                  >
                    {labelTab === "carton" ? (
                      <>
                        <span className="font-mono text-[7.5px] font-semibold">5°C–40°C</span>
                        <span className="rounded-[2px] border border-foreground/60 px-1 font-mono text-[7px]">DRY</span>
                      </>
                    ) : labelTab === "device" ? (
                      <>
                        <span className="rounded-full border border-foreground/70 px-1 font-mono text-[7px]">②</span>
                        <span className="font-ui text-[8px] font-bold">CE 0123</span>
                      </>
                    ) : (
                      <>
                        <span className="rounded-[2px] border border-foreground/70 px-1 font-mono text-[7px] font-semibold">
                          STERILE | EO
                        </span>
                        <span className="rounded-[2px] border border-foreground/70 px-0.5 font-mono text-[7px] font-semibold">
                          MD
                        </span>
                        <span className="font-ui text-[8px] font-bold">CE 0123</span>
                      </>
                    )}
                  </div>

                  <div
                    ref={(el) => {
                      zoneRefs.current[2] = el;
                    }}
                    className="relative flex h-10 flex-col justify-center rounded-md px-2 font-mono text-[8px] leading-[11px] text-foreground"
                  >
                    <span>{labelTab === "carton" ? "EC REP · DE" : "LOT 26K084-IE"}</span>
                    <span>{labelTab === "device" ? "SN 004192" : "EXP 2029-11-30"}</span>
                  </div>
                </div>

                <div
                  ref={(el) => {
                    zoneRefs.current[3] = el;
                  }}
                  className="relative mt-2 flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2"
                >
                  <div className="flex h-6 items-center gap-[1.5px]">
                    {BARCODE.map((w, i) => (
                      <span key={i} className="h-full bg-foreground" style={{ width: w }} />
                    ))}
                  </div>
                  <span className="font-mono text-[7.5px] leading-3 text-muted-foreground">
                    {labelTab === "carton"
                      ? "(01)18401234567897(17)291130(30)05"
                      : "(01)08401234567890(17)291130(10)26K084"}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between font-ui text-[7.5px] text-muted-foreground">
                  <span className="truncate">{preset.footerLeft}</span>
                  <span className="shrink-0">{preset.footerRight}</span>
                </div>

                {/* Unclipped annotation rectangles + cursor-dragged drawing overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
                  {preset.legend.map((item, idx) => {
                    const rect = rects[idx];
                    if (!rect) return null;
                    const isCompleted = idx < effectiveCompletedCount;
                    const isDraggingNow =
                      effectiveStage.mode === "dragging" && effectiveStage.targetIdx === idx;
                    const isVisible = isCompleted || isDraggingNow;
                    if (!isVisible) return null;

                    const isSelected = idx === activeIdx && isCompleted;

                    return (
                      <div
                        key={`${labelTab}-box-${idx}`}
                        style={{
                          left: rect.left,
                          top: rect.top,
                          width: rect.width,
                          height: rect.height,
                        }}
                        className="absolute overflow-visible"
                      >
                        <motion.div
                          initial={
                            reduceMotion
                              ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
                              : { clipPath: "inset(0% 100% 100% 0%)", opacity: 0.9 }
                          }
                          animate={{
                            clipPath: "inset(0% 0% 0% 0%)",
                            opacity: 1,
                          }}
                          transition={
                            isDraggingNow
                              ? { duration: 0.95, ease: DRAG_EASE }
                              : { duration: 0.2, ease: EASE_OUT }
                          }
                          className={cn(
                            "absolute inset-0 rounded-md border-[1.5px]",
                            item.border,
                            item.bg,
                          )}
                        />
                        {isSelected && <SelectionHandles color={item.swatch} />}
                      </div>
                    );
                  })}

                  {/* Precision cursor pointer gliding and dragging each rectangle */}
                  <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      x: cursorX,
                      y: cursorY,
                      opacity: showCursor ? 1 : 0,
                      scale: effectiveStage.mode === "dragging" ? 0.94 : 1,
                    }}
                    transition={{
                      x: {
                        duration: effectiveStage.mode === "dragging" ? 0.95 : 0.52,
                        ease: effectiveStage.mode === "dragging" ? DRAG_EASE : EASE_OUT,
                      },
                      y: {
                        duration: effectiveStage.mode === "dragging" ? 0.95 : 0.52,
                        ease: effectiveStage.mode === "dragging" ? DRAG_EASE : EASE_OUT,
                      },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.16 },
                    }}
                    className="absolute left-0 top-0 z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="-translate-x-[2px] -translate-y-[2px]"
                    >
                      <path
                        d="M2.5 2L14.5 7.8L9.1 9.5L7.4 15L2.5 2Z"
                        fill="#171717"
                        stroke="#FFFFFF"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Right legend card: items populate one-by-one before drawing on label */}
              <div className="flex w-[166px] shrink-0 flex-col justify-between gap-2 self-stretch">
                <div className="flex flex-1 flex-col gap-1.5 rounded-xl border border-border bg-white p-2.5 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.1)] dark:border-edge-2 dark:bg-surface-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-ui text-[10.5px] font-semibold text-foreground">Legend</span>
                    <span className="font-mono text-[9.5px] text-muted-foreground tabular-nums">
                      {effectiveLegendCount} / 4
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {preset.legend.map((item, idx) => {
                      const shown = idx < effectiveLegendCount;
                      const isSelected = idx === activeIdx && shown;
                      return (
                        <motion.button
                          key={`${labelTab}-${item.label}`}
                          type="button"
                          disabled={!shown}
                          aria-pressed={isSelected}
                          onClick={() => shown && setHovered((prev) => (prev === idx ? null : idx))}
                          onMouseEnter={() => shown && setHovered(idx)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => shown && setHovered(idx)}
                          onBlur={() => setHovered(null)}
                          initial={false}
                          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                          transition={{ duration: 0.28, ease: EASE_OUT }}
                          className={cn(
                            "flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left outline-none transition-[color,background-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] disabled:pointer-events-none",
                            isSelected
                              ? "bg-muted font-medium text-foreground dark:bg-surface-3"
                              : "text-muted-foreground hover:bg-subtle",
                          )}
                        >
                          <span className={cn("h-2.5 w-3.5 shrink-0 rounded-[3px] border-[1.5px]", item.border, item.bg)} />
                          <span className="truncate font-ui text-[9.5px] leading-3">{item.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-white px-2.5 py-1.5 dark:border-edge-2 dark:bg-surface-2">
                  <span className="font-ui text-[9.5px] text-muted-foreground">Show on canvas</span>
                  <span className="flex h-3.5 w-6 items-center justify-end rounded-full bg-foreground p-0.5">
                    <span className="size-2.5 rounded-full bg-background" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

/* ------------------------------- Section --------------------------------- */

export default function ProductsAttributesSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="products-attributes-heading" className="contents">
        <SectionHeader
          id="products-attributes-heading"
          anchorId="attributes"
          title="Every label attribute"
          mutedTitle="in its own structured tab."
        >
          Replace inconsistent Word tables and multi-tab Excel workbooks with
          seven purpose-built sections covering compliance, ISO symbols,
          workbook specs, and annotated label tags.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Product info & compliance standards"
            body="Capture Basic UDI-DI, device class, OEM, custom fields, applicable standards, and required label languages."
            maxWidth={500}
            className="pb-4 sm:pb-6"
          >
            <ProductInfoCompliance reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Label components, symbols & graphics"
            body="Define pouch, carton, and IFU component dimensions alongside ISO 15223-1 symbols, schematics, and GS1 barcodes."
            maxWidth={500}
            className="pb-4 sm:pb-6"
          >
            <LabelComponentsSymbols reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Product specifications & operational parameters"
            body="Edit structured device dimensions, materials, sterilization method, shelf life, and storage bounds inside built-in workbook grids."
            maxWidth={520}
            className="pb-4 sm:pb-6"
          >
            <SpecsWorkbookTile reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Annotated label tags"
            body="Draw color-coded callout regions directly onto uploaded label artwork and map each zone to its structured legend entry."
            maxWidth={520}
            className="pb-4 sm:pb-6"
          >
            <AnnotatedLabelTagsTile reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
