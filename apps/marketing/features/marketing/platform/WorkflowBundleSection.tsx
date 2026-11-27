"use client";

import * as React from "react";
import { MotionConfig, motion, useInView } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  CubeIcon,
  GitBranchIcon,
  Layers01Icon,
  Note01Icon,
  SecurityCheckIcon,
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
const FLOW_EASE = [0.645, 0.045, 0.355, 1] as const;
const FRAME =
  "border border-foreground/5 bg-frame-surface dark:border-edge-1 dark:bg-surface-1/75";

const BUNDLE_PRODUCTS: {
  title: string;
  left: number;
  top: number;
  icon: IconSvgElement;
  path: string;
  port: string;
}[] = [
  {
    title: "IV Extension",
    left: 144,
    top: 26,
    icon: CubeIcon,
    path: "M196 130V154H484",
    port: "M192.75 130A3.25 3.25 0 0 0 199.25 130",
  },
  {
    title: "Stopcock 3-Way",
    left: 276,
    top: 26,
    icon: Layers01Icon,
    path: "M328 130V140H484",
    port: "M324.75 130A3.25 3.25 0 0 0 331.25 130",
  },
  {
    title: "Pressure Line",
    left: 144,
    top: 198,
    icon: Note01Icon,
    path: "M196 198V174H484",
    port: "M192.75 198A3.25 3.25 0 0 1 199.25 198",
  },
  {
    title: "Y-Connector",
    left: 276,
    top: 198,
    icon: GitBranchIcon,
    path: "M328 198V188H484",
    port: "M324.75 198A3.25 3.25 0 0 1 331.25 198",
  },
];

const OUTGOING_PATH = "M636 164H860";

function ChangePackageFlow({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [stage, setStage] = React.useState(reduceMotion ? 3 : 0);

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
      setStage(1);
      wait(1100, () => {
        setStage(2);
        wait(1000, () => {
          setStage(3);
          wait(4200, () => {
            setStage(0);
            wait(550, run);
          });
        });
      });
    };

    wait(200, run);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion]);

  const activeStage = reduceMotion ? 3 : stage;

  return (
    <ScaledCanvas ref={ref} width={1120} height={328} minScale={0.56} panX={560} panBelow={768} aria-hidden="true">
      <svg
        width="1120"
        height="328"
        viewBox="0 0 1120 328"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        {BUNDLE_PRODUCTS.map((product, idx) => (
          <g key={product.title}>
            <DottedConnector
              d={product.path}
              active={activeStage >= 1}
              canvasWidth={1120}
              canvasHeight={328}
              baseOpacity={0.2}
              activeOpacity={0.68}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: FLOW_EASE }}
            />
            {!reduceMotion && inView && activeStage >= 1 && (
              <g opacity="0">
                <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
                <circle r="2" fill="currentColor" />
                <animateMotion
                  path={product.path}
                  dur="2.2s"
                  begin={`${idx * 0.28}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.14;0.86;1"
                  dur="2.2s"
                  begin={`${idx * 0.28}s`}
                  repeatCount="indefinite"
                />
              </g>
            )}
            <path
              d={product.port}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/40 dark:fill-surface-2"
            />
          </g>
        ))}

        {[140, 154, 174, 188].map((y) => (
          <path
            key={y}
            d={`M484 ${y - 3.25}A3.25 3.25 0 0 0 484 ${y + 3.25}`}
            strokeWidth="1.2"
            className="fill-card stroke-foreground/45 dark:fill-surface-2"
          />
        ))}

        <DottedConnector
          d={OUTGOING_PATH}
          active={activeStage >= 2}
          canvasWidth={1120}
          canvasHeight={328}
          baseOpacity={0.2}
          activeOpacity={0.75}
          transition={{ duration: 0.5, ease: FLOW_EASE }}
        />
        {!reduceMotion && inView && activeStage >= 2 && (
          <g opacity="0">
            <circle r="4.5" fill="currentColor" fillOpacity={0.09} />
            <circle r="2" fill="currentColor" />
            <animateMotion
              path={OUTGOING_PATH}
              dur="1.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.45 0 0.25 1"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.14;0.86;1"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </g>
        )}
        <path
          d="M636 160.75A3.25 3.25 0 0 1 636 167.25"
          strokeWidth="1.2"
          className="fill-card stroke-foreground/45 dark:fill-surface-2"
        />
        <path
          d="M860 160.75A3.25 3.25 0 0 0 860 167.25"
          strokeWidth="1.2"
          className="fill-card stroke-foreground/45 dark:fill-surface-2"
        />
      </svg>

      {BUNDLE_PRODUCTS.map((product, idx) => (
        <motion.div
          key={product.title}
          initial={false}
          animate={{
            opacity: activeStage >= 1 ? 1 : 0.65,
            scale: activeStage >= 1 ? 1 : 0.98,
          }}
          transition={{ duration: 0.35, delay: idx * 0.06, ease: EASE_OUT }}
          style={{ left: product.left, top: product.top }}
          className={cn(
            "absolute size-[104px] rounded-[16px] p-1 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.12)]",
            FRAME,
          )}
        >
          <div className="flex size-full flex-col items-center justify-center gap-2 rounded-[12px] border border-border bg-card px-1.5 text-center dark:border-edge-2 dark:bg-surface-2">
            <span className="flex size-7 items-center justify-center rounded-lg border border-stroke-primary bg-subtle text-foreground/75 dark:border-edge-2 dark:bg-surface-3">
              <Icon icon={product.icon} size={14} strokeWidth={1.8} />
            </span>
            <span className="whitespace-nowrap font-ui text-[10.5px] font-semibold leading-3.5 text-foreground">
              {product.title}
            </span>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={false}
        animate={{ scale: activeStage >= 2 ? 1.02 : 1 }}
        transition={{ type: "spring", duration: 0.36, bounce: 0 }}
        className="absolute left-[484px] top-[88px] size-[152px] rounded-[20px] border border-foreground/10 bg-frame-surface p-1 shadow-[0_20px_38px_-16px_rgba(0,0,0,0.3)] dark:border-edge-2 dark:bg-surface-1/75"
      >
        <div className="flex size-full flex-col items-center justify-center gap-2.5 rounded-[16px] bg-invert px-3 text-center text-invert-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full border transition-colors duration-300",
              activeStage >= 2
                ? "border-background bg-background text-foreground"
                : "border-white/20 bg-white/10 text-invert-foreground dark:border-black/15 dark:bg-black/10",
            )}
          >
            <Icon icon={CheckmarkCircle02Icon} size={20} strokeWidth={1.9} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-ui text-[12.5px] font-semibold leading-4">Workflow WF-042</span>
            <span className="font-ui text-[10.5px] leading-3.5 text-invert-foreground/65">
              4 approvers
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: activeStage >= 3 ? 1 : 0.6,
          scale: activeStage >= 3 ? 1.02 : 0.985,
        }}
        transition={{ type: "spring", duration: 0.36, bounce: 0 }}
        className={cn(
          "absolute left-[860px] top-[112px] size-[104px] rounded-[16px] p-1 shadow-[0_14px_28px_-14px_rgba(0,0,0,0.14)]",
          FRAME,
        )}
      >
        <div className="flex size-full flex-col items-center justify-center gap-1.5 rounded-[12px] border border-border bg-card px-2 text-center dark:border-edge-2 dark:bg-surface-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors duration-300",
              activeStage >= 3
                ? "bg-invert text-invert-foreground"
                : "border border-stroke-primary bg-subtle text-foreground/70 dark:border-edge-2 dark:bg-surface-3",
            )}
          >
            <Icon icon={SecurityCheckIcon} size={14} strokeWidth={1.8} />
          </span>
          <span className="font-ui text-[11.5px] font-semibold leading-3.5 text-foreground">
            Released
          </span>
          <span className="flex items-center gap-1 font-mono text-[9.5px] leading-3 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-stage-released" />
            4 products
          </span>
        </div>
      </motion.div>
    </ScaledCanvas>
  );
}

export default function WorkflowBundleSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="workflow-bundle-heading" className="contents">
        <SectionHeader
          id="workflow-bundle-heading"
          anchorId="bundle"
          title="One change package."
          mutedTitle="Multiple products together."
        >
          Bundle a single product update or an entire device family into one
          workflow with summary notes, readiness checks, and cross-functional
          approvers.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden py-6 sm:py-8">
          <DotsBackdrop className="opacity-30" />
          <div className="relative">
            <ChangePackageFlow reduceMotion={reduceMotion} />
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
