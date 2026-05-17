"use client";

import { Input } from "@uprevit/ui/components/ui/input";
import {
  type Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import type { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PiBuildingsDuotone,
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiChartPieSliceDuotone,
  PiColumnsDuotone,
  PiDotsThreeCircleVerticalDuotone,
  PiFilePdfDuotone,
  PiGitBranchDuotone,
  PiGitMergeDuotone,
  PiHashDuotone,
  PiInfoDuotone,
  PiKanbanDuotone,
  PiPackageDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@uprevit/ui/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { cn } from "@uprevit/ui/lib/utils";
import { AuditLog } from "@/types/product";
import {
  PiArchiveDuotone,
  PiBookmarkDuotone,
  PiPencilCircleDuotone,
  PiShareDuotone,
} from "react-icons/pi";
import DialogArchiveProduct from "./DialogArchiveProduct";
import DialogBookmarkProduct from "./DialogBookmarkProduct";
import DialogCreateVersion from "./DialogCreateVersion";
import DialogExportProductPDF from "./DialogExportProductPDF";
import DialogShareProduct from "./DialogShareProduct";
import FilterBuilder from "./tableFilter";
import UpdateProductDialog from "./UpdateProductDialog";

export type Item = {
  _id: string;
  productId?: string;
  description: string;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  version: number;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: string;
  is_latest?: boolean;
  parent_id?: string | null;
  product_information?: { tab_completed?: boolean };
  compliance_information?: { tab_completed?: boolean };
  label_components?: { tab_completed?: boolean };
  symbols_graphics?: { tab_completed?: boolean };
  product_data?: { tab_completed?: boolean };
  operational_parameters?: { tab_completed?: boolean };
  label_tags?: { tab_completed?: boolean };
  auditLogs?: Array<AuditLog>;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
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

interface AdvancedFilter {
  operator: string;
  value: string | number | boolean;
}

const getAuditActionBy = (
  auditLogs: Array<AuditLog> | undefined,
  action: string,
) =>
  auditLogs
    ?.filter((log) => log.action === action)
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime(),
    )[0]?.actionBy ?? "";

// Advanced operator-based filter function
const advancedFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);

  if (filterValue == null) return true;

  // Support simple string filters (e.g., from a basic text input)
  if (typeof filterValue === "string") {
    const needle = filterValue.toLowerCase();
    if (!needle) return true;
    return String(rowValue ?? "")
      .toLowerCase()
      .includes(needle);
  }

  const { operator, value } = filterValue as AdvancedFilter;
  switch (operator) {
    case "eq":
      return rowValue == value;
    case "neq":
      return rowValue != value;
    case "contains":
      return String(rowValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "not_contains":
      return !String(rowValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "starts_with":
      return String(rowValue)
        .toLowerCase()
        .startsWith(String(value).toLowerCase());
    case "ends_with":
      return String(rowValue)
        .toLowerCase()
        .endsWith(String(value).toLowerCase());
    case "gt":
      return Number(rowValue) > Number(value);
    case "gte":
      return Number(rowValue) >= Number(value);
    case "lt":
      return Number(rowValue) < Number(value);
    case "lte":
      return Number(rowValue) <= Number(value);
    case "is_null":
      return rowValue == null || rowValue === "";
    case "is_not_null":
      return rowValue != null && rowValue !== "";
    default:
      return true;
  }
};

// Helper component for sortable headers
const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: Column<Item, unknown>;
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
    size: 110,
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
    size: 190,
  },
  {
    id: "project_name",
    accessorFn: (row) => row?.project?.[0]?.project_name ?? "",
    header: ({ column }) => (
      <SortableHeader column={column} title="Project" icon={PiKanbanDuotone} />
    ),
    cell: ({ row }) => {
      const project_name = row.original?.project?.[0]?.project_name;
      return <div className="text-sm font-medium">{project_name}</div>;
    },
    size: 150,
  },
  {
    id: "department_name",
    accessorFn: (row) => row?.department?.[0]?.department_name ?? "",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Department"
        icon={PiBuildingsDuotone}
      />
    ),
    cell: ({ row }) => {
      const departmentName = row.original?.department?.[0]?.department_name;
      return <div className="text-sm font-medium">{departmentName}</div>;
    },
    size: 150,
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
        {row.getValue("status")}
      </Badge>
    ),
    size: 90,
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
    cell: ({ row }) => {
      const version = row.original?.version;
      return (
        <Badge variant="secondary" className="font-mono text-sm">
          <span className="mr-0 text-muted-foreground">v</span>
          {version}
        </Badge>
      );
    },
    size: 80,
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
          label: "Submit",
          dot: "bg-emerald-500",
          text: "text-emerald-600 dark:text-emerald-300",
          bar: "from-emerald-400 via-emerald-500 to-emerald-600",
        },
        {
          min: 70,
          label: "Steady",
          dot: "bg-sky-500",
          text: "text-sky-600 dark:text-sky-300",
          bar: "from-sky-400 via-sky-500 to-sky-600",
        },
        {
          min: 40,
          label: "Progressing",
          dot: "bg-amber-500",
          text: "text-amber-600 dark:text-amber-300",
          bar: "from-amber-400 via-amber-500 to-amber-600",
        },
        {
          min: 0,
          label: "Started",
          dot: "bg-slate-400",
          text: "text-slate-600 dark:text-slate-300",
          bar: "from-slate-400 via-slate-500 to-slate-600",
        },
      ] as const;

      // State for when product is already submitted
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

      // Use submitted state if product is submitted, otherwise determine based on percentage
      const progressState =
        row.original.status === "submitted"
          ? SUBMITTED_STATE
          : getProgressState(clampedPercentage);

      return (
        // <div className="flex items-center gap-3 min-w-[120px]">
        //   <Progress value={progress} className="h-2 w-full" />
        //   <span className="text-xs font-medium text-muted-foreground w-9 text-right">
        //     {progress}%
        //   </span>
        // </div>
        <div className="flex items-center gap-1">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className="flex items-center gap-4 justify-between text-[0.7rem] font-medium leading-none">
              <span
                className={cn(
                  "flex w-full items-center gap-1 text-muted-foreground",
                  progressState.text,
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", progressState.dot)}
                />
                {progressState.label}
              </span>
              <span className="text-[0.65rem] w-full text-muted-foreground text-right">
                {tabsCompleted.length}/{TOTAL_TABS} tabs
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full bg-linear-to-r transition-[width] duration-300 ease-out z-45",
                  progressState.bar,
                )}
                style={{ width: `${clampedPercentage}%` }}
              />
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-border transition-[width] duration-300 ease-out z-40"
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
    size: 180,
  },
  {
    id: "created_by",
    accessorFn: (row) =>
      row.createdBy ?? getAuditActionBy(row.auditLogs, "create"),
    enableHiding: false,
  },
  {
    id: "modified_by",
    accessorFn: (row) =>
      row.modifiedBy ?? getAuditActionBy(row.auditLogs, "update"),
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 40,
    enableHiding: false,
  },
];

export default function ProductsPageProductTable() {
  const router = useRouter();
  const { data } = useGetAllProducts();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_by: false,
    modified_by: false,
  });
  const [filterResetSignal, setFilterResetSignal] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "_id",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: data?.result.products ?? [],
    columns,
    defaultColumn: { filterFn: advancedFilterFn },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  const productNameFilterValue = table
    .getColumn("product_name")
    ?.getFilterValue();
  const productNameQuery =
    typeof productNameFilterValue === "string"
      ? productNameFilterValue
      : typeof productNameFilterValue === "object" &&
          productNameFilterValue !== null &&
          "value" in productNameFilterValue
        ? String((productNameFilterValue as AdvancedFilter).value ?? "")
        : "";
  const hasActiveFilters = table.getState().columnFilters.length > 0;

  const handleClearFilters = () => {
    table.setColumnFilters([]);
    setFilterResetSignal((signal) => signal + 1);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center justify-start w-full gap-3">
          <Input
            placeholder="Filter products..."
            value={productNameQuery}
            onChange={(event) =>
              table
                .getColumn("product_name")
                ?.setFilterValue(event.target.value)
            }
            className="w-60 h-7 text-xs"
          />
          <FilterBuilder key={filterResetSignal} table={table} />

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <PiXCircleDuotone />
              Clear filters
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <PiColumnsDuotone />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{ boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)" }}
            >
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
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
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    router.push(
                      `/products/${row.original._id}/product-information`,
                    );
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <PiCaretCircleDoubleLeftDuotone aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <PiCaretCircleLeftDuotone aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <PiCaretCircleRightDuotone aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <PiCaretCircleDoubleRightDuotone aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
    // </div>
  );
}

function RowActions({ row }: { row: { original: Item } }) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [showExportPDFDialog, setShowExportPDFDialog] = useState(false);

  const canCreateVersion = row.original.status === "submitted";

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="shadow-none"
            aria-label="More actions"
            onClick={(e) => e.stopPropagation()}
          >
            <PiDotsThreeCircleVerticalDuotone size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowUpdateDialog(true), 100);
              }}
            >
              <PiPencilCircleDuotone className=" h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowVersionDialog(true), 100);
              }}
              disabled={!canCreateVersion}
              className={cn(
                !canCreateVersion && "opacity-50 cursor-not-allowed",
              )}
            >
              <PiGitMergeDuotone />
              New version
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowExportPDFDialog(true), 100);
              }}
            >
              <PiFilePdfDuotone className="h-4 w-4" />
              <span>Export to PDF</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowArchiveDialog(true), 100);
              }}
            >
              <PiArchiveDuotone className=" h-4 w-4" />
              <span>Archive</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowShareDialog(true), 100);
              }}
            >
              <PiShareDuotone className=" h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowBookmarkDialog(true), 100);
              }}
            >
              <PiBookmarkDuotone className=" h-4 w-4" />
              <span>Add to Bookmarks</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateProductDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        product={row.original}
      />
      <DialogArchiveProduct
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        product={row.original}
      />
      <DialogShareProduct
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        product={row.original}
      />
      <DialogBookmarkProduct
        open={showBookmarkDialog}
        onOpenChange={setShowBookmarkDialog}
        product={row.original}
      />
      <DialogCreateVersion
        open={showVersionDialog}
        onOpenChange={setShowVersionDialog}
        product={row.original}
      />
      <DialogExportProductPDF
        open={showExportPDFDialog}
        onOpenChange={setShowExportPDFDialog}
        product={row.original}
      />
    </div>
  );
}
