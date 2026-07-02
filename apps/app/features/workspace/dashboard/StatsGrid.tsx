"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetDashboardStats } from "@/hooks/dashboard/useGetDashboardStats";
import {
  ArchiveIcon,
  Blockchain03Icon,
  DashboardSpeed01Icon,
  Folder02Icon,
  KanbanIcon,
  NewOfficeIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { DashboardErrorState } from "./DashboardErrorState";

interface StatsCardProps {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  info: string;
}

function formatStatValue(value: number | undefined) {
  if (typeof value !== "number") {
    return "00";
  }

  return value <= 9 ? `0${value}` : String(value);
}

export function StatsGrid({ location }: { location: string }) {
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
      icon: <Icon icon={NewOfficeIcon} size={16} strokeWidth={2} />,
      info: "Total department in your organization's workspace",
    },
    {
      id: "projects",
      title: "Projects",
      value: dashboardStats?.data?.total_projects ?? 0,
      icon: <Icon icon={KanbanIcon} size={16} strokeWidth={2} />,
      info: "Total projects in your organization's workspace",
    },
    {
      id: "products",
      title: "Products",
      value: dashboardStats?.data?.total_products ?? 0,
      icon: <Icon icon={Blockchain03Icon} size={16} strokeWidth={2} />,
      info: "Total products in your organization's workspace",
    },
    {
      id: "source-files",
      title: "Source Files",
      value: dashboardStats?.data?.total_source_files ?? 0,
      icon: <Icon icon={Folder02Icon} size={16} strokeWidth={2} />,
      info: "Total source files uploaded in your organization's workspace",
    },
    {
      id: "archives",
      title: "Archives",
      value: "TBD", //To be updated
      icon: <Icon icon={ArchiveIcon} size={16} strokeWidth={2} />,
      info: "Total archived departments, projects and products in your organization's workspace",
    },
  ];
  const visibleStats = location === "archive" ? stats.slice(0, 3) : stats;

  if (statsLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 border-b border-border",
          location === "archive"
            ? "min-[1200px]:grid-cols-5"
            : "min-[1200px]:grid-cols-5",
        )}
      >
        {visibleStats.map((stat) => (
          <div
            key={stat.id}
            className="relative group flex w-full items-center justify-between p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden lg:p-4"
          >
            <div className="relative flex items-center gap-4">
              <div className="hidden size-10 mb-1 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-accent-foreground/60 sm:flex">
                {stat.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-normal text-sm text-muted-foreground/60">
                    {stat.title}
                  </p>
                  <InfoTooltip content={stat.info} />
                </div>
                <p className="mb-2 h-8 text-2xl font-semibold leading-8">
                  <Skeleton className="inline-block h-8 w-10 rounded" />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (statsError)
    return (
      <div
        className={cn(
          "flex h-22 items-center border-b border-border w-full p-2",
        )}
      >
        <DashboardErrorState
          icon={DashboardSpeed01Icon}
          title="Failed to load dashboard stats"
          className="h-full w-full"
        />
      </div>
    );

  return (
    <div
      className={cn(
        "grid grid-cols-2 border-b border-border",
        location === "archive"
          ? "min-[1200px]:grid-cols-5"
          : "min-[1200px]:grid-cols-5",
      )}
    >
      {visibleStats.map(({ id, title, value, icon, info }) => {
        return (
          <div
            key={id}
            className="relative group flex w-full items-center justify-between p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden lg:p-4"
          >
            <div className="relative flex items-center gap-4">
              <div
                className={cn(
                  "hidden size-10 mb-1 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-accent-foreground sm:flex",
                  "text-muted-foreground/60 group-hover:text-muted-foreground transition-colors ease-in-out delay-100 duration-200",
                )}
              >
                {icon}
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <p className="font-normal text-sm text-muted-foreground/60">
                    {title}
                  </p>
                  <InfoTooltip content={info} />
                </div>
                <p className="mb-2 h-8 text-2xl font-semibold leading-8">
                  {typeof value === "number" ? formatStatValue(value) : value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
