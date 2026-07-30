"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { WorkspaceListPaginationSkeleton } from "@/components/table/WorkspaceListPaginationSkeleton";
import { WorkspaceListToolbarSkeleton } from "@/components/table/WorkspaceListToolbarSkeleton";
import DepartmentCard from "@/features/workspace/common/DepartmentCard";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import CreateDepartmentDialog from "@/features/workspace/departments/CreateDepartmentDialog";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
  WORKSPACE_LIST_LIMIT,
} from "@/lib/workspace-list-query";
import {
  NewOfficeIcon,
  SortingAZ01Icon,
  SortingAZ02Icon,
  SortingZA01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
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

const DEPARTMENT_LIST_CONTENT_MIN_HEIGHT = "min-h-[55rem] md:min-h-[42rem]";

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
  } = useGetAllDepartments(listState.query);

  const departments = departmentsData?.result?.departments ?? [];
  const pagination = departmentsData?.result?.pagination;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">All Departments</p>
          <InfoTooltip content="All the departments in your workspace. Departments group your work inside your workspace, for example by function, site, or product line." />
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <WorkspaceListToolbarSkeleton />
          ) : !isError ? (
            <div className="flex w-full flex-wrap items-center gap-2">
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
                  <SelectTrigger className="group w-auto truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={SortingAZ01Icon}
                            size={16}
                            strokeWidth={2}
                            className="text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-foreground"
                          />

                          <SelectValue />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Sort by different fields</TooltipContent>
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
                      size="icon-xs"
                      className="h-7 px-2 text-xs text-muted-foreground/60 hover:text-muted-foreground"
                      onClick={() =>
                        listState.setSort(
                          listState.query.sort,
                          listState.query.order === "asc" ? "desc" : "asc",
                        )
                      }
                    >
                      {listState.query.order === "asc" ? (
                        <Icon
                          icon={SortingAZ02Icon}
                          size={16}
                          strokeWidth={2}
                        />
                      ) : (
                        <Icon
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
          ) : null}
          <CreateDepartmentDialog />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          [...Array(WORKSPACE_LIST_LIMIT)].map((_, index) => (
            <DepartmentLoadingCard key={index} />
          ))
        ) : isError ? (
          <DashboardErrorState
            variant="panel"
            icon={NewOfficeIcon}
            title="Failed to load departments"
            className={DEPARTMENT_LIST_CONTENT_MIN_HEIGHT}
          />
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
        <div className="flex h-10 items-center border-b">
          {isLoading ? (
            <WorkspaceListPaginationSkeleton />
          ) : !isError ? (
            <WorkspaceListPagination
              pagination={pagination}
              onPageChange={listState.setPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DepartmentsPage;

function DepartmentLoadingCard() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center w-full p-3 gap-4 border-b border-border rounded-none">
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

function DepartmentEmptyState() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-border rounded-xl bg-muted/30">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
        <Icon
          icon={NewOfficeIcon}
          size={32}
          strokeWidth={2}
          className="text-muted-foreground"
        />
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
