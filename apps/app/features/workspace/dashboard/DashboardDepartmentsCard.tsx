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
  PiBuildingsDuotone,
} from "react-icons/pi";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Badge } from "@uprevit/ui/components/ui/badge";

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
          <div key={department._id} className="relative w-full">
            <Link
              href={`/departments/${department._id}`}
              className="group relative flex flex-col md:flex-row items-start md:items-center w-full border border-border bg-card rounded-2xl p-3 gap-4 hover:ring-2 hover:ring-border/60 hover:border-border transition-all delay-100 duration-200 ease-in-out"
            >
              <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
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
              </div>

              <div className="flex flex-col flex-1 gap-1 min-w-0">
                <div className="flex flex-col gap-0">
                  <p className="text-sm font-semibold text-foreground truncate pr-8">
                    {department.department_name}
                  </p>
                  <p className="flex items-center w-2/3 gap-1.5 text-xs text-muted-foreground line-clamp-1">
                    <span className="truncate">
                      {department.department_description}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="large">
                        <HugeiconsIcon
                          icon={Calendar03Icon}
                          size={14}
                          strokeWidth={2}
                        />
                        <span>
                          {department?.auditLogs?.[0]?.actionAt
                            ? formatToLocalDate(
                                department?.auditLogs?.[0].actionAt,
                              )
                            : "No activity"}
                        </span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Department created date or last modified date</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </Link>

            <div className="absolute flex items-center bottom-3 right-3">
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
                    location="Department"
                  />
                );
              })()}
            </div>
          </div>
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
