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
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { AuditLog } from "@/types/product";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ColumnsThreeCogIcon,
  Refresh04Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@uprevit/ui/components/ui/field";
import { cn } from "@uprevit/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiPackageDuotone,
} from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { ProductProcessDropdown } from "@/components/common/ProductProgressDropdown";

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
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="ml-1 h-3 w-3"
                />
              ) : column.getIsSorted() === "asc" ? (
                <HugeiconsIcon icon={ArrowUp01Icon} className="ml-1 h-3 w-3" />
              ) : (
                <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-1 h-3 w-3" />
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
        <div onClick={(e) => e.stopPropagation()}>
          <ProductProcessDropdown
            percentage={clampedPercentage}
            colorClass={progressState.bar}
            size={18}
            strokeWidth={2}
            progress={progress}
            product_name={row.original?.product_name}
            complete_button={false}
            tabsCompleted={tabsCompleted.length}
            totalTabs={TOTAL_TABS}
          />
        </div>
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
      <div className="w-full border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20"></div>
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
    <div className="w-full border border-border rounded-2xl overflow-hidden">
      <div className="w-full flex items-center justify-between border-b h-10 pl-4 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Recent Products</p>
          <InfoTooltip content="Recently created or updated products" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    className="text-muted-foreground/60 hover:text-muted-foreground transition-colors delay-100 duration-200 ease-in-out"
                  >
                    <HugeiconsIcon icon={ColumnsThreeCogIcon} size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show or hide table columns</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{ boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)" }}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>Fixed columns</DropdownMenuLabel>

                {table
                  .getAllColumns()
                  .filter((column) => !column.getCanHide())
                  .map((column) => {
                    return (
                      <FieldGroup
                        key={column.id}
                        className="mx-auto w-56 flex-flex-col focus:bg-accent focus:text-accent-foreground text-foreground relative flex cursor-default items-center gap-1 rounded-md py-1.5 pr-2 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <Field orientation="horizontal">
                          <Checkbox checked={column.getIsVisible()} disabled />
                          <FieldLabel
                            htmlFor="terms-checkbox-basic"
                            className="font-normal capitalize"
                          >
                            {column.id}
                          </FieldLabel>
                        </Field>
                      </FieldGroup>
                    );
                  })}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel>Active columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <FieldGroup
                        key={column.id}
                        className="mx-auto w-56 flex-flex-col focus:bg-accent focus:text-accent-foreground text-foreground relative flex cursor-default items-center gap-1 rounded-md py-1.5 pr-2 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                            onSelect={(event) => event.preventDefault()}
                          />
                          <FieldLabel
                            htmlFor="terms-checkbox-basic"
                            className="font-normal capitalize"
                          >
                            {column.id}
                          </FieldLabel>
                        </Field>
                      </FieldGroup>
                    );
                  })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="group">
                <DropdownMenuItem onClick={() => table.resetColumnVisibility()}>
                  <HugeiconsIcon
                    icon={Refresh04Icon}
                    size={14}
                    strokeWidth={2}
                    className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                  />
                  Reset Default
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
