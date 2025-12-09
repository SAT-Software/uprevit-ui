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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { AuditLog } from "@/types/product";
import { useMemo, useState } from "react";
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

export type Item = {
  _id: string;
  productId?: string;
  auditLogs?: Array<AuditLog>;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  master_version: string;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: string;
  product_information?: { tab_completed?: boolean };
  compliance_information?: { tab_completed?: boolean };
  label_components?: { tab_completed?: boolean };
  symbols_graphics?: { tab_completed?: boolean };
  product_data?: { tab_completed?: boolean };
  operational_parameters?: { tab_completed?: boolean };
  label_tags?: { tab_completed?: boolean };
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
      const project_name = row.original?.project[0]?.project_name;

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
      const departmentName = row.original?.department[0]?.department_name;

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
    accessorKey: "master_version",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Version"
        icon={PiGitBranchDuotone}
      />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        v{row.getValue("master_version")}
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

      let tabsCompleted: string[] = [];

      if (row.original) {
        if (row.original.product_information?.tab_completed)
          tabsCompleted.push("product-information");
        if (row.original.compliance_information?.tab_completed)
          tabsCompleted.push("compliance-information");
        if (row.original.label_components?.tab_completed)
          tabsCompleted.push("label-components");
        if (row.original.symbols_graphics?.tab_completed)
          tabsCompleted.push("symbols-graphics");
        if (row.original.product_data?.tab_completed)
          tabsCompleted.push("product-data");
        if (row.original.operational_parameters?.tab_completed)
          tabsCompleted.push("operational-parameters");
        if (row.original.label_tags?.tab_completed)
          tabsCompleted.push("label-tags");
      }

      const PROGRESS_STATES = [
        {
          min: 100,
          label: "Ready to submit",
          dot: "bg-emerald-500",
          text: "text-emerald-600 dark:text-emerald-300",
          bar: "from-emerald-400 via-emerald-500 to-emerald-600",
        },
        {
          min: 70,
          label: "On track",
          dot: "bg-sky-500",
          text: "text-sky-600 dark:text-sky-300",
          bar: "from-sky-400 via-sky-500 to-sky-600",
        },
        {
          min: 40,
          label: "In progress",
          dot: "bg-amber-500",
          text: "text-amber-600 dark:text-amber-300",
          bar: "from-amber-400 via-amber-500 to-amber-600",
        },
        {
          min: 0,
          label: "Getting started",
          dot: "bg-slate-400",
          text: "text-slate-600 dark:text-slate-300",
          bar: "from-slate-400 via-slate-500 to-slate-600",
        },
      ] as const;

      const getProgressState = (value: number) => {
        for (const state of PROGRESS_STATES) {
          if (value >= state.min) return state;
        }
        return PROGRESS_STATES[PROGRESS_STATES.length - 1];
      };

      const TOTAL_TABS = 7;

      const clampedPercentage = Math.max(
        0,
        Math.min(100, Math.round(progress || 0))
      );
      const progressState = getProgressState(clampedPercentage);

      return (
        <div className="flex items-center gap-1">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className="flex items-center gap-4 justify-between text-[0.7rem] font-medium leading-none">
              <span
                className={cn(
                  "flex items-center gap-1 text-muted-foreground",
                  progressState.text
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", progressState.dot)}
                />
                {progressState.label}
              </span>
              <span className="text-[0.65rem] text-muted-foreground">
                {tabsCompleted.length}/{TOTAL_TABS} tabs
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full bg-linear-to-r transition-[width] duration-300 ease-out z-45",
                  progressState.bar
                )}
                style={{ width: `${clampedPercentage}%` }}
              />
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-border transition-[width] duration-300 ease-out z-30"
                style={{ width: `${100}%` }}
              ></span>
            </div>
          </div>
          <span className="text-xs font-semibold text-foreground w-9 text-right">
            {progress}%
          </span>
        </div>
      );
    },
  },
];

export default function DashboardProductsTable() {
  const { data, isLoading, error } = useGetAllProducts();
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const recentProductsData = useMemo(
    () =>
      Array.isArray(data?.result?.products)
        ? data.result.products.slice(0, 5)
        : [],
    [data]
  );

  const table = useReactTable({
    data: recentProductsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/50">
              {[...Array(7)].map((_, i) => (
                <TableHead key={i}>
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(7)].map((_, i) => (
                  <TableCell key={i}>
                    <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
        <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
          <PiPackageDuotone className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-destructive">
            Failed to load products
          </p>
          <p className="text-xs text-muted-foreground">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header, index) => {
                const isLastColumn = index === headerGroup.headers.length - 1;
                return (
                  <TableHead
                    key={header.id}
                    className={cn(!isLastColumn && "border-r border-border")}
                  >
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
                  row.original._id &&
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
                      Get started by creating a new product
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
