import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";

export function MarketingSectionBadge({
  icon,
  label,
  className,
}: {
  icon: IconSvgElement;
  label: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "mb-8 z-60 gap-1 border-border/70 bg-background/80 px-2 py-0.5 shadow-xs",
        className,
      )}
    >
      <Icon
        icon={icon}
        size={16}
        strokeWidth={2}
        className="text-muted-foreground"
      />
      <span className="font-medium">{label}</span>
    </Badge>
  );
}
