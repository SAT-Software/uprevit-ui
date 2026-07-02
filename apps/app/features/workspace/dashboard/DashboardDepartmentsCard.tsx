"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { ArrowUpRight01Icon, NewOfficeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@uprevit/ui/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { PiBuildingsDuotone } from "react-icons/pi";
import DepartmentCard from "../common/DepartmentCard";
import { DashboardErrorState, DASHBOARD_CARDS_ERROR_MIN_HEIGHT } from "./DashboardErrorState";

export interface DepartmentUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export interface DepartmentsProps {
  _id: string;
  image?: string;
  department_name: string;
  department_description: string;
  date?: string;
  manager?: string;
  users?: DepartmentUser[];
  members?: { name: string; src: string }[];
  membersCount?: number;
  auditLogs?: { actionAt: string; action: string }[];
}

function DashboardDepartmentsCard() {
  const {
    data: departmentsData,
    isLoading,
    isError,
  } = useGetAllDepartments({ limit: 5, sort: "actionAt", order: "desc" });

  const departments = departmentsData?.result?.departments ?? [];

  if (isLoading) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 justify-start px-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1 items-start gap-0 overflow-hidden">
            <div className="flex gap-2 items-center">
              <p className="shrink-0 text-base font-semibold">Departments</p>
              <InfoTooltip content="Departments group work inside your workspace, for example by function, site, or product line." />
            </div>
            <p className="truncate text-sm font-normal text-muted-foreground/80">
              Latest departments of your workspace
            </p>
          </div>
          <Link href="/departments" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>

        <div className="flex w-full min-w-0 flex-col items-start gap-2">
          {[...Array(2)].map((_, index) => (
            <DepartmentLoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 justify-start px-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1 items-start gap-0 overflow-hidden">
            <div className="flex gap-2 items-center">
              <p className="shrink-0 text-base font-semibold">Departments</p>
              <InfoTooltip content="Departments group work inside your workspace, for example by function, site, or product line." />
            </div>
            <p className="truncate text-sm font-normal text-muted-foreground/80">
              Latest departments of your workspace
            </p>
          </div>
          <Link href="/departments" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>

        <DashboardErrorState
          variant="panel"
          icon={NewOfficeIcon}
          title="Failed to load departments"
          className={DASHBOARD_CARDS_ERROR_MIN_HEIGHT}
        />
      </div>
    );
  }

  const filteredDepartments = (departments || [])?.slice(0, 2);

  if (filteredDepartments.length === 0)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-border rounded-xl bg-muted/30">
        <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
          <PiBuildingsDuotone className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            No departments found
          </p>
          <p className="text-xs text-muted-foreground">
            Get started by creating a new department
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 justify-start px-4">
      <div className="flex w-full min-w-0 items-center justify-between gap-2">
        <div className="flex flex-col min-w-0 flex-1 items-start gap-0 overflow-hidden">
          <div className="flex gap-2 items-center">
            <p className="shrink-0 text-base font-semibold">Departments</p>
            <InfoTooltip content="Departments group work inside your workspace, for example by function, site, or product line." />
          </div>
          <p className="truncate text-sm font-normal text-muted-foreground/80">
            Latest departments of your workspace
          </p>
        </div>
        <Link href="/departments" className="shrink-0 group">
          <Button size="sm" variant="secondary">
            Show All
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={16}
              strokeWidth={2}
              className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
            />
          </Button>
        </Link>
      </div>

      <div className="flex w-full min-w-0 flex-col items-start gap-2">
        {filteredDepartments.map((department: DepartmentsProps) => (
          <DepartmentCard
            key={department._id}
            department={department}
            location="dashboard"
          />
        ))}
      </div>
    </div>
  );
}

function DepartmentLoadingCard() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center w-full border border-border rounded-2xl p-3 gap-4">
        <Skeleton className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg" />
        <div className="flex flex-col flex-1 gap-1 min-w-0 w-full">
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute flex items-center bottom-3 right-3">
        <div className="flex items-center -space-x-2">
          <Skeleton className="size-7 rounded-full border-2 border-background" />
          <Skeleton className="size-7 rounded-full border-2 border-background" />
          <Skeleton className="size-7 rounded-full border-2 border-background" />
        </div>
      </div>
    </div>
  );
}

export default DashboardDepartmentsCard;
