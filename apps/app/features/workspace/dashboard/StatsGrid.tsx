"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import {
  ARCHIVE_ACTIVITY_META,
  DashboardStatActivityBadge,
  DEPARTMENT_ACTIVITY_META,
  PRODUCT_ACTIVITY_META,
  PROJECT_ACTIVITY_META,
  SOURCE_FILE_ACTIVITY_META,
} from "@/features/workspace/dashboard/DashboardStatActivityBadge";
import { useGetDashboardActivityStats } from "@/hooks/dashboard/useGetDashboardActivityStats";
import { useGetDashboardStats } from "@/hooks/dashboard/useGetDashboardStats";
import {
  ArchiveIcon,
  Blockchain03Icon,
  Chart01Icon,
  Chart02Icon,
  ChartBreakoutSquareIcon,
  ChartBubble02Icon,
  ChartNoAxesCombinedIcon,
  ChartUpIcon,
  DashboardSpeed01Icon,
  Folder02Icon,
  KanbanIcon,
  NewOfficeIcon,
  TimelineEventIcon,
  UploadSquare01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
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
  const {
    data: activityStats,
    isLoading: activityLoading,
    isError: activityError,
  } = useGetDashboardActivityStats();

  const activity = activityStats?.data;

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
      value: dashboardStats?.data?.total_archives ?? 0,
      icon: <Icon icon={ArchiveIcon} size={16} strokeWidth={2} />,
      info: "Total archived departments, projects and products in your organization's workspace",
    },
  ];
  const visibleStats = location === "archive" ? stats.slice(0, 3) : stats;

  function renderActivityBadge(statId: string) {
    if (activityLoading) {
      return <Skeleton className="h-4 w-16" />;
    }

    if (activityError || !activity) {
      return null;
    }

    switch (statId) {
      case "departments":
        return (
          <DashboardStatActivityBadge
            total={activity.departments.total}
            breakdown={activity.departments}
            meta={DEPARTMENT_ACTIVITY_META}
            icon={Chart01Icon}
          />
        );
      case "projects":
        return (
          <DashboardStatActivityBadge
            total={activity.projects.total}
            breakdown={activity.projects}
            meta={PROJECT_ACTIVITY_META}
            icon={Chart01Icon}
          />
        );
      case "products":
        return (
          <DashboardStatActivityBadge
            total={activity.products.total}
            breakdown={activity.products}
            meta={PRODUCT_ACTIVITY_META}
            icon={Chart01Icon}
          />
        );
      case "source-files":
        return (
          <DashboardStatActivityBadge
            total={activity.source_files.total}
            breakdown={activity.source_files}
            meta={SOURCE_FILE_ACTIVITY_META}
            icon={Chart01Icon}
          />
        );
      case "archives":
        return (
          <DashboardStatActivityBadge
            total={activity.archives.total}
            breakdown={activity.archives}
            meta={ARCHIVE_ACTIVITY_META}
            icon={Chart01Icon}
            variant="archive"
          />
        );
      default:
        return null;
    }
  }

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
          <div key={stat.id} className="relative group flex w-full min-h-[88px] p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden lg:p-4">
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
                <p className="h-8 text-2xl font-semibold leading-8">
                  <Skeleton className="inline-block h-8 w-10 rounded" />
                </p>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4">
              <Skeleton className="h-4 w-16" />
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
          <div key={id} className="relative group flex w-full min-h-[88px] p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden lg:p-4">
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
                <p className="h-8 text-2xl font-semibold leading-8">
                  {typeof value === "number" ? formatStatValue(value) : value}
                </p>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4">
              {renderActivityBadge(id)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
