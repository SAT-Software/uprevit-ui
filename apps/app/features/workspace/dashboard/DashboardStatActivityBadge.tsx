"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import type {
  DashboardActivityBreakdown,
  DashboardArchiveActivityBreakdown,
} from "@/hooks/dashboard/useGetDashboardActivityStats";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import { Separator } from "@uprevit/ui/components/ui/separator";
import { cn } from "@uprevit/ui/lib/utils";

type ActivityMeta = {
  label: string;
  title: string;
  windowLabel: string;
  description: string;
};

type ArchiveMeta = {
  label: string;
  title: string;
  windowLabel: string;
  description: string;
};

function formatCount(value: number) {
  return value <= 9 ? `0${value}` : String(value);
}

function BreakdownRow({
  label,
  value,
  prominent = false,
}: {
  label: string;
  value: number;
  prominent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p
        className={cn(
          "text-xs tabular-nums",
          prominent
            ? "font-medium text-foreground"
            : "font-normal text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "tabular-nums",
          prominent
            ? "text-sm font-semibold text-emerald-600 dark:text-emerald-400"
            : cn(
                "text-xs font-semibold",
                value > 0 ? "text-foreground" : "text-muted-foreground/60",
              ),
        )}
      >
        {formatCount(value)}
      </p>
    </div>
  );
}

export function DashboardStatActivityBadge({
  total,
  breakdown,
  meta,
  icon,
  variant = "activity",
}: {
  total: number;
  breakdown: DashboardActivityBreakdown | DashboardArchiveActivityBreakdown;
  meta: ActivityMeta | ArchiveMeta;
  icon: IconProps["icon"];
  variant?: "activity" | "archive";
}) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-1 text-sm font-medium leading-none transition-colors cursor-pointer",
            total > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground/60",
          )}
        >
          <Icon
            icon={icon}
            size={14}
            strokeWidth={2}
            className={cn(
              total > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground/60",
            )}
          />
          <span>{formatCount(total)}</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-0" align="end">
        <div className="flex h-10 items-center gap-2 px-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <p className="truncate text-sm font-medium text-foreground">
              {meta.title}
            </p>
            <InfoTooltip
              content={meta.description}
              ContentClassName="max-w-[240px]"
            />
          </div>
          <span className="shrink-0 text-xs font-normal text-muted-foreground/60">
            {meta.windowLabel}
          </span>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 px-4 py-3">
          {variant === "archive" ? (
            <>
              <BreakdownRow
                label="Departments"
                value={
                  (breakdown as DashboardArchiveActivityBreakdown).departments
                }
              />
              <BreakdownRow
                label="Projects"
                value={
                  (breakdown as DashboardArchiveActivityBreakdown).projects
                }
              />
              <BreakdownRow
                label="Products"
                value={
                  (breakdown as DashboardArchiveActivityBreakdown).products
                }
              />
              <BreakdownRow label="Total" value={total} prominent />
            </>
          ) : (
            <>
              <BreakdownRow
                label="Created only"
                value={(breakdown as DashboardActivityBreakdown).created_only}
              />
              <BreakdownRow
                label="Updated only"
                value={(breakdown as DashboardActivityBreakdown).updated_only}
              />
              <BreakdownRow
                label="Both"
                value={(breakdown as DashboardActivityBreakdown).both}
              />
              <BreakdownRow label="Total" value={total} prominent />
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export const DEPARTMENT_ACTIVITY_META: ActivityMeta = {
  label: "active",
  title: "Active departments",
  windowLabel: "last 30 days",
  description:
    "Non-archived departments with at least one product created or updated in the last 30 days.",
};

export const PROJECT_ACTIVITY_META: ActivityMeta = {
  label: "active",
  title: "Active projects",
  windowLabel: "last 30 days",
  description:
    "Non-archived projects with at least one product created or updated in the last 30 days.",
};

export const PRODUCT_ACTIVITY_META: ActivityMeta = {
  label: "active",
  title: "Active products",
  windowLabel: "last 30 days",
  description:
    "Active products that were created or updated in the last 30 days.",
};

export const SOURCE_FILE_ACTIVITY_META: ActivityMeta = {
  label: "active",
  title: "Active source files",
  windowLabel: "last 30 days",
  description:
    "Source files uploaded or updated in the last 30 days across your workspace.",
};

export const ARCHIVE_ACTIVITY_META: ArchiveMeta = {
  label: "archived",
  title: "Recently archived",
  windowLabel: "last 30 days",
  description:
    "Departments, projects, and products that were archived in the last 30 days.",
};
