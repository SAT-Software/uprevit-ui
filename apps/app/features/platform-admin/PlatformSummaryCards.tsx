"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetPlatformSummary } from "@/hooks/platform-admin/useGetPlatformSummary";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  LimitationIcon,
  CreditCardIcon,
  DashboardSquare01Icon,
  UserGroupIcon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";

interface PlatformStat {
  id: string;
  title: string;
  value: number | string;
  icon: IconProps["icon"];
  info: string;
}

function formatStatValue(value: number | string) {
  if (typeof value !== "number") return value;
  return value <= 9 ? `0${value}` : String(value);
}

function PlatformStatCard({
  title,
  value,
  icon,
  info,
}: Omit<PlatformStat, "id">) {
  return (
    <div className="relative group flex w-full items-center justify-between p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden">
      <div className="relative flex items-center gap-4">
        <div
          className={cn(
            "hidden size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-accent-foreground/60 sm:flex",
            "transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground",
          )}
        >
          <Icon
            className="text-muted-foreground/60 group-hover:text-muted-foreground"
            icon={icon}
            size={16}
            strokeWidth={2}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-normal text-muted-foreground/60">
              {title}
            </p>
            <InfoTooltip content={info} />
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {formatStatValue(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlatformStatCardSkeleton({
  title,
  icon,
}: {
  title: string;
  icon: IconProps["icon"];
}) {
  return (
    <div className="relative group flex w-full items-center justify-between p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden">
      <div className="relative flex items-center gap-4">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-accent-foreground/60 sm:flex">
          <Icon icon={icon} size={16} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-normal text-muted-foreground/60">
            {title}
          </p>
          <p className="text-2xl font-semibold">
            <Skeleton className="inline-block h-7 w-10 rounded" />
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlatformSummaryCards() {
  const { data, isLoading } = useGetPlatformSummary();
  const pastDue = data?.billing.pastDueWorkspaces ?? 0;

  const stats: PlatformStat[] = [
    {
      id: "workspaces",
      title: "Workspaces",
      value: data?.totalWorkspaces ?? 0,
      icon: DashboardSquare01Icon,
      info: "Total customer organization workspaces on the platform.",
    },
    {
      id: "active",
      title: "Active users",
      value: data?.activeUsers ?? 0,
      icon: UserGroupIcon,
      info: "Users currently active across all workspaces.",
    },
    {
      id: "admins",
      title: "Workspace admins",
      value: data?.workspaceAdmins ?? 0,
      icon: UserShield01Icon,
      info: "Organization admins across all workspaces.",
    },
    {
      id: "billing",
      title: "Billing accounts",
      value: data?.billing.accountsLinked ?? 0,
      icon: CreditCardIcon,
      info: "Workspaces with a linked billing account.",
    },
    {
      id: "limits",
      title: "Limits enabled",
      value: data?.billing.limitsEnabledWorkspaces ?? 0,
      icon: LimitationIcon,
      info: `Workspaces with usage limit enforcement enabled. ${pastDue} past due.`,
    },
  ];

  return (
    <div className="grid grid-cols-2 border-b border-border bg-background min-[1200px]:grid-cols-5">
      {isLoading
        ? stats.map((stat) => (
            <PlatformStatCardSkeleton
              key={stat.id}
              title={stat.title}
              icon={stat.icon}
            />
          ))
        : stats.map(({ id, ...stat }) => (
            <PlatformStatCard key={id} {...stat} />
          ))}
    </div>
  );
}
