"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { FieldLabel } from "@uprevit/ui/components/ui/field";
import { cn } from "@uprevit/ui/lib/utils";

export function FormFieldLabel({
  htmlFor,
  label,
  tooltip,
  optional = false,
  className,
}: {
  htmlFor?: string;
  label: string;
  tooltip?: string;
  optional?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <FieldLabel htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </FieldLabel>
        {tooltip ? (
          <InfoTooltip content={tooltip} className="ml-0.5 shrink-0" />
        ) : null}
      </div>
      {optional ? (
        <span className="shrink-0 text-xs text-muted-foreground/40">
          Optional
        </span>
      ) : null}
    </div>
  );
}
