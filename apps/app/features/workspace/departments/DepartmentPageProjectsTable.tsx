"use client";

import {
  Column,
  ColumnDef,
  OnChangeFn,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PiCalendarDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiHashDuotone,
  PiInfoDuotone,
  PiKanbanDuotone,
  PiUsersDuotone,
} from "react-icons/pi";
import type { IconType } from "react-icons";

const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: Column<Project, unknown>;
  title: string;
  icon: IconType;
}) => {
  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-8 data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">{title}</span>
        </div>
        {column.getIsSorted() === "desc" ? (
          <PiCaretDownDuotone className="ml-1 h-3 w-3" />
        ) : column.getIsSorted() === "asc" ? (
          <PiCaretUpDuotone className="ml-1 h-3 w-3" />
        ) : (
          <PiCaretUpDownDuotone className="ml-1 h-3 w-3 opacity-50" />
        )}
      </div>
    </button>
  );
};

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "project_number",
    size: 140,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Project No."
        icon={PiHashDuotone}
      />
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
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Project Name"
        icon={PiKanbanDuotone}
      />
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
      <SortableHeader
        column={column}
        title="Description"
        icon={PiInfoDuotone}
      />
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
    header: ({ column }) => (
      <SortableHeader column={column} title="Users" icon={PiUsersDuotone} />
    ),
    cell: ({ row }) => {
      const users = row.original.users?.length || 0;
      return <p className="text-sm font-medium">{users}</p>;
    },
  },
  {
    accessorKey: "createdOn",
    size: 175,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Created"
        icon={PiCalendarDuotone}
      />
    ),
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
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Modified"
        icon={PiCalendarDuotone}
      />
    ),
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
  data,
  sorting,
  onSortingChange,
  isLoading = false,
}: {
  data: Project[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable<Project>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange,
    enableSortingRemoval: false,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="w-full space-y-2 mt-2">
      <div className="w-full border border-border rounded-lg overflow-hidden">
        <Table className="table-fixed w-full">
          <colgroup>
            {table.getHeaderGroups()[0]?.headers.map((header) => (
              <col key={header.id} style={{ width: `${header.getSize()}px` }} />
            ))}
          </colgroup>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
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
            {isLoading ? (
              <TableBodySkeleton
                columnCount={DEPARTMENT_PROJECT_TABLE_COLUMN_COUNT}
              />
            ) : !isLoading && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/projects/${row.original._id}`)}
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
  );
}
