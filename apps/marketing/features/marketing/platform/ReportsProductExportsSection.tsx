"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  CubeIcon,
  GridTableIcon,
  Layers01Icon,
  Note01Icon,
  Settings01Icon,
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
import { StatusBadge } from "@/features/marketing/landing-page/StatusBadge";
import { DocumentTileIcon } from "./DocumentTileIcon";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PULSE_EASE = [0.45, 0, 0.25, 1] as const;
const WHEEL_SPRING = { type: "spring" as const, duration: 0.68, bounce: 0 };
const PILL_SPRING = { type: "spring" as const, duration: 0.32, bounce: 0 };

const DOSSIER_TABS: { code: string; label: string; icon: IconSvgElement }[] = [
  { code: "Tab 01", label: "Product Information", icon: Note01Icon },
  { code: "Tab 02", label: "Compliance Standards", icon: CheckmarkBadge01Icon },
  { code: "Tab 03", label: "Label Components", icon: CubeIcon },
  { code: "Tab 04", label: "Symbols & Graphics", icon: Layers01Icon },
  { code: "Tab 05", label: "Product Specifications", icon: GridTableIcon },
  { code: "Tab 06", label: "Operational Parameters", icon: Settings01Icon },
  { code: "Tab 07", label: "Annotated Label Tags", icon: Tag01Icon },
];

const WHEEL_R = 98;
const WHEEL_CENTER = 136;
const INNER_SPOKE_R = 46;
const OUTER_SPOKE_R = 76;
const STEP_DEG = 360 / DOSSIER_TABS.length;

const WHEEL_SPOKES = DOSSIER_TABS.map((tab, idx) => {
  const rad = ((-90 + idx * STEP_DEG) * Math.PI) / 180;
  const x1 = Math.round(WHEEL_CENTER + INNER_SPOKE_R * Math.cos(rad));
  const y1 = Math.round(WHEEL_CENTER + INNER_SPOKE_R * Math.sin(rad));
  const x2 = Math.round(WHEEL_CENTER + OUTER_SPOKE_R * Math.cos(rad));
  const y2 = Math.round(WHEEL_CENTER + OUTER_SPOKE_R * Math.sin(rad));
  return {
    key: tab.code,
    d: `M${x1} ${y1}L${x2} ${y2}`,
  };
});

function PdfDossierWheel({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [step, setStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion || !inView || paused) return;
    const id = setInterval(() => setStep((v) => v + 1), 2500);
    return () => clearInterval(id);
  }, [reduceMotion, inView, paused]);

  const activeIdx = ((step % DOSSIER_TABS.length) + DOSSIER_TABS.length) % DOSSIER_TABS.length;
  const activeTab = DOSSIER_TABS[activeIdx];
  const wheelAngle = reduceMotion ? 0 : -step * STEP_DEG;

  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [pillW, setPillW] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setPillW(Math.ceil(el.offsetWidth));
  }, [activeIdx]);

  const jumpTo = (targetIdx: number) => {
    const half = Math.floor(DOSSIER_TABS.length / 2);
    const diff =
      (((targetIdx - activeIdx + DOSSIER_TABS.length + half) % DOSSIER_TABS.length) - half);
    if (diff === 0) return;
    setStep((v) => v + diff);
  };

  const activeSpokeIdx = reduceMotion ? activeIdx : 0;

  return (
    <ScaledCanvas
      ref={ref}
      width={480}
      height={326}
      minScale={0.68}
      panX={240}
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
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 top-[14px] z-20 flex flex-col items-center"
      >
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute flex h-[30px] items-center gap-2 whitespace-nowrap px-3"
        >
          <span className="font-mono text-[10px] uppercase leading-3">{activeTab.code}</span>
          <span className="h-2.5 w-px shrink-0" />
          <span className="font-ui text-[12px] font-medium leading-4">{activeTab.label}</span>
        </span>

        <motion.div
          initial={false}
          animate={pillW ? { width: pillW } : undefined}
          transition={PILL_SPRING}
          className="relative flex h-[30px] items-center justify-center overflow-hidden rounded-md bg-tooltip text-tooltip-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={activeTab.code}
              className="flex items-center gap-2 whitespace-nowrap px-3"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, filter: "blur(3px)" }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <span className="font-mono text-[10px] uppercase leading-3 text-tooltip-foreground/65">
                {activeTab.code}
              </span>
              <span className="h-2.5 w-px shrink-0 bg-white/15" />
              <span className="font-ui text-[12px] font-medium leading-4 text-tooltip-foreground">
                {activeTab.label}
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

      <div className="absolute left-1/2 top-[44px] size-[272px] -translate-x-1/2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[272px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(23,23,23,0.06)_0%,transparent_66%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(237,237,237,0.07)_0%,transparent_66%)]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[196px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-stroke-strong dark:border-edge-3"
        />

        <svg
          width="272"
          height="272"
          viewBox="0 0 272 272"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          {WHEEL_SPOKES.map((spoke, idx) => (
            <DottedConnector
              key={idx === activeSpokeIdx ? `${spoke.key}-${step}` : spoke.key}
              d={spoke.d}
              active={idx === activeSpokeIdx}
              canvasWidth={272}
              canvasHeight={272}
              baseOpacity={0.18}
              activeOpacity={0.82}
              transition={{ duration: 0.42, delay: idx === activeSpokeIdx ? 0.1 : 0, ease: PULSE_EASE }}
            />
          ))}

          {!reduceMotion && inView && (
            <motion.g
              key={step}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: -(OUTER_SPOKE_R - INNER_SPOKE_R),
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                y: { duration: 0.42, delay: 0.14, ease: PULSE_EASE },
                opacity: { duration: 0.42, delay: 0.14, times: [0, 0.18, 0.82, 1], ease: "linear" },
              }}
            >
              <circle
                cx={WHEEL_CENTER}
                cy={WHEEL_CENTER - INNER_SPOKE_R}
                r="4.5"
                fill="currentColor"
                fillOpacity={0.09}
              />
              <circle
                cx={WHEEL_CENTER}
                cy={WHEEL_CENTER - INNER_SPOKE_R}
                r="2"
                fill="currentColor"
              />
            </motion.g>
          )}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 flex size-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/65 p-[5px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_12px_28px_-12px_rgba(0,0,0,0.22)] dark:bg-[#14141499] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_12px_28px_-12px_rgba(0,0,0,0.4)]">
          <div className="flex size-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7F7F7_0%,#E9E9E9_100%)] shadow-[inset_0_0_0_1px_#FFFFFF,inset_0_-2px_6px_rgba(0,0,0,0.06)] dark:bg-[linear-gradient(180deg,#191919_0%,#212121_100%)] dark:shadow-[inset_0_0_0_1px_#141414,inset_0_-2px_6px_rgba(0,0,0,0.1)]">
            <DocumentTileIcon kind="pdf" size="md" className="translate-x-[3px]" />
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ rotate: wheelAngle }}
          transition={WHEEL_SPRING}
          className="absolute inset-0"
        >
          {DOSSIER_TABS.map((tab, idx) => {
            const deg = -90 + idx * STEP_DEG;
            const rad = (deg * Math.PI) / 180;
            const cx = Math.round(WHEEL_CENTER + WHEEL_R * Math.cos(rad));
            const cy = Math.round(WHEEL_CENTER + WHEEL_R * Math.sin(rad));
            const isActive = idx === activeIdx;

            return (
              <div
                key={tab.code}
                className="absolute size-[42px]"
                style={{ left: cx - 21, top: cy - 21 }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: -wheelAngle }}
                  transition={WHEEL_SPRING}
                  className="relative size-full"
                >
                  <motion.button
                    type="button"
                    aria-label={tab.label}
                    aria-pressed={isActive}
                    onClick={() => jumpTo(idx)}
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    transition={{ type: "spring", duration: 0.24, bounce: 0 }}
                    className="size-full cursor-pointer rounded-full bg-white/75 p-[3px] shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_4px_10px_-4px_rgba(0,0,0,0.16)] outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-[#141414B3] dark:shadow-[0_0_0_1px_rgba(237,237,237,0.06),0_4px_10px_-4px_rgba(0,0,0,0.3)]"
                  >
                    <span className="relative flex size-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F4F4_100%)] shadow-[inset_0_0_0_1px_rgba(23,23,23,0.08)] dark:bg-[linear-gradient(180deg,#141414_0%,#1B1B1B_100%)] dark:shadow-[inset_0_0_0_1px_rgba(237,237,237,0.08)]">
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 0.9,
                        }}
                        transition={{ duration: 0.24, ease: EASE_OUT }}
                        className="absolute inset-0 rounded-full bg-invert shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_4px_rgba(23,23,23,0.08)]"
                      />
                      <span
                        className={cn(
                          "relative z-10 flex transition-colors duration-200 ease-out",
                          isActive ? "text-invert-foreground" : "text-foreground/75",
                        )}
                      >
                        <Icon icon={tab.icon} size={15} strokeWidth={1.7} />
                      </span>
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </ScaledCanvas>
  );
}

const EXCEL_SHEETS = [
  {
    title: "Product Specifications",
    file: "PX-2042_Product_Specifications_v4.xlsx",
    chips: ["28 rows", "6 columns", "v4 Released"],
  },
  {
    title: "Operational Parameters",
    file: "PX-2042_Operational_Parameters_v4.xlsx",
    chips: ["14 rows", "4 columns", "v4 Released"],
  },
  {
    title: "Compliance Matrix",
    file: "PX-2042_Compliance_Matrix_v4.xlsx",
    chips: ["19 rows", "5 columns", "v4 Released"],
  },
] as const;

function MiniExcelSheetTile({
  status,
  animateSpinner,
}: {
  status: "done" | "busy" | "queued";
  animateSpinner: boolean;
}) {
  return (
    <div className="relative flex h-[62px] w-[52px] shrink-0 flex-col gap-1 rounded-[10px] border border-separator bg-file-frame p-1.5 shadow-[0_2px_6px_-3px_rgba(0,0,0,0.08)] dark:border-edge-2">
      <div className="flex flex-1 flex-col gap-1 rounded-[6px] bg-card p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-surface-2">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="flex gap-0.5">
            {[0, 1, 2].map((col) => (
              <span
                key={col}
                className={cn(
                  "h-[4px] flex-1 rounded-[1px]",
                  row === 0 ? "bg-success/30" : "bg-foreground/[0.09]",
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
        <motion.div
          initial={false}
          animate={{ scaleX: status === "done" ? 1 : status === "busy" ? 0.68 : 0.08 }}
          transition={{ duration: status === "busy" ? 1.25 : 0.45, ease: EASE_OUT }}
          className={cn(
            "h-full origin-left rounded-full",
            status === "done" ? "bg-stage-released" : "bg-foreground",
          )}
        />
      </div>

      {status !== "queued" && (
        <span
          className={cn(
            "absolute -left-2 top-1/2 flex size-[20px] -translate-y-1/2 items-center justify-center rounded-full shadow-[0_0_0_2px_var(--card),0_2px_6px_rgba(0,0,0,0.16)] transition-colors duration-300",
            status === "done"
              ? "bg-stage-released text-white"
              : "bg-invert text-invert-foreground",
          )}
        >
          {status === "done" ? (
            <Icon icon={Tick02Icon} size={11} strokeWidth={2.5} />
          ) : animateSpinner ? (
            <svg
              width="11"
              height="11"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="animate-spin [animation-duration:850ms] motion-reduce:animate-none"
            >
              <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth="2.4" />
              <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          ) : null}
        </span>
      )}
    </div>
  );
}

const SLOT_Y = {
  top: 12,
  center: 106,
  bottom: 224,
} as const;

function ExcelExportStack({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [cursor, setCursor] = React.useState(0);
  const [centerDone, setCenterDone] = React.useState(reduceMotion);

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
      setCenterDone(false);
      wait(1550, () => {
        setCenterDone(true);
        wait(1250, () => {
          setCursor((v) => v + 1);
          wait(50, run);
        });
      });
    };

    wait(100, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const currentCursor = reduceMotion ? 0 : cursor;
  const isCenterDone = reduceMotion || centerDone;
  const visibleItems = [-1, 0, 1].map((offset) => {
    const seq = currentCursor + offset;
    const sheetIdx = ((seq % EXCEL_SHEETS.length) + EXCEL_SHEETS.length) % EXCEL_SHEETS.length;
    return {
      seq,
      offset,
      sheet: EXCEL_SHEETS[sheetIdx],
    };
  });

  return (
    <ScaledCanvas
      ref={ref}
      width={480}
      height={326}
      minScale={0.68}
      panX={240}
      panBelow={640}
      aria-hidden="true"
      className="[mask-image:linear-gradient(transparent_0%,#000_14%,#000_86%,transparent_100%)]"
    >
      <div className="relative h-full w-full">
        <AnimatePresence initial={false}>
          {visibleItems.map(({ seq, offset, sheet }) => {
            const isTop = offset === -1;
            const isCenter = offset === 0;
            const status: "done" | "busy" | "queued" = isTop
              ? "done"
              : isCenter
                ? isCenterDone
                  ? "done"
                  : "busy"
                : "queued";
            const targetY = isTop ? SLOT_Y.top : isCenter ? SLOT_Y.center : SLOT_Y.bottom;
            const targetOpacity = isCenter ? 1 : isTop ? 0.42 : 0.38;

            return (
              <motion.div
                key={seq}
                initial={
                  reduceMotion
                    ? false
                    : { y: SLOT_Y.bottom + 84, opacity: 0, scale: 0.94 }
                }
                animate={{
                  y: targetY,
                  opacity: targetOpacity,
                  scale: isCenter ? 1 : 0.96,
                }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { y: SLOT_Y.top - 84, opacity: 0, scale: 0.94 }
                }
                transition={{ duration: 0.62, ease: EASE_OUT }}
                className="absolute inset-x-10 top-0"
              >
                <div
                  className={cn(
                    "rounded-[15px] p-1 transition-[border-color,background-color,box-shadow] duration-400",
                    isCenter
                      ? "border border-foreground/5 bg-frame-surface shadow-[0_14px_30px_-16px_rgba(0,0,0,0.14)] dark:border-edge-1 dark:bg-surface-1/75"
                      : "border border-transparent bg-transparent shadow-none",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-4 rounded-[11px] px-4 py-2.5 transition-[border-color,background-color] duration-400",
                      isCenter
                        ? "border border-border bg-card dark:border-edge-2 dark:bg-surface-2"
                        : "border border-transparent bg-transparent",
                    )}
                  >
                    <MiniExcelSheetTile status={status} animateSpinner={inView && !reduceMotion} />

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-ui text-[12.5px] font-semibold leading-4 text-foreground">
                          {sheet.title}
                        </span>
                        <StatusBadge
                          tone={status === "done" ? "released" : status === "busy" ? "review" : "draft"}
                          size="xs"
                        >
                          {status === "done"
                            ? "Ready"
                            : status === "busy"
                              ? "Exporting"
                              : "Queued"}
                        </StatusBadge>
                      </div>

                      <span className="truncate font-mono text-[10px] leading-3.5 text-muted-foreground">
                        {sheet.file}
                      </span>

                      {isCenter && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          {sheet.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-md border border-separator bg-subtle px-1.5 py-0.5 font-mono text-[9.5px] leading-3 text-muted-foreground dark:border-edge-1 dark:bg-surface-3"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ScaledCanvas>
  );
}

export default function ReportsProductExportsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="reports-product-exports-heading" className="contents">
        <SectionHeader
          id="reports-product-exports-heading"
          anchorId="product-exports"
          title="Complete product exports"
          mutedTitle="built for external handoff."
        >
          Distinct from portfolio reports: generate a complete, controlled export
          of one individual product version for Notified Bodies, auditors, QMS
          filing, print vendors, and ERPs.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Complete product PDF dossier"
            body="One-click submission-ready PDF of all 7 tabs for a single version."
            maxWidth={460}
            className="pb-4 sm:pb-6"
          >
            <PdfDossierWheel reduceMotion={reduceMotion} />
          </GovTile>

          <GovTile
            title="Specifications & parameters Excel"
            body="Export Product Specifications and Operational Parameters tabs to Excel."
            maxWidth={460}
            className="pb-4 sm:pb-6"
          >
            <ExcelExportStack reduceMotion={reduceMotion} />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
