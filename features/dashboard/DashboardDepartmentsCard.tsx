"use client";

import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { Department } from "@/types/department";
import { CalendarClock, Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  PiArrowSquareOutDuotone,
  PiCirclesThreePlusDuotone,
} from "react-icons/pi";

// Loading State Component
function DepartmentLoadingCard() {
  return (
    <div className="flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4">
      <div className="flex items-center relative w-full h-27 md:w-40">
        <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
          <PiCirclesThreePlusDuotone className="w-8 h-8 text-muted-foreground pulse-animation" />
        </div>
      </div>
      <div className="flex flex-col items-start justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-1 w-full">
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function DepartmentEmptyState() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full min-h-[200px] py-8">
      <div className="flex items-center justify-center">
        <PiCirclesThreePlusDuotone className="w-32 h-32 text-accent" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xs md:text-sm font-medium text-muted-foreground/70">
          No departments available
        </p>
      </div>
    </div>
  );
}

// Error State Component
function DepartmentErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8">
      <div className="flex items-center justify-center">
        <PiCirclesThreePlusDuotone className="w-12 h-12 text-destructive/60" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-base font-semibold text-foreground">
          Failed to load departments
        </p>
        <p className="text-sm text-muted-foreground">
          Please try again or contact support if the problem persists
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

// Department Card Component
function DepartmentCard({ department }: { department: Department }) {
  return (
    <div className="relative flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4">
      <div className="absolute right-2 top-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/departments/${department._id}`}
              aria-label="Open department details"
            >
              <Button variant="ghost" size="icon">
                <PiArrowSquareOutDuotone className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Open department details</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center relative w-full h-27 md:w-40">
        {department.image ? (
          <Image
            src={department.image}
            fill
            alt="Department"
            className="object-cover rounded-md border border-input"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
            <PiCirclesThreePlusDuotone className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-1">
          <p className="text-base font-semibold">
            {department.department_name}
          </p>
          <p className="flex items-start gap-1 text-xs text-muted-foreground">
            <span>
              <Text className="mr-1 w-4 h-4" />
            </span>
            {department.department_description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>
              <CalendarClock className="mr-1 w-4 h-4" />
            </span>
            <p className="text-xs text-muted-foreground">
              {department.actionAt
                ? new Date(department.actionAt).toLocaleDateString()
                : "No date"}
            </p>
          </div>

          <div className="flex items-center -space-x-[0.525rem] mr-3">
            {(() => {
              const users = (department.users || []).map(
                (u: string, i: number) => ({
                  _id: String(u ?? i),
                  name: `User ${i + 1}`,
                  email: `user${i + 1}@example.com`,
                  profileAvatar: u,
                })
              );
              return (
                <MembersInlineTrigger
                  users={users}
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
  } = useGetAllDepartments();

  const departments = departmentsData?.result?.departments ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
        <div className="flex items-center w-full justify-between">
          <p className="text-base font-semibold">Recent Departments</p>
          <Link href="/departments">
            <Button variant="outline" disabled>
              All Departments
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
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
        <div className="flex items-center w-full justify-between">
          <p className="text-base font-semibold">Recent Departments</p>
          <Link href="/departments">
            <Button variant="outline">All Departments</Button>
          </Link>
        </div>

        <DepartmentErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  // Filter out the first 2 departments as requested
  const filteredDepartments = (departments || [])?.slice(0, 2);

  return (
    <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
      <div className="flex items-center w-full justify-between">
        <p className="text-base font-semibold">Recent Departments</p>
        <Link href="/departments">
          <Button variant="outline">All Departments</Button>
        </Link>
      </div>

      <div className="flex flex-col items-start w-full gap-2">
        {filteredDepartments.length === 0 ? (
          <DepartmentEmptyState />
        ) : (
          filteredDepartments.map((department: Department) => (
            <DepartmentCard key={department._id} department={department} />
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardDepartmentsCard;
