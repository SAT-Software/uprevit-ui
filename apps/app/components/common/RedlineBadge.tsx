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
};

export function RedlineBadge({ status, className }: RedlineBadgeProps) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-1 right-1 z-20 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
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
};

export function RedlineStatusBadge({
  status,
  className,
}: RedlineStatusBadgeProps) {
  if (!hasChangedRedlineStatus(status)) {
    return null;
  }

  return <RedlineBadge status={status} className={className} />;
}
