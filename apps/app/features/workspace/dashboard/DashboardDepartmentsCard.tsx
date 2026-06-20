"use client";

import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import Image from "next/image";
import Link from "next/link";
import {
  PiArrowCircleUpRightDuotone,
  PiCalendarDuotone,
  PiBuildingsDuotone,
} from "react-icons/pi";

interface DepartmentUser {
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

function DepartmentLoadingCard() {
  return (
    <div className="flex flex-col md:flex-row items-center w-full border border-border bg-card rounded-xl p-3 gap-4">
      <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg bg-muted animate-pulse" />
      <div className="flex flex-col flex-1 gap-2 w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="flex items-center justify-between w-full gap-4 mt-1">
          <div className="h-6 bg-muted rounded w-24 animate-pulse" />
          <div className="h-6 bg-muted rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function DepartmentEmptyState() {
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
}

function DepartmentErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
        <PiBuildingsDuotone className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-destructive">
          Failed to load departments
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
        Try Again
      </Button>
    </div>
  );
}

function DepartmentCard({ department }: { department: DepartmentsProps }) {
  return (
    <div className="group relative flex flex-col md:flex-row items-start md:items-center w-full border border-border bg-card rounded-xl p-3 gap-4">
      <div className="absolute right-3 top-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/departments/${department._id}`}
              aria-label="Open department details"
            >
              <button className="cursor-pointer">
                <PiArrowCircleUpRightDuotone className="h-4 w-4" />
              </button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Open department details</TooltipContent>
        </Tooltip>
      </div>

      <Link
        href={`/departments/${department._id}`}
        className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg overflow-hidden border border-border bg-muted"
      >
        {department.image ? (
          <Image
            src={department.image}
            fill
            alt={department.department_name}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <PiBuildingsDuotone className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <Link
          href={`/departments/${department._id}`}
          className="flex flex-col gap-0"
        >
          <p className="text-sm font-semibold text-foreground truncate pr-8">
            {department.department_name}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1">
            <span className="truncate">
              {department.department_description}
            </span>
          </p>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <Link
            href={`/departments/${department._id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50"
          >
            <PiCalendarDuotone className="w-3.5 h-3.5" />
            <span>
              {department?.auditLogs?.[0]?.actionAt
                ? formatToLocalDate(department?.auditLogs?.[0].actionAt)
                : "No activity"}
            </span>
          </Link>

          <div className="flex items-center -space-x-[0.525rem] mr-3">
            {(() => {
              const usersData = department?.users;
              const users = usersData?.map((user) => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileAvatar: user.profileAvatar,
              }));
              return (
                <MembersInlineTrigger
                  users={users || []}
                  titlePrefix={department.department_name}
                />
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Departments Card Component
function DashboardDepartmentsCard() {
  const {
    data: departmentsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllDepartments({ limit: 5, sort: "actionAt", order: "desc" });

  const departments = departmentsData?.result?.departments ?? [];

  if (isLoading) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-4 justify-start rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Departments</p>
          <Link href="/departments">
            <Button size="sm" variant="secondary">
              <PiArrowCircleUpRightDuotone />
              Show All
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-start w-full gap-2">
          {[...Array(2)].map((_, index) => (
            <DepartmentLoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-4 justify-start rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Departments</p>
          <Link href="/departments">
            <Button size="sm" variant="secondary">
              <PiArrowCircleUpRightDuotone />
              Show All
            </Button>
          </Link>
        </div>

        <DepartmentErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const filteredDepartments = (departments || [])?.slice(0, 2);

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-4 justify-start rounded-xl border border-border bg-background p-4">
      <div className="flex w-full min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <p className="shrink-0 text-base font-semibold">Departments</p>
          <div className="h-1 w-1 shrink-0 rounded-full border border-border bg-border" />
          <p className="truncate text-xs font-medium text-muted-foreground">
            Latest departments of your workspace
          </p>
        </div>
        <Link href="/departments" className="shrink-0">
          <Button size="sm" variant="secondary">
            <PiArrowCircleUpRightDuotone />
            Show All
          </Button>
        </Link>
      </div>

      <div className="flex w-full min-w-0 flex-col items-start gap-2">
        {filteredDepartments.length === 0 ? (
          <DepartmentEmptyState />
        ) : (
          filteredDepartments.map((department: DepartmentsProps) => (
            <DepartmentCard key={department._id} department={department} />
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardDepartmentsCard;
