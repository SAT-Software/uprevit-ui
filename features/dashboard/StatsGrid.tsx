"use client";

import { useGetDashboardStats } from "@/hooks/dashboard/useGetDashboardStats";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import {
  PiCirclesThreePlusDuotone,
  PiKanbanDuotone,
  PiStackPlusDuotone,
  PiFolderOpenDuotone,
} from "react-icons/pi";

export interface StatsCardProps {
  title: string;
  value: string;
  icon: IconType;
  location: string;
}

interface StatsGridProps {
  location: string;
}

export function StatsGrid({ location }: StatsGridProps) {
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardStats();

  if (statsLoading) return <div>Loading...</div>;

  console.log("Dashboard stats", dashboardStats);

  if (statsError) return <div>Error loading stats: {statsError.message}</div>;

  return (
    <div
      className={cn(
        "grid grid-cols-2 border border-border rounded-xl bg-gradient-to-br from-background/90 to-background",
        location === "archive"
          ? "min-[1200px]:grid-cols-3"
          : "min-[1200px]:grid-cols-4"
      )}
    >
      <div className="relative flex justify-between items-center w-full p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
        <div className="relative flex items-center gap-4">
          <div
            className={
              location === "archive"
                ? "max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-input flex items-center justify-center text-black dark:text-white"
                : "max-[480px]:hidden size-10 shrink-0 rounded-full bg-neutral-200/25 border border-neutral-600/50 flex items-center justify-center text-neutral-500"
            }
          >
            <PiStackPlusDuotone />
          </div>

          <div>
            <div className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0">
              Departments
            </div>
            <div className="text-2xl font-semibold mb-2">
              {dashboardStats?.data?.total_departments <= 9
                ? `0${dashboardStats?.data?.total_departments}`
                : dashboardStats?.data?.total_departments}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-between items-center w-full p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
        <div className="relative flex items-center gap-4">
          <div
            className={
              location === "archive"
                ? "max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-input flex items-center justify-center text-black dark:text-white"
                : "max-[480px]:hidden size-10 shrink-0 rounded-full bg-neutral-200/25 border border-neutral-600/50 flex items-center justify-center text-neutral-500"
            }
          >
            <PiCirclesThreePlusDuotone />
          </div>

          <div>
            <div className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0">
              Departments
            </div>
            <div className="text-2xl font-semibold mb-2">
              {dashboardStats?.data?.total_projects <= 9
                ? `0${dashboardStats?.data?.total_projects}`
                : dashboardStats?.data?.total_projects}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-between items-center w-full p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
        <div className="relative flex items-center gap-4">
          <div
            className={
              location === "archive"
                ? "max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-input flex items-center justify-center text-black dark:text-white"
                : "max-[480px]:hidden size-10 shrink-0 rounded-full bg-neutral-200/25 border border-neutral-600/50 flex items-center justify-center text-neutral-500"
            }
          >
            <PiKanbanDuotone />
          </div>

          <div>
            <div className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0">
              Departments
            </div>
            <div className="text-2xl font-semibold mb-2">
              {dashboardStats?.data?.total_products <= 9
                ? `0${dashboardStats?.data?.total_products}`
                : dashboardStats?.data?.total_products}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-between items-center w-full p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
        <div className="relative flex items-center gap-4">
          <div
            className={
              location === "archive"
                ? "max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-input flex items-center justify-center text-black dark:text-white"
                : "max-[480px]:hidden size-10 shrink-0 rounded-full bg-neutral-200/25 border border-neutral-600/50 flex items-center justify-center text-neutral-500"
            }
          >
            <PiFolderOpenDuotone />
          </div>

          <div>
            <div className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0">
              Departments
            </div>
            <div className="text-2xl font-semibold mb-2">
              {dashboardStats?.data?.total_source_files <= 9
                ? `0${dashboardStats?.data?.total_source_files}`
                : dashboardStats?.data?.total_source_files}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
