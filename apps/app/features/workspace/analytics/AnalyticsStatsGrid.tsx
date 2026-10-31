"use client";

import Link from "next/link";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  PropertyEditIcon,
  Target02Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

type Tiles = AnalyticsData["tiles"];

const STATS: {
  key: keyof Tiles;
  title: string;
  info: string;
  icon: typeof AlertCircleIcon;
  metric?: string;
  format?: (value: number) => string;
}[] = [
  {
    key: "in_progress",
    title: "In progress",
    info: "Products in draft, submitted or in review",
    icon: PropertyEditIcon,
    metric: "in_progress",
  },
  {
    key: "released",
    title: "Released",
    info: "Versions released in the selected period",
    icon: CheckmarkCircle02Icon,
    metric: "released",
  },
  {
    key: "on_time_rate",
    title: "On-time rate",
    info: "Share of versions released in the selected period on or before their target date",
    icon: Target02Icon,
    format: (value) => `${Math.round(value * 100)}%`,
  },
  {
    key: "median_days_to_release",
    title: "Median time to release",
    info: "Median days from creating a version to releasing it, for versions released in the selected period",
    icon: Clock01Icon,
    format: (value) => `${Math.round(value)} d`,
  },
  {
    key: "pending_approvals",
    title: "Pending approvals",
    info: "Products waiting on approvers in active reviews, counted once per approver",
    icon: UserCheck01Icon,
  },
  {
    key: "overdue",
    title: "Overdue",
    info: "Unreleased products past their target date",
    icon: AlertCircleIcon,
    metric: "overdue",
  },
];

export function AnalyticsStatsGrid({
  tiles,
  filters,
  isLoading,
}: {
  tiles?: Tiles;
  filters: AnalyticsFilters;
  isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-6">
      {STATS.map((stat) => {
        const value = tiles?.[stat.key];
        const content = (
          <div className="flex items-center gap-4">
            <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground transition-colors duration-150 ease-out group-hover:text-foreground sm:flex">
              <Icon icon={stat.icon} size={16} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm text-muted-foreground">
                  {stat.title}
                </p>
                <InfoTooltip content={stat.info} />
              </div>
              <div className="h-8 text-2xl font-semibold leading-8 tabular-nums">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 rounded" />
                ) : value == null ? (
                  "—"
                ) : (
                  (stat.format?.(value) ?? value)
                )}
              </div>
            </div>
          </div>
        );
        const className =
          "group relative flex border-b border-border p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden";

        return stat.metric ? (
          <Link
            key={stat.key}
            href={analyticsDrillHref(filters, stat.metric)}
            className={`${className} transition-colors duration-150 ease-out hover:bg-muted/40`}
          >
            {content}
          </Link>
        ) : (
          <div key={stat.key} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
