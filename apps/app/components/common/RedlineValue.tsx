"use client";

import type { DiffItem } from "@/utils/deepDiff";
import { redlineNewValue, redlineOldValue } from "@/utils/redlineStyles";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

type RedlineValueProps = {
  value: string;
  diff?: DiffItem | null;
  formatFn?: (v: unknown) => string;
  isRedlineView: boolean;
  oldValueClassName?: string;
  newValueClassName?: string;
};

const defaultFormat = (v: unknown) => {
  if (v && typeof v === "object" && "value" in v) {
    const objectValue = (v as { value?: unknown }).value;
    return typeof objectValue === "string"
      ? objectValue
      : objectValue != null
        ? String(objectValue)
        : "";
  }
  return typeof v === "string" ? v : v != null ? String(v) : "";
};

export function RedlineValue({
  value,
  diff,
  formatFn,
  isRedlineView,
  oldValueClassName,
  newValueClassName,
}: RedlineValueProps) {
  if (!isRedlineView || !diff) return <>{value}</>;

  const format = formatFn || defaultFormat;
  const isRemoved = diff.status === "removed";
  const isAdded = diff.status === "added";
  const oldValue = format(diff.old_value);
  const newValue = format(diff.new_value);
  const hasOldValue = oldValue.trim() !== "";
  const hasNewValue = newValue.trim() !== "";

  if (!hasOldValue && !hasNewValue) {
    return null;
  }

  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-2 whitespace-normal break-words">
      {(diff.old_value !== null || isRemoved) && hasOldValue && (
        <span
          className={cn(
            "max-w-full whitespace-pre-wrap break-words",
            redlineOldValue,
            oldValueClassName,
          )}
        >
          {oldValue}
        </span>
      )}

      {diff.old_value !== null &&
        diff.new_value !== null &&
        !isRemoved &&
        !isAdded &&
        hasOldValue &&
        hasNewValue && (
          <Icon
            icon={ArrowRight01Icon}
            size={12}
            strokeWidth={2}
            className="shrink-0 text-muted-foreground/50"
          />
        )}

      {(diff.new_value !== null || isAdded) && !isRemoved && hasNewValue && (
        <span
          className={cn(
            "max-w-full whitespace-pre-wrap break-words",
            redlineNewValue,
            newValueClassName,
          )}
        >
          {newValue}
        </span>
      )}
    </span>
  );
}
