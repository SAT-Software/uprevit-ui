"use client";

import type { ReactNode } from "react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

type PlatformAdminHeaderProps = {
  title: string;
  tooltip?: string;
  actions?: ReactNode;
};

export function PlatformAdminHeader({
  title,
  tooltip,
  actions,
}: PlatformAdminHeaderProps) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-medium">{title}</p>
        {tooltip ? <InfoTooltip content={tooltip} /> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1.5">{actions}</div>
      ) : null}
    </div>
  );
}
