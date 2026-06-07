"use client";

import { Label } from "@uprevit/ui/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";
import { PiInfo } from "react-icons/pi";

export function PlatformBillingFieldLabel({
  label,
  tooltip,
  htmlFor,
  className,
}: {
  label: string;
  tooltip: string;
  htmlFor?: string;
  className?: string;
}) {
  const labelClassName = cn("text-sm font-medium leading-none", className);

  return (
    <div className="group/field-label flex items-center gap-1">
      {htmlFor ? (
        <Label htmlFor={htmlFor} className={labelClassName}>
          {label}
        </Label>
      ) : (
        <span className={labelClassName}>{label}</span>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex text-muted-foreground/40 transition-colors hover:text-muted-foreground group-hover/field-label:text-muted-foreground/70"
            aria-label={`More about ${label}`}
          >
            <PiInfo className="size-3 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
