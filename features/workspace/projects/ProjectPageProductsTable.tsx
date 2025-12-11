"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { AuditLog } from "@/types/product";
import { useState } from "react";
import {
  PiBuildingsDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiChartPieSliceDuotone,
  PiGitBranchDuotone,
  PiHashDuotone,
  PiInfoDuotone,
  PiKanbanDuotone,
  PiPackageDuotone,
} from "react-icons/pi";
import { Progress } from "@/components/ui/progress";

export type Item = {
  _id: string;
  productId?: string;
  auditLogs?: Array<AuditLog>;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  version: number;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: string;
  department: Array<{
    _id: string;
    department_name: string;
  }>;
  project: Array<{
    _id: string;
    project_name: string;
  }>;
  complete_count: number;
};

// Helper component for sortable headers
const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: any;
  title: string;
  icon: any;
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

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "product_plan_number",
    header: ({ column }) => (
      <SortableHeader column={column} title="PPN" icon={PiHashDuotone} />
    ),
    cell: ({ row }) => {
      const ppn = row.getValue("product_plan_number");
      return <div className="text-sm font-medium">{ppn as string}</div>;
    },
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Product Name"
        icon={PiPackageDuotone}
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium">{row.getValue("product_name")}</p>
      );
    },
  },
  {
    accessorKey: "project_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Project Name"
        icon={PiKanbanDuotone}
      />
    ),
    cell: ({ row }) => {
      // Assuming project data is available through the data prop
      const project_name = row.original?.project?.[0]?.project_name || "N/A";
      return <div className="text-sm font-medium">{project_name}</div>;
    },
  },
  {
    accessorKey: "department_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Department Name"
        icon={PiBuildingsDuotone}
      />
    ),
    cell: ({ row }) => {
      // Assuming department data is available through the data prop
      const departmentName =
        row.original?.department?.[0]?.department_name || "N/A";
      return <div className="text-sm font-medium">{departmentName}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column} title="Status" icon={PiInfoDuotone} />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        <div
          className={cn("w-2 h-2 rounded-full mr-1", {
            "bg-green-500": row.original?.status === "submitted",
            "bg-blue-500": row.original?.status === "draft",
            "bg-gray-500": row.original?.status === "archived",
          })}
        />
        {row.original?.status}
      </Badge>
    ),
  },
  {
    accessorKey: "version",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Version"
        icon={PiGitBranchDuotone}
      />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        v{row.getValue("version")}
      </Badge>
    ),
  },
  {
    accessorKey: "complete_count",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Progress"
        icon={PiChartPieSliceDuotone}
      />
    ),
    cell: ({ row }) => {
      const progress = (row.getValue("complete_count") as number) || 0;
      return (
        <div className="flex items-center gap-3 min-w-[120px]">
          <Progress value={progress} className="h-2 w-full" />
          <span className="text-sm font-medium text-muted-foreground w-9 text-right">
            {progress}%
          </span>
        </div>
      );
    },
  },
];

export default function ProjectPageProductsTable({ data }: { data: Item[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="border-r border-border">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                onClick={() =>
                  router.push(
                    `/products/${row.original._id}/product-information`
                  )
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col gap-4 items-center justify-center w-full py-8">
                  <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
                    <PiPackageDuotone className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      No products found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This project doesn't have any products yet.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
