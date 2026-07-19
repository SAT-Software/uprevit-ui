import type { RedlineStatus } from "@/utils/redlineArray";
import { hasChangedRedlineStatus } from "@/utils/redlineCounts";
import { cnRedlineBadge } from "@/utils/redlineStyles";
import { cn } from "@uprevit/ui/lib/utils";

const BADGE_LABELS = {
  added: "NEW",
  removed: "DEL",
  modified: "MOD",
} as const;

type RedlineBadgeProps = {
  status: "added" | "removed" | "modified";
  className?: string;
  inline?: boolean;
};

export function RedlineBadge({
  status,
  className,
  inline = false,
}: RedlineBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        inline
          ? "whitespace-nowrap text-[9px]"
          : "pointer-events-none absolute top-1 right-1 z-20",
        cnRedlineBadge(status),
        className,
      )}
    >
      {BADGE_LABELS[status]}
    </span>
  );
}

type RedlineStatusBadgeProps = {
  status?: RedlineStatus | null;
  className?: string;
  inline?: boolean;
};

export function RedlineStatusBadge({
  status,
  className,
  inline,
}: RedlineStatusBadgeProps) {
  if (!hasChangedRedlineStatus(status)) {
    return null;
  }

  return <RedlineBadge status={status} className={className} inline={inline} />;
}
