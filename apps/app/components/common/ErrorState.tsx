"use client";

import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { cn } from "@uprevit/ui/lib/utils";

export const CARDS_STATE_MIN_HEIGHT = "min-h-[344px] md:min-h-[216px]";

export const TABLE_BODY_STATE_MIN_HEIGHT = "min-h-[17.5rem]";

type ErrorStateVariant = "bar" | "panel";

interface ErrorStateProps {
  icon: React.ComponentProps<typeof Icon>["icon"];
  title: string;
  description?: string;
  variant?: ErrorStateVariant;
  embedded?: boolean;
  fill?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  title,
  description,
  variant = "bar",
  embedded = false,
  fill = false,
  onRetry,
  className,
}: ErrorStateProps) {
  const isPanel = variant === "panel";
  const message =
    description ??
    (onRetry
      ? "Check your connection and try again."
      : "Reload the page or log in again.");

  return (
    <div
      role="alert"
      className={cn(
        "relative flex w-full border border-dashed border-destructive/40 bg-destructive/5",
        isPanel
          ? "flex-col items-center justify-center gap-3 p-6 text-center"
          : "items-center justify-center gap-4 p-4",
        !embedded && !fill && "rounded-2xl",
        embedded && "rounded-none border-0",
        fill && "min-h-full flex-1",
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
        <p className="text-muted-foreground text-xs">{message}</p>
      </div>
      {onRetry && (
        <Button type="button" size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
