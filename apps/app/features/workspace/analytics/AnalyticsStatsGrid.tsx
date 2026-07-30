"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import {
  AlertCircleIcon,
  ArchiveIcon,
  Blockchain03Icon,
  CheckmarkCircle02Icon,
  PropertyEditIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";

interface AnalyticsKpi {
  totalProducts: number;
  draftCount: number;
  submittedCount: number;
  archivedCount: number;
  overdueCount: number;
}

interface AnalyticsStatsGridProps {
  kpi: AnalyticsKpi;
  isLoading: boolean;
}

function formatStatValue(value: number) {
  return value <= 9 ? `0${value}` : String(value);
}

const STATS = [
  {
    id: "total-products",
    title: "Total Products",
    key: "totalProducts" as const,
    icon: Blockchain03Icon,
    info: "Total active products in your workspace",
  },
  {
    id: "draft",
    title: "Draft",
    key: "draftCount" as const,
    icon: PropertyEditIcon,
    info: "Products still in draft status",
  },
  {
    id: "submitted",
    title: "Submitted",
    key: "submittedCount" as const,
    icon: CheckmarkCircle02Icon,
    info: "Products that have been submitted",
  },
  {
    id: "archived",
    title: "Archived",
    key: "archivedCount" as const,
    icon: ArchiveIcon,
    info: "Products archived from your workspace",
  },
  {
    id: "overdue",
    title: "Overdue",
    key: "overdueCount" as const,
    icon: AlertCircleIcon,
    info: "Draft products past their target date",
  },
];

export function AnalyticsStatsGrid({ kpi, isLoading }: AnalyticsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 border-b border-border min-[1200px]:grid-cols-5">
      {STATS.map((stat) => (
        <div
          key={stat.id}
          className="relative group flex w-full items-center justify-between p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden lg:p-4"
        >
          <div className="relative flex items-center gap-4">
            <div
              className={cn(
                "hidden size-10 mb-1 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-accent-foreground sm:flex",
                "text-muted-foreground/60 group-hover:text-muted-foreground transition-colors ease-in-out delay-100 duration-200",
              )}
            >
              <Icon icon={stat.icon} size={16} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-normal text-sm text-muted-foreground/60">
                  {stat.title}
                </p>
                <InfoTooltip content={stat.info} />
              </div>
              <p className="mb-2 h-8 text-2xl font-semibold leading-8">
                {isLoading ? (
                  <Skeleton className="inline-block h-8 w-10 rounded" />
                ) : (
                  formatStatValue(kpi[stat.key])
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
