"use client";

import * as React from "react";
import { MotionConfig, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Book01Icon,
  Clock01Icon,
  Folder02Icon,
  GitCompareIcon,
  GridTableIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { BrandMark } from "@/components/BrandLogo";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "./DotsBackdrop";
import { SectionHeader } from "./SectionHeader";
import { SectionPoints, type SectionPoint } from "./SectionPoints";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const IN_VIEW = { once: true, margin: "-80px" } as const;

const NODES: {
  title: string;
  meta: string;
  icon: IconSvgElement;
  left: number;
  top: number;
  connector: string;
  port: [number, number];
}[] = [
  {
    title: "Product data",
    meta: "1,248 fields",
    icon: GridTableIcon,
    left: 356,
    top: 98,
    connector: "M484 150 C544.0 150.0 512.5 220.2 561.6 254.6",
    port: [484, 150],
  },
  {
    title: "Glossary",
    meta: "Symbols & terms",
    icon: Book01Icon,
    left: 826,
    top: 98,
    connector: "M826 150 C766.0 150.0 797.5 220.2 748.4 254.6",
    port: [826, 150],
  },
  {
    title: "Source files",
    meta: "xlsx · docx · pdf",
    icon: Folder02Icon,
    left: 266,
    top: 268,
    connector: "M394 320 L541 320",
    port: [394, 320],
  },
  {
    title: "Versions",
    meta: "v4 · 3 changes",
    icon: GitCompareIcon,
    left: 916,
    top: 268,
    connector: "M916 320 L769 320",
    port: [916, 320],
  },
  {
    title: "Reviews",
    meta: "2 of 3 approved",
    icon: SecurityCheckIcon,
    left: 356,
    top: 438,
    connector: "M484 490 C544.0 490.0 512.5 419.8 561.6 385.4",
    port: [484, 490],
  },
  {
    title: "Audit trail",
    meta: "Every edit logged",
    icon: Clock01Icon,
    left: 826,
    top: 438,
    connector: "M826 490 C766.0 490.0 797.5 419.8 748.4 385.4",
    port: [826, 490],
  },
];

const PULSE_CYCLE = 9;
const PULSE_TRAVEL = 1.6;
const PULSE_ORDER = [0, 3, 4, 1, 2, 5];

function pulseTimes(start: number) {
  const s = start / PULSE_CYCLE;
  const e = (start + PULSE_TRAVEL) / PULSE_CYCLE;
  const r = (n: number) => n.toFixed(4);
  return {
    motion: `0;${r(s)};${r(e)};1`,
    opacity: `0;${r(s)};${r(s + 0.02)};${r(e - 0.03)};${r(e)};1`,
  };
}

const TICKS_MAJOR = "M655.0 228.0L655.0 210.0 M701.0 240.33L710.0 224.74 M734.67 274.0L750.26 265.0 M747.0 320.0L765.0 320.0 M734.67 366.0L750.26 375.0 M701.0 399.67L710.0 415.26 M655.0 412.0L655.0 430.0 M609.0 399.67L600.0 415.26 M575.33 366.0L559.74 375.0 M563.0 320.0L545.0 320.0 M575.33 274.0L559.74 265.0 M609.0 240.33L600.0 224.74";
const TICKS_MINOR = "M660.02 224.13L660.55 214.15 M665.03 224.53L666.08 214.58 M670.02 225.18L671.58 215.31 M674.96 226.1L677.04 216.32 M679.85 227.27L682.43 217.61 M684.67 228.7L687.76 219.19 M689.4 230.38L692.99 221.04 M694.05 232.3L698.11 223.16 M698.58 234.46L703.12 225.55 M707.29 239.49L712.73 231.1 M711.43 242.33L717.31 234.24 M715.41 245.39L721.71 237.62 M719.24 248.66L725.93 241.23 M722.88 252.12L729.95 245.05 M726.34 255.76L733.77 249.07 M729.61 259.59L737.38 253.29 M732.67 263.57L740.76 257.69 M735.51 267.71L743.9 262.27 M740.54 276.42L749.45 271.88 M742.7 280.95L751.84 276.89 M744.62 285.6L753.96 282.01 M746.3 290.33L755.81 287.24 M747.73 295.15L757.39 292.57 M748.9 300.04L758.68 297.96 M749.82 304.98L759.69 303.42 M750.47 309.97L760.42 308.92 M750.87 314.98L760.85 314.45 M750.87 325.02L760.85 325.55 M750.47 330.03L760.42 331.08 M749.82 335.02L759.69 336.58 M748.9 339.96L758.68 342.04 M747.73 344.85L757.39 347.43 M746.3 349.67L755.81 352.76 M744.62 354.4L753.96 357.99 M742.7 359.05L751.84 363.11 M740.54 363.58L749.45 368.12 M735.51 372.29L743.9 377.73 M732.67 376.43L740.76 382.31 M729.61 380.41L737.38 386.71 M726.34 384.24L733.77 390.93 M722.88 387.88L729.95 394.95 M719.24 391.34L725.93 398.77 M715.41 394.61L721.71 402.38 M711.43 397.67L717.31 405.76 M707.29 400.51L712.73 408.9 M698.58 405.54L703.12 414.45 M694.05 407.7L698.11 416.84 M689.4 409.62L692.99 418.96 M684.67 411.3L687.76 420.81 M679.85 412.73L682.43 422.39 M674.96 413.9L677.04 423.68 M670.02 414.82L671.58 424.69 M665.03 415.47L666.08 425.42 M660.02 415.87L660.55 425.85 M649.98 415.87L649.45 425.85 M644.97 415.47L643.92 425.42 M639.98 414.82L638.42 424.69 M635.04 413.9L632.96 423.68 M630.15 412.73L627.57 422.39 M625.33 411.3L622.24 420.81 M620.6 409.62L617.01 418.96 M615.95 407.7L611.89 416.84 M611.42 405.54L606.88 414.45 M602.71 400.51L597.27 408.9 M598.57 397.67L592.69 405.76 M594.59 394.61L588.29 402.38 M590.76 391.34L584.07 398.77 M587.12 387.88L580.05 394.95 M583.66 384.24L576.23 390.93 M580.39 380.41L572.62 386.71 M577.33 376.43L569.24 382.31 M574.49 372.29L566.1 377.73 M569.46 363.58L560.55 368.12 M567.3 359.05L558.16 363.11 M565.38 354.4L556.04 357.99 M563.7 349.67L554.19 352.76 M562.27 344.85L552.61 347.43 M561.1 339.96L551.32 342.04 M560.18 335.02L550.31 336.58 M559.53 330.03L549.58 331.08 M559.13 325.02L549.15 325.55 M559.13 314.98L549.15 314.45 M559.53 309.97L549.58 308.92 M560.18 304.98L550.31 303.42 M561.1 300.04L551.32 297.96 M562.27 295.15L552.61 292.57 M563.7 290.33L554.19 287.24 M565.38 285.6L556.04 282.01 M567.3 280.95L558.16 276.89 M569.46 276.42L560.55 271.88 M574.49 267.71L566.1 262.27 M577.33 263.57L569.24 257.69 M580.39 259.59L572.62 253.29 M583.66 255.76L576.23 249.07 M587.12 252.12L580.05 245.05 M590.76 248.66L584.07 241.23 M594.59 245.39L588.29 237.62 M598.57 242.33L592.69 234.24 M602.71 239.49L597.27 231.1 M611.42 234.46L606.88 225.55 M615.95 232.3L611.89 223.16 M620.6 230.38L617.01 221.04 M625.33 228.7L622.24 219.19 M630.15 227.27L627.57 217.61 M635.04 226.1L632.96 216.32 M639.98 225.18L638.42 215.31 M644.97 224.53L643.92 214.58 M649.98 224.13L649.45 214.15";

function HubStage({ reduceMotion }: { reduceMotion: boolean }) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(860);

  React.useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const update = (nextWidth: number) => {
      if (nextWidth > 0) setContainerWidth(nextWidth);
    };
    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, containerWidth / 860);
  const stageHeight = Math.max(290, Math.round(640 * scale));

  return (
    <div
      ref={stageRef}
      className="relative w-full overflow-hidden"
      style={{ height: stageHeight }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[640px] w-[1310px]"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
      <svg
        width="1310"
        height="640"
        viewBox="0 0 1310 640"
        aria-hidden="true"
        className="absolute inset-0 text-foreground"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <line x1="266" y1="320" x2="1044" y2="320" strokeOpacity={0.12} strokeDasharray="2 5" />
          <line x1="655" y1="0" x2="655" y2="640" strokeOpacity={0.12} strokeDasharray="2 5" />
          <circle cx="655" cy="320" r="318" strokeOpacity={0.14} strokeDasharray="2 5" />
        </g>
        <path
          d="M375 320 a280 280 0 1 0 560 0 a280 280 0 1 0 -560 0 Z M461 320 a194 194 0 1 1 388 0 a194 194 0 1 1 -388 0 Z"
          fillRule="evenodd"
          fill="currentColor"
          fillOpacity={0.035}
        />
        <g fill="none" stroke="currentColor">
          <circle cx="655" cy="320" r="280" strokeOpacity={0.08} />
          <circle cx="655" cy="320" r="194" strokeOpacity={0.08} />
          <circle cx="655" cy="320" r="156" strokeOpacity={0.16} strokeLinecap="round" strokeDasharray="2 5" />
        </g>

        {NODES.map((node, index) => (
          <g key={node.title}>
            <mask
              id={`solution-hub-link-${index}`}
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={1310}
              height={640}
            >
              <motion.path
                d={node.connector}
                fill="none"
                stroke="#fff"
                strokeWidth="6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 + index * 0.06 }}
              />
            </mask>
            <motion.path
              d={node.connector}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="3 4"
              mask={`url(#solution-hub-link-${index})`}
              initial={false}
              animate={{ strokeOpacity: hovered === index ? 0.78 : 0.24 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            />
          </g>
        ))}

        {reduceMotion
          ? [
              [518.7, 199.5],
              [518.7, 440.5],
              [791.3, 440.5],
              [840, 320],
            ].map(([cx, cy]) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="5" fill="currentColor" fillOpacity={0.09} />
                <circle cx={cx} cy={cy} r="2.5" fill="currentColor" />
              </g>
            ))
          : PULSE_ORDER.map((nodeIndex, order) => {
              const times = pulseTimes(
                order * ((PULSE_CYCLE - PULSE_TRAVEL - 0.4) / (PULSE_ORDER.length - 1)),
              );
              return (
                <g key={nodeIndex} opacity="0">
                  <circle r="5" fill="currentColor" fillOpacity={0.09} />
                  <circle r="2.5" fill="currentColor" />
                  <animateMotion
                    path={NODES[nodeIndex].connector}
                    dur={`${PULSE_CYCLE}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyPoints="0;0;1;1"
                    keyTimes={times.motion}
                    keySplines="0 0 1 1;0.45 0 0.25 1;0 0 1 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1;0;0"
                    keyTimes={times.opacity}
                    dur={`${PULSE_CYCLE}s`}
                    repeatCount="indefinite"
                  />
                </g>
              );
            })}

        {NODES.map((node) => (
          <circle
            key={node.title}
            cx={node.port[0]}
            cy={node.port[1]}
            r="3.25"
            strokeWidth="1.2"
            className="fill-card stroke-foreground/40 dark:fill-surface-2"
          />
        ))}

        <circle cx="655" cy="323" r="115" fill="currentColor" fillOpacity={0.04} />
        <circle
          cx="655"
          cy="320"
          r="114"
          strokeOpacity={0.09}
          stroke="currentColor"
          className="fill-card dark:fill-surface-2"
        />
        <circle cx="655" cy="320" r="90" fill="none" stroke="currentColor" strokeOpacity={0.07} />
        <motion.g
          style={{ transformOrigin: "655px 320px", transformBox: "view-box" }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 120, ease: "linear", repeat: Infinity }}
          stroke="currentColor"
          strokeLinecap="round"
          fill="none"
        >
          <path d={TICKS_MINOR} strokeWidth="0.9" strokeOpacity={0.22} />
          <path d={TICKS_MAJOR} strokeWidth="1.6" strokeOpacity={0.4} />
        </motion.g>
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={IN_VIEW}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="absolute left-[567px] top-[232px] flex size-[176px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_20%,#2B2B2B_0%,#191919_52%,#0C0C0C_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_-8px_18px_rgba(0,0,0,0.5),0_0_0_5px_var(--card),0_0_0_6px_rgba(23,23,23,0.08),0_18px_36px_-14px_rgba(0,0,0,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_-8px_18px_rgba(0,0,0,0.6),0_0_0_5px_var(--surface-2),0_0_0_6px_rgba(255,255,255,0.08),0_18px_36px_-14px_rgba(0,0,0,0.75)]"
      >
        <div className="flex size-[132px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#242424_0%,#171717_58%,#0F0F0F_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-2px_6px_rgba(0,0,0,0.55),0_0_0_1px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.45)]">
          <BrandMark
            className="h-[48.5px] w-[58px]"
            markColor="#FFFFFF"
            arrowColor="#A56BFF"
          />
        </div>
      </motion.div>

      {NODES.map((node, index) => (
        <motion.div
          key={node.title}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={IN_VIEW}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.15 + index * 0.06 }}
          onHoverStart={() => setHovered(index)}
          onHoverEnd={() => setHovered((current) => (current === index ? null : current))}
          className="group absolute flex h-[104px] w-32 cursor-default flex-col items-center justify-center gap-2.5 rounded-2xl border border-foreground/[0.07] bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.04),0_12px_24px_-14px_rgba(0,0,0,0.18)] transition-[border-color,box-shadow] duration-200 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/[0.12] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05),0_16px_28px_-14px_rgba(0,0,0,0.24)] dark:border-edge-2 dark:bg-surface-2 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_2px_rgba(0,0,0,0.3),0_12px_24px_-14px_rgba(0,0,0,0.7)] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:border-edge-3"
          style={{ left: node.left, top: node.top }}
        >
          <span className="flex rounded-[10px] border border-separator bg-file-frame p-[2px]">
            <span className="flex size-[30px] items-center justify-center rounded-[8px] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-surface-3">
              <Icon
                icon={node.icon}
                size={17}
                strokeWidth={1.8}
                className="shrink-0 text-muted-foreground transition-colors duration-200 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground"
              />
            </span>
          </span>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-ui text-[13px] font-medium leading-4 text-foreground">
              {node.title}
            </span>
            <span className="whitespace-nowrap font-ui text-[11px] leading-[14px] text-muted-foreground">
              {node.meta}
            </span>
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  );
}

const POINTS: SectionPoint[] = [
  {
    title: "One record per product",
    body: "Specs, symbols, artwork and files sit together, versioned.",
    icon: GridTableIcon,
  },
  {
    title: "Changes compared for you",
    body: "Every edit is redlined against the last release.",
    icon: GitCompareIcon,
  },
  {
    title: "Reviews in one place",
    body: "Each function approves, with names and times recorded.",
    icon: SecurityCheckIcon,
  },
];

export default function SolutionSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="solution-heading" className="contents">
        <SectionHeader
          id="solution-heading"
          title="One workspace"
          mutedTitle="for your whole organization."
        >
          Product data, label content, symbols and approvals live together.
          Every team works from the same record, so what gets approved is what
          gets printed.
        </SectionHeader>

        <TileRow centerClassName="relative overflow-hidden">
          <DotsBackdrop
            className="opacity-45"
            dotsClassName="[mask-image:radial-gradient(ellipse_78%_74%_at_50%_50%,transparent_64%,#000_82%,transparent_98%)]"
          />
          <HubStage reduceMotion={reduceMotion} />
        </TileRow>

        <SectionPoints points={POINTS} />
      </section>
    </MotionConfig>
  );
}
