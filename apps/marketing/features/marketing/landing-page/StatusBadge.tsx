import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@uprevit/ui/lib/utils";

export type StatusTone =
  | "neutral"
  | "draft"
  | "submitted"
  | "review"
  | "released"
  | "primary"
  | "destructive";

export type StatusBadgeSize = "xs" | "sm" | "md";

const TONES: Record<StatusTone, { dot: string; dark: string }> = {
  neutral: {
    dot: "bg-foreground",
    dark: "dark:bg-surface-hover dark:text-muted-foreground dark:shadow-[inset_0_0_0_1px_var(--edge-3)]",
  },
  draft: {
    dot: "bg-stage-draft",
    dark: "dark:bg-surface-hover dark:text-muted-foreground dark:shadow-[inset_0_0_0_1px_var(--edge-3)]",
  },
  submitted: {
    dot: "bg-stage-submitted",
    dark: "dark:bg-info-soft dark:text-info-strong dark:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--info)_35%,transparent)]",
  },
  review: {
    dot: "bg-stage-review",
    dark: "dark:bg-warning-soft dark:text-warning-strong dark:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--warning)_35%,transparent)]",
  },
  released: {
    dot: "bg-stage-released",
    dark: "dark:bg-success-soft dark:text-success-strong dark:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--success)_35%,transparent)]",
  },
  primary: {
    dot: "bg-primary",
    dark: "dark:bg-primary-soft dark:text-primary-text dark:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_35%,transparent)]",
  },
  destructive: {
    dot: "bg-destructive",
    dark: "dark:bg-destructive-soft dark:text-destructive-strong dark:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--destructive)_35%,transparent)]",
  },
};

const SIZES: Record<StatusBadgeSize, { badge: string; dot: string }> = {
  xs: {
    badge: "h-[20px] gap-1.5 rounded-[6px] px-2 text-[10px] leading-none",
    dot: "size-[5px]",
  },
  sm: {
    badge: "h-[22px] gap-1.5 rounded-[6px] px-2 text-[10.5px] leading-none",
    dot: "size-[5px]",
  },
  md: {
    badge: "gap-1.5 rounded-sm px-[9px] py-[3px] text-[12px] leading-4",
    dot: "size-1.5",
  },
};

export function StatusBadge({
  tone = "neutral",
  size = "md",
  dot = true,
  leadingIcon,
  strike = false,
  uppercase = false,
  className,
  children,
  ...props
}: {
  tone?: StatusTone;
  size?: StatusBadgeSize;
  dot?: boolean;
  leadingIcon?: ReactNode;
  strike?: boolean;
  uppercase?: boolean;
} & ComponentPropsWithoutRef<"span">) {
  const sizeSpec = SIZES[size];

  return (
    <span
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap bg-card font-ui font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.03)]",
        sizeSpec.badge,
        TONES[tone].dark,
        strike && "line-through",
        uppercase && "uppercase tracking-label",
        className,
      )}
    >
      {leadingIcon ??
        (dot && (
          <span
            aria-hidden="true"
            className={cn("shrink-0 rounded-full", sizeSpec.dot, TONES[tone].dot)}
          />
        ))}
      {children}
    </span>
  );
}
