import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@uprevit/ui/lib/utils";

export type StatusTone = "neutral" | "draft" | "submitted" | "review" | "released" | "primary" | "destructive";

const TONES: Record<StatusTone, { dot: string; dark: string }> = {
  neutral: {
    dot: "bg-foreground",
    dark: "dark:bg-white/[0.04] dark:text-muted-foreground dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
  },
  draft: {
    dot: "bg-stage-draft",
    dark: "dark:bg-white/[0.04] dark:text-muted-foreground dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
  },
  submitted: {
    dot: "bg-stage-submitted",
    dark: "dark:bg-[#3B82F61F] dark:text-[#93C5FD] dark:shadow-[inset_0_0_0_1px_#3B82F64D]",
  },
  review: {
    dot: "bg-stage-review",
    dark: "dark:bg-[#FBBF241F] dark:text-[#FCD34D] dark:shadow-[inset_0_0_0_1px_#FBBF244D]",
  },
  released: {
    dot: "bg-stage-released",
    dark: "dark:bg-[#34D3991F] dark:text-[#6EE7B7] dark:shadow-[inset_0_0_0_1px_#34D3994D]",
  },
  primary: {
    dot: "bg-primary",
    dark: "dark:bg-[#8F40FF26] dark:text-[#C49EFF] dark:shadow-[inset_0_0_0_1px_#8F40FF4D]",
  },
  destructive: {
    dot: "bg-destructive",
    dark: "dark:bg-[#F871711F] dark:text-[#FCA5A5] dark:shadow-[inset_0_0_0_1px_#F871714D]",
  },
};

export function StatusBadge({
  tone,
  className,
  children,
  ...props
}: { tone: StatusTone } & ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm bg-card px-[9px] py-[3px] font-ui text-[12px] font-medium leading-4 text-foreground shadow-[inset_0_0_0_1px_#1717171A,0_1px_2px_#00000008]",
        TONES[tone].dark,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", TONES[tone].dot)} />
      {children}
    </span>
  );
}
