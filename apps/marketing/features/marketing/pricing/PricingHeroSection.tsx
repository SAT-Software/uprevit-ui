"use client";

import * as React from "react";
import Link from "next/link";
import { MotionConfig } from "motion/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export default function PricingHeroSection() {
  const reduceMotion = usePrefersReducedMotion();

  const handleScrollToIncluded = React.useCallback(() => {
    const target = document.getElementById("whats-included");
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
        aria-labelledby="pricing-hero-heading"
        centerClassName="relative flex flex-col items-center overflow-hidden px-5 pt-14 pb-12 sm:px-8 sm:pt-18 sm:pb-20 lg:pt-[88px] lg:pb-[120px]"
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

        <svg
          aria-hidden="true"
          viewBox="0 0 1310 612"
          preserveAspectRatio="xMidYMin slice"
          className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="655"
            cy="122"
            rx="790"
            ry="422"
            fill="none"
            className="stroke-[#F1F1F1] dark:stroke-transparent"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="0.1 8"
          />
          <ellipse
            cx="655"
            cy="122"
            rx="930"
            ry="520"
            fill="none"
            className="stroke-[#17171714] dark:stroke-[#EDEDED1F]"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="0.1 8"
          />
        </svg>

        <div className="relative z-10 flex w-full max-w-[1100px] flex-col items-center gap-6">
          <div
            className="hero-enter w-full pb-1 text-center sm:pb-2"
            style={
              {
                "--hero-delay": "0ms",
                "--hero-duration": "500ms",
                "--hero-y": "12px",
              } as React.CSSProperties
            }
          >
            <h1
              id="pricing-hero-heading"
              className="font-sans text-[32px] font-medium leading-[36px] tracking-[-0.04em] text-foreground sm:text-[46px] sm:leading-[52px] lg:text-[60px] lg:leading-[64px]"
            >
              Simple pricing
              <br />
              <span className="text-foreground/40">
                for audit-ready documentation
              </span>
            </h1>
          </div>

          <p
            className="hero-enter max-w-[300px] text-center font-ui text-[14px] leading-[21px] text-muted-foreground sm:max-w-[640px] sm:text-[17px] sm:leading-[27px] lg:max-w-none lg:text-[18px] lg:leading-[30px]"
            style={
              {
                "--hero-delay": "70ms",
                "--hero-duration": "450ms",
                "--hero-y": "8px",
              } as React.CSSProperties
            }
          >
            One plan, quoted for your team. Tell us about your products and
            we&apos;ll size it with you.
          </p>

          <div
            className="hero-enter flex w-full flex-col items-stretch justify-center gap-2.5 pt-2 sm:w-auto sm:flex-row sm:items-center sm:pt-3"
            style={
              {
                "--hero-delay": "130ms",
                "--hero-duration": "420ms",
                "--hero-y": "6px",
              } as React.CSSProperties
            }
          >
            <Link
              href="/contact?topic=pricing"
              data-attr="pricing-hero-talk-to-us"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-5 font-ui text-[15px] font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#8A33FF] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 sm:w-auto dark:hover:bg-primary-hover"
            >
              Talk to us
            </Link>

            <button
              type="button"
              onClick={handleScrollToIncluded}
              data-attr="pricing-hero-whats-included"
              className="group/cta inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-[18px] font-ui text-[15px] font-medium leading-[18px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out hover:border-stroke-strong hover:bg-subtle focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:w-auto dark:border-edge-2 dark:bg-surface-2 dark:hover:bg-surface-3"
            >
              <span>See what&apos;s included</span>
              <Icon
                icon={ArrowRight02Icon}
                size={14}
                strokeWidth={1.8}
                className="transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </TileRow>
    </MotionConfig>
  );
}
