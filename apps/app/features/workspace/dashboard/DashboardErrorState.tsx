"use client";

import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

export const DASHBOARD_CARDS_ERROR_MIN_HEIGHT =
  "min-h-[344px] md:min-h-[216px]";

export const DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT = "min-h-[17.5rem]";

type DashboardErrorStateVariant = "bar" | "panel";

interface DashboardErrorStateProps {
  icon: React.ComponentProps<typeof Icon>["icon"];
  title: string;
  description?: string;
  variant?: DashboardErrorStateVariant;
  embedded?: boolean;
  className?: string;
}

export function DashboardErrorState({
  icon,
  title,
  description = "Reload the page or login again",
  variant = "bar",
  embedded = false,
  className,
}: DashboardErrorStateProps) {
  const isPanel = variant === "panel";

  return (
    <div
      className={cn(
        "relative flex w-full border border-dashed border-destructive/40 bg-destructive/5",
        isPanel
          ? "flex-col items-center justify-center gap-3 p-6 text-center"
          : "items-center justify-center gap-4 p-4",
        !embedded && "rounded-2xl",
        embedded && "rounded-none border-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/40 bg-background text-destructive",
          !isPanel && "hidden sm:flex",
        )}
      >
        <Icon icon={icon} size={16} strokeWidth={2} />
      </div>
      <div className={cn(isPanel && "space-y-1")}>
        <p className="text-destructive text-sm">{title}</p>
        <p className="text-foreground/40 text-xs">{description}</p>
      </div>
    </div>
  );
}
