"use client";

import { useGetDashboardStats } from "@/hooks/dashboard/useGetDashboardStats";
import { cn } from "@uprevit/ui/lib/utils";
import { IconType } from "react-icons";
import {
  PiBuildingsDuotone,
  PiKanbanDuotone,
  PiPackageDuotone,
  PiFolderOpenDuotone,
} from "react-icons/pi";
interface StatsCardProps {
  id: string;
  title: string;
  value: number;
  icon: IconType;
}

interface StatsGridProps {
  location: string;
}

function formatStatValue(value: number | undefined) {
  if (typeof value !== "number") {
    return "00";
  }

  return value <= 9 ? `0${value}` : String(value);
}

function StatCard({ title, value, icon: Icon }: Omit<StatsCardProps, "id">) {
  return (
    <div className="relative flex w-full items-center justify-between p-4 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-linear-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-accent/80 text-accent-foreground sm:flex">
          <Icon />
        </div>
        <div>
          <div className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0">
            {title}
          </div>
          <div className="mb-2 text-2xl font-semibold">
            {formatStatValue(value)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton({
  title,
  icon: Icon,
}: Omit<StatsCardProps, "id" | "value">) {
  return (
    <div className="relative flex w-full items-center justify-between p-4 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-linear-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-accent/80 text-accent-foreground sm:flex">
          <Icon className="animate-pulse" />
        </div>
        <div>
          <div className="font-medium text-xs uppercase text-muted-foreground">
            {title}
          </div>
          <div className="mb-2 text-2xl font-semibold">
            <div className="h-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsGrid({ location }: StatsGridProps) {
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardStats();

  const stats: StatsCardProps[] = [
    {
      id: "departments",
      title: "Departments",
      value: dashboardStats?.data?.total_departments ?? 0,
      icon: PiBuildingsDuotone,
    },
    {
      id: "projects",
      title: "Projects",
      value: dashboardStats?.data?.total_projects ?? 0,
      icon: PiKanbanDuotone,
    },
    {
      id: "products",
      title: "Products",
      value: dashboardStats?.data?.total_products ?? 0,
      icon: PiPackageDuotone,
    },
    {
      id: "source-files",
      title: "Source Files",
      value: dashboardStats?.data?.total_source_files ?? 0,
      icon: PiFolderOpenDuotone,
    },
  ];
  const visibleStats = location === "archive" ? stats.slice(0, 3) : stats;

  if (statsLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 border border-border rounded-xl bg-linear-to-br from-background/90 to-background",
          location === "archive"
            ? "min-[1200px]:grid-cols-3"
            : "min-[1200px]:grid-cols-4",
        )}
      >
        {visibleStats.map((stat) => (
          <StatCardSkeleton key={stat.id} title={stat.title} icon={stat.icon} />
        ))}
      </div>
    );
  }

  if (statsError) return <div>Error loading stats: {statsError.message}</div>;

  return (
    <div
      className={cn(
        "grid grid-cols-2 border border-border rounded-xl bg-linear-to-br from-background/90 to-background",
        location === "archive"
          ? "min-[1200px]:grid-cols-3"
          : "min-[1200px]:grid-cols-4",
      )}
    >
      {visibleStats.map(({ id, ...stat }) => (
        <StatCard key={id} {...stat} />
      ))}
    </div>
  );
}
