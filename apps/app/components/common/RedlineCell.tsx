"use client";

import type { DiffItem } from "@/utils/deepDiff";
import {
  redlineNewValueCompact,
  redlineOldValueCompact,
} from "@/utils/redlineStyles";
import type { ReactNode } from "react";

type RedlineCellProps = {
  value: unknown;
  diff: DiffItem | null;
  formatFn?: (v: unknown, state?: "old" | "new" | "current") => ReactNode;
};

const defaultFormat = (v: unknown) =>
  typeof v === "string" ? v : v != null ? String(v) : "-";

/** Compact stacked old/new values for product tab tables. */
export function RedlineCell({ value, diff, formatFn }: RedlineCellProps) {
  const format = formatFn || defaultFormat;

  if (!diff) return <>{format(value, "current")}</>;

  const isAdded = diff.status === "added";
  const isRemoved = diff.status === "removed";
  const isModified = diff.status === "modified";

  return (
    <div className="flex flex-col gap-0.5">
      {(isModified || isRemoved) && diff.old_value !== null && (
        <div className={redlineOldValueCompact}>
          {format(diff.old_value, "old")}
        </div>
      )}
      {(isModified || isAdded) && !isRemoved && (
        <div className={redlineNewValueCompact}>
          {format(diff.new_value, "new")}
        </div>
      )}
    </div>
  );
}
