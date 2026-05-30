import { cn } from "@uprevit/ui/lib/utils";

/** Strikethrough old / removed value in inline redline text */
export const redlineOldValue =
  "line-through text-sm text-red-600/70 dark:text-red-400/80";

/** New / added value in inline redline text */
export const redlineNewValue =
  "text-sm font-semibold text-blue-700 dark:text-blue-400";

/** Compact old value (tables) */
export const redlineOldValueCompact =
  "text-sm text-red-600/70 dark:text-red-400/80 line-through";

/** Compact new value (tables) */
export const redlineNewValueCompact = "text-sm text-blue-700 dark:text-blue-400";

export const redlineBadgeAdded =
  "text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";

export const redlineBadgeRemoved =
  "text-red-700 bg-red-100 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800";

export const redlineBadgeModified =
  "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";

/** Shared badge shell (tracking, padding) — pair with badge* tokens above */
export const redlineBadgeBase =
  "font-bold tracking-wider border shadow-sm";

export const redlineCardAdded =
  "border-blue-500/50 bg-blue-100/5 dark:bg-blue-950/15";

export const redlineCardRemoved =
  "border-red-500/50 bg-red-100/5 opacity-60 dark:bg-red-950/15";

export const redlineCardModified =
  "border-amber-500/50 bg-amber-100/10 dark:bg-amber-950/20";

export const redlineFieldHighlightRemoved =
  "bg-red-200/40 text-destructive dark:bg-red-500/15";

export const redlineFieldHighlightAdded =
  "bg-blue-200/40 text-blue-500 dark:bg-blue-500/15";

export const redlineFieldHighlightModified =
  "bg-amber-200/40 text-amber-500 dark:bg-amber-500/15";

export const redlineHighlightRing =
  "ring-1 ring-amber-400/60 ring-inset dark:ring-amber-500/50";

export const redlineHighlightBorder =
  "ring-1 ring-amber-400/60 border-amber-400/70 dark:ring-amber-500/50 dark:border-amber-500/60";

export function getRedlineHighlightInsetShadow(theme: "light" | "dark"): string {
  return theme === "dark"
    ? "inset 0 0 0 9999px rgba(251, 191, 36, 0.18)"
    : "inset 0 0 0 9999px rgba(251, 191, 36, 0.12)";
}

export function cnRedlineBadge(
  variant: "added" | "removed" | "modified",
  className?: string,
) {
  const variantClass =
    variant === "added"
      ? redlineBadgeAdded
      : variant === "removed"
        ? redlineBadgeRemoved
        : redlineBadgeModified;
  return cn(redlineBadgeBase, variantClass, className);
}

/** Label chip styles for array field diffs (symbols tables) */
export const redlineChipAdded =
  "border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500";

export const redlineChipRemoved =
  "border-red-400 text-red-700 bg-red-50 line-through dark:bg-red-900/20 dark:text-red-400 dark:border-red-500";

export const redlineBannerText = "text-amber-600 dark:text-amber-400";
