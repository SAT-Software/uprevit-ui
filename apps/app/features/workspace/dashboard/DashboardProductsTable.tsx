"use client";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ProductProgressHoverCard } from "@/components/common/ProductProgressHoverCard";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { AuditLog } from "@/types/product";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  Blockchain03Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
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
import { cn } from "@uprevit/ui/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ShowOrHideTableColumnsDropdown from "../common/ShowOrHideTableColumnsDropdown";
import {
  DashboardErrorState,
  DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT,
} from "./DashboardErrorState";

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

const dashboardTableColumns = [
  { title: "PPN", width: 100 },
  { title: "Product Name", width: 270 },
  { title: "Project", width: 160 },
  { title: "Department", width: 160 },
  { title: "Status", width: 80 },
  { title: "Version", width: 80 },
  { title: "Progress", width: 90 },
] as const;

const columnHeaderMap = [
  {
    title: "PPN",
    info: "Product Plan Number - Unique identifier for the product plan",
  },
  {
    title: "Product Name",
    info: "Name of the product",
  },
  {
    title: "Project",
    info: "Name of the project this product belongs to",
  },
  {
    title: "Department",
    info: "Name of the department this product belongs to",
  },
  {
    title: "Status",
    info: "Current status of the product. Draft, Submitted or Archived",
  },
  {
    title: "Version",
    info: "Latest version number of the product",
  },
  {
    title: "Progress",
    info: "Completion progress in percentage of the product. How many tabs are completed out of 7",
  },
];

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Item, unknown>;
  title: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-10 group data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center text-muted-foreground/60 group-hover:text-muted-foreground transition-colors delay-100 duration-200 ease-in-out">
              <span>{title}</span>
            </div>
            <div className="opacity-50 group-hover:opacity-100 transition-all delay-100 duration-200 ease-in-out">
              {column.getIsSorted() === "desc" ? (
                <Icon icon={ArrowDown01Icon} className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <Icon icon={ArrowUp01Icon} className="ml-1 h-3 w-3" />
              ) : (
                <Icon icon={UnfoldMoreIcon} className="ml-1 h-3 w-3" />
              )}
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {columnHeaderMap.find((col) => col.title === title)?.info}
      </TooltipContent>
    </Tooltip>
  );
};

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "product_plan_number",
    enableHiding: false,
    size: 100,
    header: ({ column }) => <SortableHeader column={column} title="PPN" />,
    cell: ({ row }) => {
      const ppn = row.getValue("product_plan_number");
      return (
        <div className="text-sm font-medium truncate">{ppn as string}</div>
      );
    },
  },
  {
    accessorKey: "product_name",
    enableHiding: false,
    size: 270,
    minSize: 150,
    header: ({ column }) => (
      <SortableHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium truncate">
          {row.getValue("product_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "project_name",
    size: 160,
    header: ({ column }) => <SortableHeader column={column} title="Project" />,
    cell: ({ row }) => {
      const project_name = row.original?.project[0]?.project_name;

      return <div className="text-sm font-medium truncate">{project_name}</div>;
    },
  },
  {
    accessorKey: "department_name",
    size: 160,
    header: ({ column }) => (
      <SortableHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const departmentName = row.original?.department[0]?.department_name;

      return (
        <div className="text-sm font-medium truncate">{departmentName}</div>
      );
    },
  },
  {
    accessorKey: "status",
    size: 80,
    minSize: 80,
    maxSize: 90,
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge
        variant={
          row.original?.status === "submitted"
            ? "green"
            : row.original?.status === "draft"
              ? "blue"
              : "gray"
        }
        className="font-normal capitalize"
      >
        <div
          className={cn("w-2 h-2 rounded-full", {
            "bg-green-500 dark:bg-green-400":
              row.original?.status === "submitted",
            "bg-blue-500 dark:bg-blue-400": row.original?.status === "draft",
            "bg-gray-500 dark:bg-gray-400": row.original?.status === "archived",
          })}
        />
        {row.original?.status}
      </Badge>
    ),
  },
  {
    accessorKey: "version",
    size: 80,
    minSize: 80,
    maxSize: 90,
    header: ({ column }) => <SortableHeader column={column} title="Version" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        v{row.getValue("version")}
      </Badge>
    ),
  },
  {
    accessorKey: "complete_count",
    size: 90,
    minSize: 90,
    maxSize: 90,
    header: ({ column }) => <SortableHeader column={column} title="Progress" />,
    cell: ({ row }) => {
      const progress = (row.getValue("complete_count") as number) || 0;

      const tabsCompleted: string[] = [];

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
          tabsCompleted.push("product-specifications");
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

      const SUBMITTED_STATE = {
        min: 100,
        label: "Submitted",
        dot: "bg-violet-500",
        text: "text-violet-600 dark:text-violet-300",
        bar: "from-violet-400 via-violet-500 to-violet-600",
      } as const;

      const getProgressState = (value: number) => {
        for (const state of PROGRESS_STATES) {
          if (value >= state.min) return state;
        }
        return PROGRESS_STATES[PROGRESS_STATES.length - 1];
      };

      const TOTAL_TABS = 7;

      const clampedPercentage = Math.max(
        0,
        Math.min(100, Math.round(progress || 0)),
      );

      const progressState =
        row.original.status === "submitted"
          ? SUBMITTED_STATE
          : getProgressState(clampedPercentage);

      return (
        <ProductProgressHoverCard
          percentage={clampedPercentage}
          colorClass={progressState.bar}
          size={18}
          strokeWidth={2}
          progress={progress}
          product_name={row.original?.product_name}
          tabsCompleted={tabsCompleted.length}
          totalTabs={TOTAL_TABS}
        />
      );
    },
  },
];

export default function DashboardProductsTable() {
  const { data, isLoading, error } = useGetAllProducts({
    limit: 5,
    sort: "actionAt",
    order: "desc",
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const recentProductsData = useMemo<Item[]>(
    () =>
      Array.isArray(data?.result?.products)
        ? (data.result.products as Item[])
        : [],
    [data],
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
      <div className="w-full border border-border rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between border-b h-10 pl-3 pr-2 bg-muted/60">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Products</p>
            <InfoTooltip content="A product in Uprevit is a labeling documentation record: metadata, seven structured tabs, versions, and redlines" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {dashboardTableColumns.map(({ title, width }, index) => {
                const isLastColumn = index === dashboardTableColumns.length - 1;
                return (
                  <TableHead
                    key={title}
                    style={{ width: `${width}px` }}
                    className={cn(!isLastColumn && "border-r border-border")}
                  >
                    <div className="h-10 flex items-center">
                      <span className="text-sm text-muted-foreground/60">
                        {title}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableBodySkeleton columnCount={7} rowCount={5} />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border border-border rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between border-b h-10 pl-3 pr-2 bg-muted/60">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Products</p>
            <InfoTooltip content="A product in Uprevit is a labeling documentation record: metadata, seven structured tabs, versions, and redlines" />
          </div>
          <Link href="/products" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <Icon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>
        <DashboardErrorState
          variant="panel"
          embedded
          icon={Blockchain03Icon}
          title="Failed to load products"
          className={DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT}
        />
      </div>
    );
  }

  return (
    <div className="w-full border border-border rounded-2xl overflow-hidden">
      <div className="w-full flex items-center justify-between border-b h-10 pl-3 pr-2 bg-muted/60">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Products</p>
          <InfoTooltip content="A product in Uprevit is a labeling documentation record: metadata, seven structured tabs, versions, and redlines" />
        </div>
        <div className="flex items-center gap-2">
          <ShowOrHideTableColumnsDropdown table={table} />
          <Link href="/products" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <Icon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const isLastColumn = index === headerGroup.headers.length - 1;
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className={cn(!isLastColumn && "border-r border-border")}
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
                onClick={() =>
                  row.original._id &&
                  router.push(
                    `/products/${row.original._id}/product-information`,
                  )
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: `${cell.column.getSize()}px` }}
                  >
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
                    <Icon
                      icon={Blockchain03Icon}
                      size={32}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
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
