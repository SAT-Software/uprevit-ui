"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { ArrowUpRight01Icon, NewOfficeIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import DepartmentCard from "../common/DepartmentCard";
import {
  ErrorState,
  CARDS_STATE_MIN_HEIGHT,
} from "@/components/common/ErrorState";

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

function DepartmentsCardHeader() {
  return (
    <div className="w-full flex items-center justify-between border-b h-10 pl-3 pr-2 bg-muted/60">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">Departments</h2>
        <InfoTooltip content="Departments group work inside your workspace, for example by function, site, or product line." />
      </div>
      <Button asChild size="sm" variant="secondary" className="shrink-0 group">
        <Link href="/departments" aria-label="Show all departments">
          Show all
          <Icon
            icon={ArrowUpRight01Icon}
            size={16}
            strokeWidth={2}
            className="text-foreground/40 group-hover:text-foreground transition-colors duration-150 ease-out"
          />
        </Link>
      </Button>
    </div>
  );
}

function DashboardDepartmentsCard() {
  const {
    data: departmentsData,
    isPending: isLoading,
    isError: isQueryError,
    refetch,
  } = useGetAllDepartments({ limit: 5, sort: "actionAt", order: "desc" });

  const isError = isQueryError && !departmentsData;
  const departments = departmentsData?.result?.departments ?? [];

  if (isLoading) {
    return (
      <div className="w-full min-w-0 flex-1 border border-border rounded-2xl overflow-hidden">
        <DepartmentsCardHeader />
        <div className="flex w-full min-w-0 flex-col items-start">
          {[...Array(2)].map((_, index) => (
            <DepartmentLoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-w-0 flex-1 border border-border rounded-2xl overflow-hidden">
        <DepartmentsCardHeader />
        <ErrorState
          variant="panel"
          embedded
          icon={NewOfficeIcon}
          title="Failed to load departments"
          onRetry={() => refetch()}
          className={CARDS_STATE_MIN_HEIGHT}
        />
      </div>
    );
  }

  const filteredDepartments = (departments || [])?.slice(0, 2);

  if (filteredDepartments.length === 0) {
    return (
      <div className="w-full min-w-0 flex-1 border border-border rounded-2xl overflow-hidden">
        <DepartmentsCardHeader />
        <EmptyState
          embedded
          icon={NewOfficeIcon}
          title="No departments found"
          description="Get started by creating a new department"
          className={CARDS_STATE_MIN_HEIGHT}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex-1 border border-border rounded-2xl overflow-hidden">
      <DepartmentsCardHeader />
      <div className="flex w-full min-w-0 flex-col items-start">
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
    <div className="relative w-full border-b border-border last:border-b-0">
      <div className="flex flex-col md:flex-row items-start md:items-center w-full p-3 gap-4 rounded-none">
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
