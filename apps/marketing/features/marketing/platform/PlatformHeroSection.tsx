import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow } from "@/components/TileGrid";

function enter(delay: number, duration: number, y: number) {
  return {
    "--hero-delay": `${delay}ms`,
    "--hero-duration": `${duration}ms`,
    "--hero-y": `${y}px`,
  } as CSSProperties;
}

export interface PlatformHeroProps {
  headingId?: string;
  title?: string;
  mutedTitle?: string;
  description?: string;
  primaryCta?: { label: string; href: string; dataAttr: string };
  secondaryCta?: { label: string; href: string; dataAttr: string };
}

export default function PlatformHeroSection({
  headingId = "platform-hero-heading",
  title = "One structured workspace",
  mutedTitle = "for medical device labeling",
  description = "Replace scattered spreadsheets, email threads, and manual PDFs with a single structured platform built for regulatory, quality, and packaging teams.",
  primaryCta = {
    label: "Book a demo",
    href: "/contact?topic=demo",
    dataAttr: "platform-hero-book-demo",
  },
  secondaryCta = {
    label: "See pricing",
    href: "/pricing",
    dataAttr: "platform-hero-see-pricing",
  },
}: PlatformHeroProps = {}) {
  return (
    <TileRow
      as="section"
      aria-labelledby={headingId}
      centerClassName="relative flex flex-col items-center overflow-hidden px-5 pt-14 pb-12 sm:px-8 sm:pt-18 sm:pb-16 lg:px-10 lg:pt-[76px] lg:pb-[88px]"
    >
      <div
        aria-hidden="true"
        className="tile-dots pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[-310px] h-[820px] w-[1800px] -translate-x-1/2"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, var(--tile-surface-solid) 0%, var(--tile-surface-solid) 80%, color-mix(in srgb, var(--tile-surface-solid) 95%, transparent) 84%, color-mix(in srgb, var(--tile-surface-solid) 80%, transparent) 87%, color-mix(in srgb, var(--tile-surface-solid) 60%, transparent) 90%, color-mix(in srgb, var(--tile-surface-solid) 36%, transparent) 93%, color-mix(in srgb, var(--tile-surface-solid) 16%, transparent) 96%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[960px] flex-col items-center gap-5">
        <h1
          id={headingId}
          className="hero-enter text-balance text-center font-sans text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[46px] lg:text-[56px]"
          style={enter(0, 500, 12)}
        >
          {title}
          <br />
          <span className="text-foreground/55">{mutedTitle}</span>
        </h1>

        <p
          className="hero-enter max-w-[320px] text-pretty text-center font-ui text-[14px] leading-[1.55] text-muted-foreground sm:max-w-[660px] sm:text-[17px]"
          style={enter(70, 450, 8)}
        >
          {description}
        </p>

        <div
          className="hero-enter flex w-full flex-col items-stretch justify-center gap-2.5 pt-1.5 sm:w-auto sm:flex-row sm:items-center"
          style={enter(130, 420, 6)}
        >
          <Link
            href={primaryCta.href}
            data-attr={primaryCta.dataAttr}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-5 font-ui text-[15px] font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 sm:w-auto [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)]"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            data-attr={secondaryCta.dataAttr}
            className="group/cta inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-[18px] font-ui text-[15px] font-medium leading-[18px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:w-auto [@media(hover:hover)_and_(pointer:fine)]:hover:border-stroke-strong [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle dark:border-edge-2 dark:bg-surface-2 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3"
          >
            <span>{secondaryCta.label}</span>
            <Icon
              icon={ArrowRight02Icon}
              size={14}
              strokeWidth={1.8}
              className="transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </TileRow>
  );
}
