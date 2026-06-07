"use client";

import type { ReactNode } from "react";

type PlatformAdminHeaderProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function PlatformAdminHeader({
  title,
  subtitle,
  actions,
  children,
}: PlatformAdminHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">{title}</h1>
            <div className="hidden h-1 w-1 rounded-full border border-border bg-border sm:block" />
            <p className="hidden text-xs font-medium text-muted-foreground sm:block">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex min-h-8 shrink-0 flex-wrap items-center gap-2">
          {actions ?? <span className="hidden sm:block" aria-hidden="true" />}
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
