"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { WorkspaceListToolbarSkeleton } from "@/components/table/WorkspaceListToolbarSkeleton";
import DepartmentCard from "@/features/workspace/common/DepartmentCard";
import CreateDepartmentDialog from "@/features/workspace/departments/CreateDepartmentDialog";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";
import {
  SortingAZ01Icon,
  SortingAZ02Icon,
  SortingZA01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { PiBuildingsDuotone } from "react-icons/pi";

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

const DEPARTMENT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "department_name", label: "Department Name", type: "text" },
  { name: "department_description", label: "Description", type: "text" },
  { name: "manager", label: "Manager", type: "text" },
  { name: "lastChangedBy", label: "Last Changed By", type: "text" },
  { name: "lastChangedOn", label: "Last Changed On", type: "date" },
];

const DEPARTMENT_SORT_OPTIONS = [
  { value: "department_name", label: "Department Name" },
  { value: "department_description", label: "Description" },
  { value: "manager", label: "Manager" },
  { value: "actionAt", label: "Last Changed" },
];

function DepartmentsPage() {
  const listState = useWorkspaceListQuery({
    defaultSort: "department_name",
    allowedSortFields: DEPARTMENT_SORT_OPTIONS.map((option) => option.value),
    filterColumns: DEPARTMENT_FILTER_COLUMNS,
  });
  const {
    data: departmentsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllDepartments(listState.query);

  const departments = departmentsData?.result?.departments ?? [];
  const pagination = departmentsData?.result?.pagination;

  if (isError) {
    return <DepartmentErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-2 min-h-full">
      <div className="flex flex-1 flex-col items-start justify-start w-full h-auto">
        <div className="flex flex-col items-start w-full mb-4">
          <div className="p-2 h-10 pl-3 w-full flex border-b border-border items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">All Departments</p>
              <InfoTooltip content="All the departments in your workspace. Departments group your work inside your workspace, for example by function, site, or product line." />
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <WorkspaceListToolbarSkeleton />
              ) : (
                <div className="flex flex-wrap items-center gap-2 w-full">
                  <WorkspaceListControls
                    filters={listState.query.filters}
                    filterColumns={DEPARTMENT_FILTER_COLUMNS}
                    onApplyFilters={listState.setFilters}
                    onClearFilters={listState.clearFilters}
                  />
                  <div className="flex items-center gap-2">
                    <Select
                      value={listState.query.sort}
                      onValueChange={(sort) =>
                        listState.setSort(sort, listState.query.order)
                      }
                    >
                      <SelectTrigger className="w-auto truncate group">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon
                                icon={SortingAZ01Icon}
                                size={16}
                                strokeWidth={2}
                                className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                              />

                              <SelectValue />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Sort by different fields
                          </TooltipContent>
                        </Tooltip>
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENT_SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="text-muted-foreground/60">
                              Sort by:
                            </span>{" "}
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground/60 hover:text-muted-foreground"
                          onClick={() =>
                            listState.setSort(
                              listState.query.sort,
                              listState.query.order === "asc" ? "desc" : "asc",
                            )
                          }
                        >
                          {listState.query.order === "asc" ? (
                            <HugeiconsIcon
                              icon={SortingAZ02Icon}
                              size={16}
                              strokeWidth={2}
                            />
                          ) : (
                            <HugeiconsIcon
                              icon={SortingZA01Icon}
                              size={16}
                              strokeWidth={2}
                            />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle sort order</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
              <CreateDepartmentDialog />
            </div>
          </div>
          <div className="w-full">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <DepartmentLoadingCard key={index} />
              ))
            ) : departments.length === 0 ? (
              <DepartmentEmptyState />
            ) : (
              departments.map((department: DepartmentsProps) => (
                <DepartmentCard
                  key={department._id}
                  department={department}
                  location="departments"
                />
              ))
            )}
            <div className="py-2 px-4 border-b">
              {!isLoading ? (
                <WorkspaceListPagination
                  pagination={pagination}
                  onPageChange={listState.setPage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentsPage;

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
