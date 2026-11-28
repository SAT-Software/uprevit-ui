import type { CSSProperties, ReactNode } from "react";
import { TileRow } from "@/components/TileGrid";

export const ERROR_PRIMARY_ACTION =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-[18px] font-ui text-[14px] font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 sm:h-10 sm:w-auto [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)]";

export const ERROR_SECONDARY_ACTION =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-4 font-ui text-[14px] font-medium leading-[18px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:h-10 sm:w-auto [@media(hover:hover)_and_(pointer:fine)]:hover:border-stroke-strong [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle dark:border-edge-2 dark:bg-surface-2 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3";

function enter(delay: number, duration: number, y: number) {
  return {
    "--hero-delay": `${delay}ms`,
    "--hero-duration": `${duration}ms`,
    "--hero-y": `${y}px`,
  } as CSSProperties;
}

export function ErrorPageSection({
  illustration,
  title,
  mutedTitle,
  description,
  actions,
}: {
  illustration: ReactNode;
  title: string;
  mutedTitle: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <TileRow
      as="section"
      aria-labelledby="error-page-heading"
      centerClassName="relative flex flex-col items-center overflow-hidden px-5 pt-12 pb-14 sm:px-8 sm:pt-16 sm:pb-20 lg:px-10 lg:pt-[72px] lg:pb-[96px]"
    >
      <div
        aria-hidden="true"
        className="tile-dots pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[-420px] h-[1100px] w-[1800px] -translate-x-1/2"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, var(--tile-surface-solid) 0%, var(--tile-surface-solid) 80%, color-mix(in srgb, var(--tile-surface-solid) 95%, transparent) 84%, color-mix(in srgb, var(--tile-surface-solid) 80%, transparent) 87%, color-mix(in srgb, var(--tile-surface-solid) 60%, transparent) 90%, color-mix(in srgb, var(--tile-surface-solid) 36%, transparent) 93%, color-mix(in srgb, var(--tile-surface-solid) 16%, transparent) 96%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[720px] flex-col items-center gap-6 sm:gap-8">
        {illustration}

        <div className="flex flex-col items-center gap-4 sm:gap-3">
          <h1
            id="error-page-heading"
            className="hero-enter text-balance text-center font-sans text-[32px] font-medium leading-[1.08] tracking-[-0.04em] text-foreground sm:text-[44px] sm:leading-[1.06] lg:text-[56px]"
            style={enter(60, 500, 12)}
          >
            {title}
            <br />
            <span className="text-foreground/55">{mutedTitle}</span>
          </h1>

          <p
            className="hero-enter max-w-[300px] text-pretty text-center font-ui text-[14px] leading-[1.5] text-muted-foreground sm:max-w-[460px] sm:text-[16px]"
            style={enter(120, 450, 8)}
          >
            {description}
          </p>
        </div>

        <div
          className="hero-enter flex w-full flex-col items-stretch justify-center gap-2.5 pt-1 sm:w-auto sm:flex-row sm:items-center"
          style={enter(180, 420, 6)}
        >
          {actions}
        </div>
      </div>
    </TileRow>
  );
}
