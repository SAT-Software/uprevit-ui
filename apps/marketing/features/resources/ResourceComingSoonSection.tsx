import Link from "next/link";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow, TileSpacerRow } from "@/components/TileGrid";

export interface ResourceComingSoonSectionProps {
  badge: string;
  icon: IconSvgElement;
  title: string;
  mutedTitle: string;
  description: string;
  plannedItems: string[];
}

export function ResourceComingSoonSection({
  badge,
  icon,
  title,
  mutedTitle,
  description,
  plannedItems,
}: ResourceComingSoonSectionProps) {
  return (
    <>
      <TileRow
        as="section"
        aria-labelledby="resource-coming-soon-title"
        centerClassName="relative overflow-hidden px-5 pt-12 pb-9 sm:px-8 sm:pt-16 sm:pb-12 lg:px-10 lg:pt-[88px] lg:pb-16"
      >
        <div
          aria-hidden="true"
          className="tile-dots pointer-events-none absolute bottom-0 right-0 h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 90% 85% at 100% 100%, transparent 0%, color-mix(in srgb, var(--tile-surface-solid) 70%, transparent) 55%, var(--tile-surface-solid) 100%)",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-5">
          <Link
            href="/resources"
            className="inline-flex w-fit items-center gap-1.5 rounded-sm font-ui text-body-m font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon icon={ArrowLeft02Icon} size={15} strokeWidth={1.8} />
            All resources
          </Link>

          <h1
            id="resource-coming-soon-title"
            className="text-balance font-sans text-[30px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[46px] lg:text-[60px] lg:leading-[1.07]"
          >
            {title}
            <br />
            <span className="text-foreground/55">{mutedTitle}</span>
          </h1>

          <p className="max-w-[560px] text-pretty font-ui text-[15px] leading-[23px] text-muted-foreground sm:text-[17px] sm:leading-[27px] lg:text-lead lg:leading-[30px]">
            {description}
          </p>
        </div>
      </TileRow>

      <TileRow
        as="section"
        aria-labelledby="resource-coming-soon-status"
        centerClassName="flex flex-col items-start justify-between gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:px-10 lg:py-14"
      >
        <div className="flex max-w-[600px] flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2">
              <Icon icon={icon} size={20} strokeWidth={1.8} />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-caption uppercase tracking-label text-faint-foreground">
                {badge}
              </span>
              <h2
                id="resource-coming-soon-status"
                className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground"
              >
                Coming soon
              </h2>
            </div>
          </div>

          <p className="text-pretty font-ui text-body-l leading-[26px] text-muted-foreground">
            We are putting together practical, standards-aligned references for
            medical device labeling teams. Here is what will be included:
          </p>

          <ul className="flex flex-wrap gap-2">
            {plannedItems.map((item) => (
              <li
                key={item}
                className="inline-flex h-6 items-center rounded-sm bg-muted px-2 font-ui text-body-s font-medium text-foreground dark:bg-surface-4"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <Link
            href="/resources/blogs"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-primary-700 bg-primary px-4 font-ui text-body-m font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-[background-color,transform] duration-150 hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
          >
            Read the blog
            <Icon icon={ArrowRight02Icon} size={14} strokeWidth={1.8} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md border border-stroke-strong bg-card px-4 font-ui text-body-m font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[background-color,transform] duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] dark:border-edge-2 dark:bg-surface-2 dark:hover:bg-surface-3"
          >
            Request early access
          </Link>
        </div>
      </TileRow>

      <TileSpacerRow />
    </>
  );
}
