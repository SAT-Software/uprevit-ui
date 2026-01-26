"use client";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableControls from "@/components/table/TableControls";
import { advancedFilterFn } from "@/lib/table-filters";
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
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{title}</span>
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
    size: 180,
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
    minSize: 180,
  },
  {
    accessorKey: "project_name",
    size: 240,
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
    size: 340,
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

export default function DepartmentPageProjectsTable({
  data,
}: {
  data: Project[];
}) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable<Project>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: { filterFn: advancedFilterFn<Project>() },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full space-y-2 mt-2">
      <TableControls
        table={table}
        searchColumnId="project_name"
        searchPlaceholder="Filter projects..."
        filterColumns={[
          { name: "project_number", label: "Project Number", type: "text" },
          { name: "project_name", label: "Project Name", type: "text" },
          { name: "project_description", label: "Description", type: "text" },
        ]}
      />
      <div className="w-full border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-r border-border"
                      style={{ width: header.getSize() }}
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
            {table.getRowModel().rows?.length ? (
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
