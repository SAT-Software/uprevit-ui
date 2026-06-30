"use client";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";
import { Project } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  PiBuildingsDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiKanbanDuotone,
} from "react-icons/pi";
import ShowOrHideTableColumnsDropdown from "../common/ShowOrHideTableColumnsDropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";

const DEPARTMENT_PROJECT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "project_name", label: "Project Name", type: "text" },
  { name: "project_description", label: "Description", type: "text" },
  { name: "project_manager", label: "Project Manager", type: "text" },
  { name: "lastChangedBy", label: "Last Changed By", type: "text" },
  { name: "lastChangedOn", label: "Last Changed On", type: "date" },
];

const DEPARTMENT_PROJECT_SORT_FIELDS = [
  "project_number",
  "project_name",
  "project_description",
  "project_manager",
  "users",
  "createdOn",
  "modifiedOn",
  "actionAt",
  "_id",
];

const columnHeaderMap = [
  {
    title: "Project No.",
    info: "Project Number - Unique identifier for the project",
  },
  {
    title: "Project Name",
    info: "Name of the project",
  },
  {
    title: "Description",
    info: "Brief description of the project",
  },
  {
    title: "Users",
    info: "Number of users that are part of of this project",
  },
  {
    title: "Created",
    info: "Date of the project creation",
  },
  {
    title: "Modified",
    info: "Date of project updated last time",
  },
];

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Project, unknown>;
  title: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="whitespace-nowrap">{title}</span>
            </div>
            {column.getIsSorted() === "desc" ? (
              <HugeiconsIcon icon={ArrowDown01Icon} className="ml-1 h-3 w-3" />
            ) : column.getIsSorted() === "asc" ? (
              <HugeiconsIcon icon={ArrowUp01Icon} className="ml-1 h-3 w-3" />
            ) : (
              <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-1 h-3 w-3" />
            )}
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {columnHeaderMap.find((col) => col.title === title)?.info}
      </TooltipContent>
    </Tooltip>
  );
};

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "project_number",
    size: 140,
    header: ({ column }) => (
      <SortableHeader column={column} title="Project No." />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.getValue("project_number")}
      </div>
    ),
    minSize: 140,
  },
  {
    accessorKey: "project_name",
    size: 200,
    enableHiding: false,
    header: ({ column }) => (
      <SortableHeader column={column} title="Project Name" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium">{row.getValue("project_name")}</p>
      );
    },
  },
  {
    accessorKey: "project_description",
    size: 280,
    header: ({ column }) => (
      <SortableHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium truncate">
          {row.getValue("project_description")}
        </p>
      );
    },
  },
  {
    accessorKey: "users",
    size: 88,
    header: ({ column }) => <SortableHeader column={column} title="Users" />,
    cell: ({ row }) => {
      const users = row.original.users?.length || 0;
      return <p className="text-sm font-medium">{users}</p>;
    },
  },
  {
    accessorKey: "createdOn",
    size: 175,
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdBy = row.original.auditLogs?.filter(
        (log) => log.action === "create",
      )[0]?.actionBy;
      const createdAt = row.original.auditLogs?.filter(
        (log) => log.action === "create",
      )[0]?.actionAt;
      if (createdBy && createdAt)
        return (
          <div className="flex flex-col">
            <p className="text-sm font-medium">{createdBy}</p>
            <p className="text-xs text-muted-foreground">
              {Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(new Date(createdAt))}
            </p>
          </div>
        );
      return <span className="text-sm text-muted-foreground">N/A</span>;
    },
  },
  {
    accessorKey: "modifiedOn",
    size: 175,
    header: ({ column }) => <SortableHeader column={column} title="Modified" />,
    cell: ({ row }) => {
      const modifiedBy = row.original.auditLogs?.filter(
        (log) => log.action === "update",
      )[0]?.actionBy;
      const modifiedAt = row.original.auditLogs?.filter(
        (log) => log.action === "update",
      )[0]?.actionAt;
      if (modifiedBy && modifiedAt)
        return (
          <div className="flex flex-col">
            <p className="text-sm font-medium">{modifiedBy}</p>
            <p className="text-xs text-muted-foreground">
              {Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(new Date(modifiedAt))}
            </p>
          </div>
        );
      return <span className="text-sm text-muted-foreground">N/A</span>;
    },
  },
];

const DEPARTMENT_PROJECT_TABLE_COLUMN_COUNT = 6;

export default function DepartmentPageProjectsTable({
  departmentId,
}: {
  departmentId: string;
}) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const listState = useWorkspaceListQuery({
    defaultSort: "actionAt",
    defaultOrder: "desc",
    allowedSortFields: DEPARTMENT_PROJECT_SORT_FIELDS,
    filterColumns: DEPARTMENT_PROJECT_FILTER_COLUMNS,
  });
  const {
    data: projectsData,
    isFetching: isProjectsFetching,
    isPending: isProjectsPending,
  } = useGetAllProjects({
    ...listState.query,
    departmentId,
  });
  const data = projectsData?.result?.projects || [];
  const projectsPagination = projectsData?.result?.pagination;
  const isProjectsListBusy = isProjectsPending || isProjectsFetching;
  const hasProjectsToList =
    isProjectsListBusy ||
    (projectsPagination?.totalCount ?? 0) > 0 ||
    listState.query.filters.length > 0;
  const sorting = useMemo<SortingState>(
    () => [
      { id: listState.query.sort, desc: listState.query.order === "desc" },
    ],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (!projectsPagination) return;
    if (projectsPagination.totalPages === 0) {
      if (listState.query.page !== 1) listState.setPage(1);
      return;
    }
    if (listState.query.page > projectsPagination.totalPages) {
      listState.setPage(1);
    }
  }, [listState.query.page, listState, projectsPagination]);

  const table = useReactTable<Project>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const next = nextSorting[0];
      if (!next) return;
      listState.setSort(next.id, next.desc ? "desc" : "asc");
    },
    enableSortingRemoval: false,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="px-2">
      <div className="flex flex-col border rounded-2xl">
        <div className="h-10 flex items-center justify-between pl-3 pr-2">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Projects</p>
            <InfoTooltip
              content="All the projects that belongs to this department."
              className="mt-0.5"
            />
          </div>
          <div className="flex items-center gap-2">
            <ShowOrHideTableColumnsDropdown table={table} />
            <WorkspaceListControls
              filters={listState.query.filters}
              filterColumns={DEPARTMENT_PROJECT_FILTER_COLUMNS}
              onApplyFilters={listState.setFilters}
              onClearFilters={listState.clearFilters}
            />
          </div>
        </div>

        <div className="w-full">
          {hasProjectsToList ? (
            <div className="flex flex-col items-end">
              <div className="w-full">
                <div className="w-full border-y border-border overflow-hidden">
                  <Table className="table-fixed w-full">
                    <colgroup>
                      {table.getHeaderGroups()[0]?.headers.map((header) => (
                        <col
                          key={header.id}
                          style={{ width: `${header.getSize()}px` }}
                        />
                      ))}
                    </colgroup>
                    <TableHeader className="bg-muted">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className="hover:bg-transparent"
                        >
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                                className="h-11 border-r border-border last:border-r-0"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {isProjectsFetching ? (
                        <TableBodySkeleton
                          columnCount={DEPARTMENT_PROJECT_TABLE_COLUMN_COUNT}
                        />
                      ) : !isProjectsFetching &&
                        table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              router.push(`/projects/${row.original._id}`)
                            }
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            <div className="flex flex-col gap-4 items-center justify-center w-full py-8">
                              <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
                                <PiKanbanDuotone className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                  No projects found
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Get started by creating a new project
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {projectsPagination ? (
                <WorkspaceListPagination
                  pagination={projectsPagination}
                  onPageChange={listState.setPage}
                />
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <WorkspaceListControls
                filters={listState.query.filters}
                filterColumns={DEPARTMENT_PROJECT_FILTER_COLUMNS}
                onApplyFilters={listState.setFilters}
                onClearFilters={listState.clearFilters}
              />
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl bg-muted/10">
                <div className="flex items-center justify-center p-2 bg-muted/50 rounded-full mb-3">
                  <PiBuildingsDuotone className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No projects found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This department doesn&apos;t have any projects yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
