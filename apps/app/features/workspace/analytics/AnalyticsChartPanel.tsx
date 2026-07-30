"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";

interface AnalyticsChartPanelProps {
  title: string;
  info: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function AnalyticsChartPanel({
  title,
  info,
  headerActions,
  children,
}: AnalyticsChartPanelProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          <InfoTooltip content={info} />
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
