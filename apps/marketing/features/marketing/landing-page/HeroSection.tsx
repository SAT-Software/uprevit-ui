"use client";

import * as React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  FileEditIcon,
  Rocket01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  HeroProductPreview,
  type HeroSpotlight,
} from "./HeroProductPreview";

interface HeroPill {
  id: Exclude<HeroSpotlight, null>;
  label: string;
  icon: IconSvgElement;
  iconClassName: string;
}

const HERO_PILLS: HeroPill[] = [
  {
    id: "spec-change",
    label: "spec change",
    icon: FileEditIcon,
    iconClassName: "text-primary dark:text-primary-400",
  },
  {
    id: "review",
    label: "review",
    icon: Search01Icon,
    iconClassName: "text-warning",
  },
  {
    id: "release",
    label: "release",
    icon: Rocket01Icon,
    iconClassName: "text-success",
  },
];

const PILL_SPRING = { type: "spring" as const, duration: 0.2, bounce: 0 };

export default function HeroSection() {
  const [hoveredSpotlight, setHoveredSpotlight] =
    React.useState<HeroSpotlight>(null);
  const [pinnedSpotlight, setPinnedSpotlight] =
    React.useState<HeroSpotlight>(null);
  const spotlight = hoveredSpotlight ?? pinnedSpotlight;
  const reduceMotion = usePrefersReducedMotion();

  const handleScrollToPreview = React.useCallback(() => {
    const target =
      document.getElementById("how-it-works") ??
      document.getElementById("product-preview");
    if (target) {
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <TileRow
        as="section"
        aria-labelledby="hero-heading"
        centerClassName="relative flex flex-col items-center overflow-hidden px-5 pt-14 pb-12 sm:px-8 sm:pt-18 sm:pb-24 lg:px-10 lg:pt-[76px] lg:pb-[196px]"
      >
        <div
          aria-hidden="true"
          className="tile-dots pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden"
        >
          <div
            className="absolute left-1/2 top-[-358px] h-[960px] w-[1800px] -translate-x-1/2"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 50% 50% at 50% 50%, var(--tile-surface-solid) 0%, var(--tile-surface-solid) 80%, color-mix(in srgb, var(--tile-surface-solid) 95%, transparent) 84%, color-mix(in srgb, var(--tile-surface-solid) 80%, transparent) 87%, color-mix(in srgb, var(--tile-surface-solid) 60%, transparent) 90%, color-mix(in srgb, var(--tile-surface-solid) 36%, transparent) 93%, color-mix(in srgb, var(--tile-surface-solid) 16%, transparent) 96%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex w-full max-w-[1040px] flex-col items-center gap-6 sm:gap-5">
          <div
            className="hero-enter w-full pb-1 text-center"
            style={
              {
                "--hero-delay": "0ms",
                "--hero-duration": "500ms",
                "--hero-y": "12px",
              } as React.CSSProperties
            }
          >
            <h1
              id="hero-heading"
              className="text-balance font-sans text-[32px] font-medium leading-[1.08] tracking-[-0.04em] text-foreground sm:text-[44px] sm:leading-[1.06] lg:text-[56px]"
            >
              From raw data
              <br />
              <span className="text-foreground/55">
                to Notified Body–ready labels
              </span>
            </h1>
          </div>

          <div
            className="hero-enter flex flex-col items-center gap-2 text-center sm:gap-1.5"
            style={
              {
                "--hero-delay": "70ms",
                "--hero-duration": "450ms",
                "--hero-y": "8px",
              } as React.CSSProperties
            }
          >
            <p className="max-w-[300px] text-pretty font-ui text-[14px] leading-[1.5] text-muted-foreground sm:max-w-none sm:text-[16px]">
              The unified cloud-based platform for total labeling governance.
            </p>
            <div className="flex max-w-[310px] flex-wrap items-center justify-center gap-y-2 font-ui text-[14px] leading-[1.5] text-muted-foreground sm:max-w-none sm:text-[16px]">
              <span className="pe-1.5">Track every</span>
              <HeroInlinePill
                pill={HERO_PILLS[0]}
                active={spotlight === "spec-change"}
                reduceMotion={reduceMotion}
                onHover={setHoveredSpotlight}
                onToggle={(id) =>
                  setPinnedSpotlight((prev) => (prev === id ? null : id))
                }
              />
              <span className="px-1.5">through</span>
              <HeroInlinePill
                pill={HERO_PILLS[1]}
                active={spotlight === "review"}
                reduceMotion={reduceMotion}
                onHover={setHoveredSpotlight}
                onToggle={(id) =>
                  setPinnedSpotlight((prev) => (prev === id ? null : id))
                }
              />
              <span className="px-1.5">to</span>
              <HeroInlinePill
                pill={HERO_PILLS[2]}
                active={spotlight === "release"}
                reduceMotion={reduceMotion}
                onHover={setHoveredSpotlight}
                onToggle={(id) =>
                  setPinnedSpotlight((prev) => (prev === id ? null : id))
                }
              />
            </div>
          </div>

          <div
            className="hero-enter flex w-full items-center justify-center pt-3 sm:mx-[-50vw] sm:w-[calc(100%+100vw)]"
            style={
              {
                "--hero-delay": "130ms",
                "--hero-duration": "420ms",
                "--hero-y": "6px",
              } as React.CSSProperties
            }
          >
            <div
              aria-hidden="true"
              className="hidden flex-1 items-center sm:flex"
            >
              <span className="h-[1.2px] flex-1 bg-[repeating-linear-gradient(270deg,var(--grid)_0_3px,transparent_3px_6px)]" />
            </div>

            <div className="flex w-full shrink-0 flex-col items-stretch justify-center gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/contact?topic=demo"
                data-attr="hero-book-demo"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-[18px] font-ui text-[14px] font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 sm:h-10 sm:w-auto [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)]"
              >
                Book a demo
              </Link>

              <button
                type="button"
                onClick={handleScrollToPreview}
                data-attr="hero-see-how-it-works"
                className="group/cta inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 font-ui text-[14px] font-medium leading-[18px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:h-10 sm:w-auto [@media(hover:hover)_and_(pointer:fine)]:hover:border-stroke-strong [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle dark:bg-surface-2 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3"
              >
                <span>See how it works</span>
                <Icon
                  icon={ArrowRight02Icon}
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5"
                />
              </button>
            </div>

            <div
              aria-hidden="true"
              className="hidden flex-1 items-center sm:flex"
            >
              <span className="h-[1.2px] flex-1 bg-[repeating-linear-gradient(90deg,var(--grid)_0_3px,transparent_3px_6px)]" />
            </div>
          </div>
        </div>
      </TileRow>

      <TileRow
        as="section"
        id="product-preview"
        aria-label="Product preview"
        className="relative scroll-mt-14"
        centerClassName="relative overflow-visible bg-transparent p-0"
      >
        <HeroProductPreview spotlight={spotlight} />
      </TileRow>
    </MotionConfig>
  );
}

function HeroInlinePill({
  pill,
  active,
  reduceMotion,
  onHover,
  onToggle,
}: {
  pill: HeroPill;
  active: boolean;
  reduceMotion: boolean;
  onHover: (id: HeroSpotlight) => void;
  onToggle: (id: Exclude<HeroSpotlight, null>) => void;
}) {
  return (
    <motion.button
      type="button"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onHover(pill.id);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onHover(null);
      }}
      onClick={() => onToggle(pill.id)}
      aria-pressed={active}
      whileTap={reduceMotion ? undefined : { y: 0, scale: 0.97 }}
      transition={PILL_SPRING}
      className={cn(
        "inline-flex h-[28px] cursor-pointer items-center gap-1.5 rounded-md border border-foreground/[0.09] bg-card ps-2 pe-2.5 font-ui text-[14px] font-medium leading-none text-foreground shadow-[inset_0_-1px_0_rgba(23,23,23,0.04),0_1px_2px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.08)] outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[1.5px] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.015] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 dark:border-foreground/[0.09] dark:bg-surface-2 dark:shadow-[inset_0_-1px_0_rgba(237,237,237,0.04),0_1px_2px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.08)]",
        active &&
          "border-foreground/[0.16] bg-subtle shadow-[inset_0_-1px_0_rgba(23,23,23,0.04),0_2px_4px_rgba(0,0,0,0.07),0_6px_14px_-4px_rgba(0,0,0,0.1)] dark:border-foreground/[0.18] dark:bg-surface-3 dark:shadow-[inset_0_-1px_0_rgba(237,237,237,0.05),0_2px_6px_rgba(0,0,0,0.22),0_6px_14px_-4px_rgba(0,0,0,0.3)]",
      )}
    >
      <Icon
        icon={pill.icon}
        size={14}
        strokeWidth={2}
        className={cn("shrink-0", pill.iconClassName)}
      />
      <span>{pill.label}</span>
    </motion.button>
  );
}
