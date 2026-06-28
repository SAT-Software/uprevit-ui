"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@uprevit/ui/components/ui/button";
import Link from "next/link";
import {
  PiArrowCircleUpRightDuotone,
  PiBuildingsDuotone,
} from "react-icons/pi";
import DepartmentCard from "../common/DepartmentCard";

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

export default DashboardDepartmentsCard;

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
