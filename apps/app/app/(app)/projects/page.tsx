"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { WorkspaceListPaginationSkeleton } from "@/components/table/WorkspaceListPaginationSkeleton";
import { WorkspaceListToolbarSkeleton } from "@/components/table/WorkspaceListToolbarSkeleton";
import ProjectCard, {
  type ProjectProps,
} from "@/features/workspace/common/ProjectCard";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import ProjectCreateDialog from "@/features/workspace/projects/ProjectCreateDialog";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
  WORKSPACE_LIST_LIMIT,
} from "@/lib/workspace-list-query";
import {
  KanbanIcon,
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
import { PiKanbanDuotone } from "react-icons/pi";

const PROJECT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "project_name", label: "Project Name", type: "text" },
  { name: "project_description", label: "Description", type: "text" },
  { name: "project_manager", label: "Project Manager", type: "text" },
  { name: "lastChangedBy", label: "Last Changed By", type: "text" },
  { name: "lastChangedOn", label: "Last Changed On", type: "date" },
];

const PROJECT_SORT_OPTIONS = [
  { value: "project_name", label: "Project Name" },
  { value: "project_description", label: "Description" },
  { value: "project_manager", label: "Project Manager" },
  { value: "actionAt", label: "Last Changed" },
];

const PROJECT_LIST_CONTENT_MIN_HEIGHT = "min-h-[55rem] md:min-h-[42rem]";

function ProjectsPage() {
  const listState = useWorkspaceListQuery({
    defaultSort: "project_name",
    allowedSortFields: PROJECT_SORT_OPTIONS.map((option) => option.value),
    filterColumns: PROJECT_FILTER_COLUMNS,
  });
  const {
    data: projectsData,
    isLoading,
    isError,
  } = useGetAllProjects(listState.query);

  const projects = projectsData?.result?.projects ?? [];
  const pagination = projectsData?.result?.pagination;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">All Projects</p>
          <InfoTooltip content="All the projects in your workspace. Projects sit between departments and products — each project belongs to one department and holds multiple products." />
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <WorkspaceListToolbarSkeleton />
          ) : !isError ? (
            <div className="flex w-full flex-wrap items-center gap-2">
              <WorkspaceListControls
                filters={listState.query.filters}
                filterColumns={PROJECT_FILTER_COLUMNS}
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
                    {PROJECT_SORT_OPTIONS.map((option) => (
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
          <ProjectCreateDialog />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          [...Array(WORKSPACE_LIST_LIMIT)].map((_, index) => (
            <ProjectLoadingCard key={index} />
          ))
        ) : isError ? (
          <DashboardErrorState
            variant="panel"
            icon={KanbanIcon}
            title="Failed to load projects"
            className={PROJECT_LIST_CONTENT_MIN_HEIGHT}
          />
        ) : projects.length === 0 ? (
          <ProjectEmptyState />
        ) : (
          projects.map((project: ProjectProps) => (
            <ProjectCard
              key={project._id}
              project={project}
              location="projects"
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

export default ProjectsPage;

function ProjectLoadingCard() {
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

function ProjectEmptyState() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-border rounded-xl bg-muted/30">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
        <PiKanbanDuotone className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">No projects found</p>
        <p className="text-xs text-muted-foreground">
          Get started by creating a new project
        </p>
      </div>
    </div>
  );
}
