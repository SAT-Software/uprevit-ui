"use client";

import * as React from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  ArrowRight02Icon,
  GridTableIcon,
  Note01Icon,
  SecurityCheckIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { DottedConnector } from "@/features/marketing/landing-page/DottedConnector";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { SectionPoints, type SectionPoint } from "@/features/marketing/landing-page/SectionPoints";
import { StatusBadge, type StatusTone } from "@/features/marketing/landing-page/StatusBadge";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.28, bounce: 0 };
const FRAME = "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

function RollingNumber({
  to,
  duration = 0.9,
  active,
  reduceMotion,
}: {
  to: number;
  duration?: number;
  active: boolean;
  reduceMotion: boolean;
}) {
  const count = useMotionValue(active || reduceMotion ? to : 0);
  const rounded = useTransform(count, (value) => Math.round(value));

  React.useEffect(() => {
    if (reduceMotion) {
      count.set(to);
      return;
    }
    if (!active) {
      count.set(0);
      return;
    }
    const controls = animate(count, to, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [active, count, to, duration, reduceMotion]);

  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

function UploadSpinner() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="animate-spin [animation-duration:900ms] motion-reduce:animate-none"
    >
      <circle cx="12" cy="12" r="8" fill="none" stroke="#FFFFFF40" strokeWidth="2.5" />
      <path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const SOURCE_FILES: {
  id: string;
  ext: string;
  top: number;
  wave: 1 | 2;
  enterDelay: number;
  uploadDur: number;
  sheet: React.ReactNode;
}[] = [
  {
    id: "catalog-xlsx",
    ext: ".xlsx",
    top: 50,
    wave: 1,
    enterDelay: 0.05,
    uploadDur: 0.9,
    sheet: [true, false, false, false].map((head, row) => (
      <div key={row} className="flex gap-0.5">
        {[0, 1, 2].map((cell) => (
          <span
            key={cell}
            className={cn("h-[4.5px] flex-1 rounded-[1px]", head ? "bg-success/25" : "bg-file-line")}
          />
        ))}
      </div>
    )),
  },
  {
    id: "specs-xlsx",
    ext: ".xlsx",
    top: 156,
    wave: 1,
    enterDelay: 0.18,
    uploadDur: 1.05,
    sheet: [true, false, false, false].map((head, row) => (
      <div key={row} className="flex gap-0.5">
        {[0, 1, 2].map((cell) => (
          <span
            key={cell}
            className={cn("h-[4.5px] flex-1 rounded-[1px]", head ? "bg-info/30" : "bg-file-line")}
          />
        ))}
      </div>
    )),
  },
  {
    id: "languages-xlsx",
    ext: ".xlsx",
    top: 262,
    wave: 2,
    enterDelay: 0.05,
    uploadDur: 0.9,
    sheet: [true, false, false, false].map((head, row) => (
      <div key={row} className="flex gap-0.5">
        {[0, 1, 2].map((cell) => (
          <span
            key={cell}
            className={cn("h-[4.5px] flex-1 rounded-[1px]", head ? "bg-teal/35" : "bg-file-line")}
          />
        ))}
      </div>
    )),
  },
  {
    id: "symbols-xlsx",
    ext: ".xlsx",
    top: 368,
    wave: 2,
    enterDelay: 0.18,
    uploadDur: 1.0,
    sheet: [true, false, false, false].map((head, row) => (
      <div key={row} className="flex gap-0.5">
        {[0, 1, 2].map((cell) => (
          <span
            key={cell}
            className={cn("h-[4.5px] flex-1 rounded-[1px]", head ? "bg-success/25" : "bg-file-line")}
          />
        ))}
      </div>
    )),
  },
];

const FIELD_MAPPINGS = [
  { source: "Product Name", target: "Device name", skipped: false, wave: 1 },
  { source: "Ref No.", target: "REF", skipped: false, wave: 1 },
  { source: "Sterilisation", target: "Sterilization", skipped: false, wave: 1 },
  { source: "Expiry (months)", target: "Shelf life", skipped: false, wave: 1 },
  { source: "Latex (Y/N)", target: "Latex statement", skipped: false, wave: 2 },
  { source: "UDI-DI", target: "UDI", skipped: false, wave: 2 },
  { source: "Internal Code", target: "Skip", skipped: true, wave: 2 },
] as const;

type FilterKey = "all" | "ready" | "needs-project" | "error";

const VALIDATION_FILTERS: { key: FilterKey; label: string; dot?: string }[] = [
  { key: "all", label: "All · 48" },
  { key: "ready", label: "Ready · 45", dot: "bg-stage-released" },
  { key: "needs-project", label: "Needs project · 2", dot: "bg-stage-review" },
  { key: "error", label: "Error · 1", dot: "bg-destructive" },
];

const VALIDATION_ROWS: {
  title: string;
  meta: string;
  status: "ready" | "needs-project" | "error";
  badge: string;
  tone: StatusTone;
}[] = [
  {
    title: "PX-2042 · IV Extension Set, 150 cm",
    meta: "Infusion Therapy → IV Sets · EU MDR",
    status: "ready",
    badge: "Ready",
    tone: "released",
  },
  {
    title: "PX-2043 · IV Extension Set, 200 cm",
    meta: "Infusion Therapy → IV Sets · EU MDR",
    status: "ready",
    badge: "Ready",
    tone: "released",
  },
  {
    title: "PX-2045 · Needle-Free Luer Connector",
    meta: "Infusion Therapy → Access Devices",
    status: "ready",
    badge: "Ready",
    tone: "released",
  },
  {
    title: "PX-2048 · Microbore Tubing, 90 cm",
    meta: "Unassigned → Select destination project",
    status: "needs-project",
    badge: "Needs project",
    tone: "review",
  },
  {
    title: "PX-1180 · 3-Way Stopcock Manifold",
    meta: "Duplicate plan # in Cardiology",
    status: "error",
    badge: "Duplicate",
    tone: "destructive",
  },
];

const IMPORT_HIGHLIGHTS: SectionPoint[] = [
  {
    title: "Excel template & custom columns",
    body: "Bring core info, compliance standards, languages, label components, and toggleable custom columns in one sheet.",
    icon: Note01Icon,
  },
  {
    title: "Dry-run workspace checks",
    body: "Automatically flags duplicate plan numbers, missing fields, and ambiguous project matches before import.",
    icon: SecurityCheckIcon,
  },
  {
    title: "Safe batch draft creation",
    body: "Creates clean Draft v1 records in your chosen projects without ever overwriting existing released products.",
    icon: Tick02Icon,
  },
];

type PipelinePhase =
  | "reset"
  | "wave1-upload"
  | "wave1-done"
  | "wave2-upload"
  | "wave2-done"
  | "checking"
  | "validated";

const PHASE_ORDER: Record<PipelinePhase, number> = {
  reset: 0,
  "wave1-upload": 1,
  "wave1-done": 2,
  "wave2-upload": 3,
  "wave2-done": 4,
  checking: 5,
  validated: 6,
};

function BulkImportPipeline({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [phase, setPhase] = React.useState<PipelinePhase>(reduceMotion ? "validated" : "reset");
  const [cycleKey, setCycleKey] = React.useState(0);

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
      setPhase("reset");
      setCycleKey((k) => k + 1);
      wait(380, () => {
        setPhase("wave1-upload");
        wait(1050, () => {
          setPhase("wave1-done");
          wait(420, () => {
            setPhase("wave2-upload");
            wait(1050, () => {
              setPhase("wave2-done");
              wait(650, () => {
                setPhase("checking");
                wait(900, () => {
                  setPhase("validated");
                  wait(5600, run);
                });
              });
            });
          });
        });
      });
    };

    wait(100, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const activePhase: PipelinePhase = reduceMotion ? "validated" : phase;
  const rank = PHASE_ORDER[activePhase];
  const wave1Entered = rank >= PHASE_ORDER["wave1-upload"];
  const wave1Done = rank >= PHASE_ORDER["wave1-done"];
  const wave2Entered = rank >= PHASE_ORDER["wave2-upload"];
  const wave2Done = rank >= PHASE_ORDER["wave2-done"];
  const checking = rank >= PHASE_ORDER.checking;
  const validated = rank >= PHASE_ORDER.validated;

  const visibleRows =
    filter === "all"
      ? VALIDATION_ROWS
      : VALIDATION_ROWS.filter((row) => row.status === filter);

  return (
    <ScaledCanvas ref={ref} width={1220} height={506} minScale={0.56} panX={610} panBelow={768} scrollable>
      {/* Animated connectors matching landing page style */}
      <svg
        width="1220"
        height="506"
        viewBox="0 0 1220 506"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {/* Left incoming & file-to-card connectors (HowItWorksSection fading dashed streams) */}
        {SOURCE_FILES.map((file) => {
          const y1 = file.top + 32;
          const y2 = file.top + 42;
          const entered = file.wave === 1 ? wave1Entered : wave2Entered;
          const done = file.wave === 1 ? wave1Done : wave2Done;
          return (
            <g key={file.id}>
              {[y1, y2].map((y) =>
                [
                  [20, 72, 0.05],
                  [72, 130, 0.14],
                ].map(([x1, x2, o]) => (
                  <motion.line
                    key={`${y}-${x1}`}
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={entered ? o : 0.03}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeDasharray="3 5"
                    animate={reduceMotion || !inView || !entered ? undefined : { strokeDashoffset: [0, -16] }}
                    transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
                  />
                )),
              )}

              <DottedConnector
                d={`M194 ${file.top + 37}H272`}
                active={done}
                canvasWidth={1220}
                canvasHeight={506}
                baseOpacity={0.18}
                activeOpacity={0.68}
                transition={{ duration: 0.45, ease: FLOW_EASE }}
              />

              {!reduceMotion && inView && done && (
                <g key={`${file.id}-${cycleKey}`} opacity="0">
                  <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2" fill="currentColor" />
                  <animateMotion
                    path={`M194 ${file.top + 37}H272`}
                    dur="1.6s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.45 0 0.25 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.82;1"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </g>
              )}

              <path
                d={`M272 ${file.top + 33.75}A3.25 3.25 0 0 0 272 ${file.top + 40.25}`}
                strokeWidth="1.2"
                className="fill-card stroke-foreground/40 dark:fill-surface-2"
              />
            </g>
          );
        })}

        {/* Middle-to-right validation connectors (only animate once middle card is populated) */}
        {[144, 244, 344].map((y, idx) => (
          <g key={y}>
            <DottedConnector
              d={`M640 ${y}H716`}
              active={checking}
              canvasWidth={1220}
              canvasHeight={506}
              baseOpacity={0.18}
              activeOpacity={0.75}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: FLOW_EASE }}
            />
            {!reduceMotion && inView && checking && (
              <g key={`mid-${y}-${cycleKey}`} opacity="0">
                <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                <circle r="2" fill="currentColor" />
                <animateMotion
                  path={`M640 ${y}H716`}
                  dur="1.6s"
                  begin={`${idx * 0.2}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.82;1"
                  dur="1.6s"
                  begin={`${idx * 0.2}s`}
                  repeatCount="indefinite"
                />
              </g>
            )}
            <path
              d={`M640 ${y - 3.25}A3.25 3.25 0 0 1 640 ${y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/40 dark:fill-surface-2"
            />
            <path
              d={`M716 ${y - 3.25}A3.25 3.25 0 0 0 716 ${y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/40 dark:fill-surface-2"
            />
          </g>
        ))}
      </svg>

      {/* Left column: 4 file tiles fading in from left in 2 waves & uploading */}
      {SOURCE_FILES.map((file) => {
        const entered = file.wave === 1 ? wave1Entered : wave2Entered;
        const done = file.wave === 1 ? wave1Done : wave2Done;
        return (
          <motion.div
            key={`${file.id}-${cycleKey}`}
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            animate={entered ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.42, delay: entered ? file.enterDelay : 0, ease: EASE_OUT }}
            className="absolute left-[134px] flex h-[74px] w-[60px] flex-col gap-[5px] rounded-l-lg rounded-r-lg rounded-tr-2xl border border-separator bg-file-frame px-1 pb-1.5 pt-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2"
            style={{ top: file.top }}
          >
            <div className="flex flex-1 flex-col gap-[3px] rounded-l-[7px] rounded-br-[7px] rounded-tr-xl bg-file-sheet px-[7px] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
              {file.sheet}
            </div>
            <div className="flex px-[3px]">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
                <motion.div
                  className={cn(
                    "h-full origin-left rounded-full transition-colors duration-300",
                    done ? "bg-success" : "bg-foreground",
                  )}
                  initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0.06 }}
                  animate={{ scaleX: entered ? 1 : 0.06 }}
                  transition={{ duration: entered ? file.uploadDur : 0.15, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
            <span
              className={cn(
                "absolute -left-2.5 top-[30px] flex size-[22px] items-center justify-center rounded-md text-white shadow-[0_0_0_2px_var(--card),0_2px_6px_rgba(0,0,0,0.15)] transition-colors duration-300",
                done ? "bg-success" : "bg-invert text-invert-foreground",
              )}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {done ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.88, filter: "blur(3px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    <Icon icon={Tick02Icon} size={12} strokeWidth={2.6} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="busy"
                    exit={{ opacity: 0, scale: 0.88, filter: "blur(3px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    {inView && !reduceMotion && <UploadSpinner />}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="absolute -right-1.5 -top-1.5 rounded-tile border border-border bg-card px-[5px] py-px font-ui text-[9.5px] font-medium leading-[13px] text-muted-foreground dark:border-edge-2 dark:bg-surface-2">
              {file.ext}
            </span>
          </motion.div>
        );
      })}

      {/* Center card: Map to Uprevit fields (thin p-[5px] ring, full shadow breathing room) */}
      <div
        aria-hidden="true"
        className={cn("absolute left-[272px] top-5 w-[368px] rounded-[18px] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.14)]", FRAME)}
      >
        <div className="flex h-[436px] flex-col rounded-[13px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-separator px-4 dark:border-edge-1">
            <span className="flex items-center gap-2 font-ui text-[13px] font-semibold text-foreground">
              <Icon icon={GridTableIcon} size={15} strokeWidth={1.8} />
              Map to Uprevit fields
            </span>
            <span className="font-mono text-[10.5px] text-muted-foreground tabular-nums">
              {wave2Done ? "4 files" : wave1Done ? "2 files" : "Waiting…"}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
            <div className="grid grid-cols-[1fr_24px_1fr] items-center font-mono text-[9.5px] uppercase tracking-[0.06em] text-faint-foreground">
              <span>Column</span>
              <span />
              <span>Uprevit field</span>
            </div>
            {FIELD_MAPPINGS.map((row, idx) => {
              const shown = row.wave === 1 ? wave1Done : wave2Done;
              return (
                <div key={row.source} className="grid h-[30px] grid-cols-[1fr_24px_1fr] items-center">
                  {shown ? (
                    <>
                      <motion.span
                        initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: row.skipped ? 0.5 : 1, x: 0 }}
                        transition={{ duration: 0.28, delay: (idx % 4) * 0.05, ease: EASE_OUT }}
                        className="flex h-[30px] items-center rounded-lg border border-stroke-primary bg-card px-2.5 font-ui text-[11.5px] text-foreground dark:border-edge-2 dark:bg-surface-3/40"
                      >
                        {row.source}
                      </motion.span>
                      <motion.span
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 0.22, delay: (idx % 4) * 0.05 + 0.06 }}
                        className="flex justify-center text-muted-foreground"
                      >
                        <Icon icon={ArrowRight02Icon} size={12} strokeWidth={1.8} />
                      </motion.span>
                      <motion.span
                        initial={reduceMotion ? false : { opacity: 0, x: 6 }}
                        animate={{ opacity: row.skipped ? 0.55 : 1, x: 0 }}
                        transition={{ duration: 0.28, delay: (idx % 4) * 0.05 + 0.08, ease: EASE_OUT }}
                        className={cn(
                          "flex h-[30px] items-center rounded-lg border border-dashed px-2.5 font-ui text-[11.5px]",
                          row.skipped
                            ? "border-separator bg-subtle/40 text-placeholder dark:border-edge-1"
                            : "border-stroke-strong bg-subtle font-medium text-foreground dark:border-edge-3 dark:bg-surface-3/70",
                        )}
                      >
                        {row.target}
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <span className="flex h-[30px] items-center rounded-lg border border-separator/80 bg-subtle/50 px-2.5 dark:border-edge-1 dark:bg-surface-3/20">
                        <span className="h-1.5 w-[58%] rounded-full bg-foreground/[0.08]" />
                      </span>
                      <span className="flex justify-center text-foreground/15">
                        <Icon icon={ArrowRight02Icon} size={12} strokeWidth={1.8} />
                      </span>
                      <span className="flex h-[30px] items-center rounded-lg border border-dashed border-separator/80 bg-subtle/30 px-2.5 dark:border-edge-1">
                        <span className="h-1.5 w-[50%] rounded-full bg-foreground/[0.07]" />
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex h-12 shrink-0 items-center justify-between border-t border-separator px-4 dark:border-edge-1">
            <span className="font-ui text-[12px] text-muted-foreground">
              <strong className="font-semibold text-foreground">
                <RollingNumber
                  to={wave2Done ? 48 : wave1Done ? 24 : 0}
                  active={wave1Done}
                  duration={0.8}
                  reduceMotion={reduceMotion}
                />
              </strong>{" "}
              rows parsed
            </span>
            <motion.span
              animate={
                activePhase === "checking" && !reduceMotion
                  ? { scale: [1, 0.94, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.32, ease: EASE_OUT }}
              className={cn(
                "flex h-7 items-center gap-1 rounded-lg border px-2.5 font-ui text-[11.5px] font-medium transition-opacity duration-150",
                checking
                  ? "border-foreground bg-foreground text-background"
                  : wave2Done
                    ? "border-stroke-primary bg-card text-foreground dark:border-edge-2 dark:bg-surface-3"
                    : "border-separator bg-subtle/60 text-muted-foreground dark:border-edge-1 dark:bg-surface-3/40",
              )}
            >
              Dry-run check →
            </motion.span>
          </div>
        </div>
      </div>

      {/* Right card: Dry-run workspace validation (same height skeleton blocks until validated) */}
      <div className={cn("absolute left-[716px] top-5 w-[458px] rounded-[18px] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.14)]", FRAME)}>
        <div className="flex h-[436px] flex-col rounded-[13px] border border-border bg-card dark:border-edge-2 dark:bg-surface-2">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-separator px-4 dark:border-edge-1">
            <span className="flex items-center gap-2 font-ui text-[13px] font-semibold text-foreground">
              <Icon icon={SecurityCheckIcon} size={15} strokeWidth={1.8} />
              Dry-run workspace validation
            </span>
            {validated ? (
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="inline-flex"
              >
                <StatusBadge tone="released" size="sm">
                  <RollingNumber to={45} active={validated} duration={0.9} reduceMotion={reduceMotion} />
                  <span>Ready</span>
                </StatusBadge>
              </motion.span>
            ) : (
              <span className="h-5 w-16 rounded-full bg-foreground/[0.06]" />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2.5 px-4 py-3.5">
            {validated ? (
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter validation rows">
                {VALIDATION_FILTERS.map((item) => {
                  const isSelected = filter === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setFilter(item.key)}
                      className="relative flex h-6 cursor-pointer items-center gap-1.5 rounded-md px-2.5 font-ui text-[10.5px] font-medium tabular-nums outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="bulk-import-filter-pill"
                          transition={SPRING}
                          className="absolute inset-0 rounded-md bg-invert"
                        />
                      )}
                      {!isSelected && (
                        <span className="absolute inset-0 rounded-md border border-stroke-primary bg-subtle/60 dark:border-edge-2 dark:bg-surface-3/40" />
                      )}
                      {item.dot && <span aria-hidden="true" className={cn("relative z-10 size-1.5 rounded-full", item.dot)} />}
                      <span
                        className={cn(
                          "relative z-10 transition-colors duration-150",
                          isSelected ? "text-invert-foreground" : "text-foreground/80",
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {[52, 68, 86, 56].map((w, idx) => (
                  <span
                    key={idx}
                    className="h-6 rounded-md bg-foreground/[0.06]"
                    style={{ width: w }}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-1 flex-col gap-2 overflow-hidden">
              {validated
                ? visibleRows.map((row, idx) => (
                    <motion.div
                      key={row.title}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.055, ease: EASE_OUT }}
                      className="flex h-[48px] shrink-0 items-center justify-between gap-2 rounded-[10px] border border-separator bg-card px-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-edge-1 dark:bg-surface-3/30"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-ui text-[11.5px] font-semibold leading-4 text-foreground">
                          {row.title}
                        </span>
                        <span className="truncate font-ui text-[10px] leading-[14px] text-muted-foreground">
                          {row.meta}
                        </span>
                      </div>
                      <StatusBadge tone={row.tone} size="xs">
                        {row.badge}
                      </StatusBadge>
                    </motion.div>
                  ))
                : [
                    [62, 48, 54],
                    [66, 52, 54],
                    [58, 44, 54],
                    [60, 56, 76],
                    [54, 46, 62],
                  ].map(([tW, mW, bW], idx) => (
                    <div
                      key={idx}
                      className="flex h-[48px] shrink-0 items-center justify-between gap-3 rounded-[10px] border border-separator/80 bg-subtle/40 px-3 dark:border-edge-1 dark:bg-surface-3/20"
                    >
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="h-2 rounded-full bg-foreground/[0.08]" style={{ width: `${tW}%` }} />
                        <span className="h-1.5 rounded-full bg-foreground/[0.05]" style={{ width: `${mW}%` }} />
                      </div>
                      <span className="h-5 rounded-full bg-foreground/[0.06]" style={{ width: bW }} />
                    </div>
                  ))}
            </div>
          </div>

          <div className="flex h-12 shrink-0 items-center justify-between border-t border-separator px-4 dark:border-edge-1">
            {validated ? (
              <>
                <span className="font-ui text-[12px] text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    <RollingNumber to={45} active={validated} duration={0.9} reduceMotion={reduceMotion} />
                  </strong>{" "}
                  draft v1 records ready
                </span>
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.15, ease: EASE_OUT }}
                  className="inline-flex h-8 items-center rounded-lg border border-primary-700 bg-primary px-3 font-ui text-[11.5px] font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                >
                  Import 45 products
                </motion.span>
              </>
            ) : (
              <>
                <span className="h-2 w-28 rounded-full bg-foreground/[0.07]" />
                <span className="h-8 w-[124px] rounded-lg bg-foreground/[0.08]" />
              </>
            )}
          </div>
        </div>
      </div>
    </ScaledCanvas>
  );
}

export default function ProductsBulkImportSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="products-bulk-import-heading" className="contents">
        <SectionHeader
          id="products-bulk-import-heading"
          anchorId="bulk-import"
          title="Bring your spreadsheets in."
          mutedTitle="Check every row first."
        >
          Upload existing Excel workbooks, map custom columns, run dry-run
          validation against your workspace, and assign projects before creating
          draft records.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <BulkImportPipeline reduceMotion={reduceMotion} />
          </div>
        </TileRow>

        <SectionPoints points={IMPORT_HIGHLIGHTS} />
      </section>
    </MotionConfig>
  );
}
