import type { CSSProperties, SVGProps } from "react";
import { cn } from "@uprevit/ui/lib/utils";

type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl";
type BrandLogoAppearance = "auto" | "light" | "dark";

const logoSizes: Record<
  BrandLogoSize,
  {
    tile: string;
    mark: { width: number; height: number };
    wordmark: { width: number; height: number };
    gap: string;
  }
> = {
  xs: {
    tile: "size-[26px] rounded-[7px] pt-px",
    mark: { width: 15, height: 12.6 },
    wordmark: { width: 64.5, height: 20 },
    gap: "gap-2",
  },
  sm: {
    tile: "size-8 rounded-md",
    mark: { width: 18.5, height: 15.5 },
    wordmark: { width: 81, height: 25 },
    gap: "gap-2.5",
  },
  md: {
    tile: "size-9 rounded-lg",
    mark: { width: 20.8, height: 17.4 },
    wordmark: { width: 90.7, height: 28 },
    gap: "gap-[11px]",
  },
  lg: {
    tile: "size-10 rounded-[11px]",
    mark: { width: 23, height: 19.2 },
    wordmark: { width: 100.4, height: 31 },
    gap: "gap-3",
  },
  xl: {
    tile: "size-11 rounded-xl",
    mark: { width: 25, height: 21 },
    wordmark: { width: 100.4, height: 31 },
    gap: "gap-3",
  },
};

const appearanceTileStyles: Record<BrandLogoAppearance, CSSProperties> = {
  auto: {
    backgroundImage: "var(--logo-tile-bg)",
    borderColor: "var(--logo-tile-border)",
    boxShadow: "var(--logo-tile-shadow)",
  },
  light: {
    backgroundImage: "var(--logo-tile-bg-light)",
    borderColor: "var(--logo-tile-border-light)",
    boxShadow: "var(--logo-tile-shadow-light)",
  },
  dark: {
    backgroundImage: "var(--logo-tile-bg-dark)",
    borderColor: "var(--logo-tile-border-dark)",
    boxShadow: "var(--logo-tile-shadow-dark)",
  },
};

export interface BrandMarkProps extends SVGProps<SVGSVGElement> {
  markColor?: string;
  arrowColor?: string;
}

export function BrandMark({
  className,
  markColor = "var(--logo-mark)",
  arrowColor = "var(--logo-arrow)",
  ...props
}: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 57.4 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d="M7.23 18.03V35.78C7.23 37.56 7.67 38.93 8.54 39.88C9.41 40.84 10.7 41.32 12.39 41.32C14.08 41.32 15.37 40.84 16.28 39.88C17.18 38.93 17.63 37.56 17.63 35.78V18.03H24.86V35.74C24.86 38.39 24.29 40.63 23.17 42.46C22.04 44.29 20.52 45.68 18.6 46.61C16.71 47.54 14.6 48 12.26 48C9.92 48 7.82 47.55 5.96 46.65C4.13 45.72 2.68 44.34 1.61 42.5C0.54 40.65 0 38.39 0 35.74V18.03H7.23Z"
        fill={markColor}
      />
      <path
        d="M33.85 47.1H26.9V26.77C26.9 26.03 26.95 25.29 27.09 24.56C28.55 17.32 33.05 15.36 35.36 14.49C39.03 13.11 43.21 13.99 45.02 14.79V22.64C39.65 18.62 35.47 21.99 34.19 25.12C33.89 25.86 33.85 26.66 33.85 27.46V47.1Z"
        fill={markColor}
      />
      <path
        d="M35.96 32.61V40.16C47.19 43.98 52.33 35.55 53.8 29.9C54.01 29.1 54.07 28.26 54.07 27.43V9.96H57.4L50.45 0L43.81 9.96H47.13V27.38C47.13 28.25 46.99 29.11 46.61 29.89C43.76 35.71 38.7 34.03 35.96 32.61Z"
        fill={arrowColor}
      />
    </svg>
  );
}

export interface BrandWordmarkProps extends SVGProps<SVGSVGElement> {
  appearance?: BrandLogoAppearance;
  letterColor?: string;
  chevronColor?: string;
}

export function BrandWordmark({
  className,
  appearance = "auto",
  letterColor,
  chevronColor,
  ...props
}: BrandWordmarkProps) {
  const letterFill =
    letterColor ??
    (appearance === "light"
      ? "var(--logo-ink-light)"
      : appearance === "dark"
        ? "var(--logo-ink-dark)"
        : "currentColor");
  const chevronFill =
    chevronColor ??
    (appearance === "light"
      ? "var(--logo-chevron-light)"
      : appearance === "dark"
        ? "var(--logo-chevron-dark)"
        : "var(--logo-chevron)");

  return (
    <svg
      viewBox="67 0 155.01 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "shrink-0",
        appearance === "auto" && "text-foreground",
        className,
      )}
      {...props}
    >
      <path
        d="M78.4 37.98Q75.09 37.98 72.5 36.55Q69.91 35.13 68.45 32.62Q67 30.120 67 26.84V12.21H73.86V26.67Q73.86 28.24 74.39 29.35Q74.93 30.47 75.96 31.06Q76.99 31.66 78.42 31.66Q80.56 31.66 81.74 30.35Q82.93 29.05 82.93 26.67V12.21H89.8V26.84Q89.8 30.16 88.35 32.66Q86.9 35.17 84.33 36.57Q81.76 37.98 78.4 37.98Z"
        fill={letterFill}
      />
      <path
        d="M107.65 37.95Q104.92 37.95 102.73 36.84Q100.54 35.73 99.23 33.79Q97.91 31.84 97.81 29.36V20.41Q97.91 17.93 99.25 15.95Q100.58 13.98 102.77 12.83Q104.96 11.69 107.65 11.69Q111.15 11.69 113.92 13.43Q116.68 15.16 118.27 18.13Q119.87 21.1 119.87 24.86Q119.87 28.58 118.27 31.54Q116.68 34.5 113.92 36.23Q111.15 37.95 107.65 37.95ZM93.63 48V12.21H100.5V18.84L99.34 24.98L100.43 31.09V48ZM106.46 31.63Q108.35 31.63 109.79 30.77Q111.23 29.9 112.05 28.36Q112.87 26.82 112.87 24.82Q112.87 22.81 112.05 21.28Q111.23 19.74 109.79 18.88Q108.35 18.01 106.48 18.01Q104.6 18.01 103.14 18.87Q101.69 19.74 100.88 21.27Q100.08 22.81 100.08 24.82Q100.08 26.82 100.88 28.36Q101.67 29.9 103.13 30.77Q104.58 31.63 106.46 31.63Z"
        fill={letterFill}
      />
      <path
        d="M122.76 37.43V12.21H129.63V37.43ZM129.63 23.5 126.95 21.7Q127.45 17.09 129.69 14.39Q131.94 11.69 136.14 11.69Q138 11.69 139.45 12.3Q140.91 12.92 142.08 14.25L137.83 19.18Q137.23 18.53 136.42 18.22Q135.62 17.92 134.56 17.92Q132.37 17.92 131 19.28Q129.63 20.65 129.63 23.5Z"
        fill={letterFill}
      />
      <path
        d="M154.31 37.98Q150.37 37.98 147.27 36.28Q144.17 34.58 142.38 31.59Q140.59 28.59 140.59 24.82Q140.59 21.06 142.35 18.09Q144.1 15.12 147.12 13.39Q150.15 11.66 153.87 11.66Q157.49 11.66 160.28 13.29Q163.07 14.91 164.66 17.76Q166.25 20.61 166.25 24.25Q166.25 24.91 166.17 25.62Q166.1 26.32 165.91 27.2L144.69 27.24V22.15L162.73 22.11L159.93 24.21Q159.86 21.96 159.15 20.46Q158.43 18.95 157.11 18.15Q155.78 17.36 153.84 17.36Q151.8 17.36 150.3 18.26Q148.8 19.16 147.99 20.79Q147.17 22.43 147.17 24.72Q147.17 27.01 148.04 28.7Q148.91 30.39 150.51 31.3Q152.12 32.21 154.27 32.21Q156.18 32.21 157.76 31.55Q159.33 30.89 160.48 29.58L164.5 33.63Q162.65 35.78 160.01 36.88Q157.38 37.98 154.31 37.98Z"
        fill={letterFill}
      />
      <path
        d="M176.71 37.43 165.61 12.21H173.1L181.12 32.99H177.37L185.41 12.21H192.69L181.6 37.43Z"
        fill={letterFill}
      />
      <path d="M194.23 37.43V12.21H201.1V37.43Z" fill={letterFill} />
      <path
        d="M209.27 37.43V1.75H216.13V37.43ZM203.4 18.22V12.21H222.01V18.22Z"
        fill={letterFill}
      />
      <path
        d="M197.67 5.02 L201.63 8.74 L202.19 9.11 L202.83 9.3 L203.49 9.27 L204.12 9.05 L204.64 8.64 L205.02 8.09 L205.2 7.45 L205.18 6.78 L204.95 6.16 L204.54 5.63 L199.12 0.55 L198.6 0.19 L197.99 0 L197.35 0 L196.74 0.19 L196.21 0.55 L190.79 5.63 L190.38 6.16 L190.15 6.78 L190.13 7.45 L190.32 8.09 L190.69 8.64 L191.22 9.05 L191.84 9.27 L192.51 9.3 L193.15 9.11 L193.7 8.74 Z"
        fill={chevronFill}
      />
    </svg>
  );
}

export interface BrandTileProps {
  size?: BrandLogoSize;
  appearance?: BrandLogoAppearance;
  className?: string;
}

export function BrandTile({
  size = "md",
  appearance = "auto",
  className,
}: BrandTileProps) {
  const { tile, mark } = logoSizes[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border pt-0.5",
        tile,
        className,
      )}
      style={appearanceTileStyles[appearance]}
    >
      <BrandMark width={mark.width} height={mark.height} />
    </span>
  );
}

export interface BrandLogoProps {
  size?: BrandLogoSize;
  appearance?: BrandLogoAppearance;
  showWordmark?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  appearance = "auto",
  showWordmark = true,
  className,
}: BrandLogoProps) {
  const { wordmark, gap } = logoSizes[size];

  return (
    <span
      role="img"
      aria-label="Uprevit"
      className={cn("inline-flex items-center", gap, className)}
    >
      <BrandTile size={size} appearance={appearance} />
      {showWordmark && (
        <BrandWordmark
          appearance={appearance}
          width={wordmark.width}
          height={wordmark.height}
        />
      )}
    </span>
  );
}
