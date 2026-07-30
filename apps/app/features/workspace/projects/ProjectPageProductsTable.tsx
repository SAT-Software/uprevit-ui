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
import { ProductProgressHoverCard } from "@/components/common/ProductProgressHoverCard";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { WorkspaceListPaginationSkeleton } from "@/components/table/WorkspaceListPaginationSkeleton";
import { WorkspaceListToolbarSkeleton } from "@/components/table/WorkspaceListToolbarSkeleton";
import ShowOrHideTableColumnsDropdown from "@/features/workspace/common/ShowOrHideTableColumnsDropdown";
import {
  DashboardErrorState,
  DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT,
} from "@/features/workspace/dashboard/DashboardErrorState";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";
import { AuditLog } from "@/types/product";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Blockchain03Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
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
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const PROJECT_PRODUCT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "product_plan_number", label: "PPN", type: "text" },
  { name: "product_name", label: "Product Name", type: "text" },
  { name: "department_name", label: "Department Name", type: "text" },
  { name: "status", label: "Status", type: "text" },
  { name: "version", label: "Version", type: "number" },
  { name: "complete_count", label: "Progress", type: "number" },
  { name: "createdBy", label: "Created By", type: "text" },
  { name: "createdOn", label: "Created On", type: "date" },
  { name: "modifiedBy", label: "Modified By", type: "text" },
  { name: "modifiedOn", label: "Modified On", type: "date" },
];

const PROJECT_PRODUCT_SORT_FIELDS = [
  "product_name",
  "product_plan_number",
  "department_name",
  "version",
  "status",
  "complete_count",
  "createdBy",
  "createdOn",
  "modifiedBy",
  "modifiedOn",
  "actionAt",
  "_id",
];

const columnHeaderMap = [
  {
    title: "PPN",
    info: "Product Plan Number - Unique identifier for the product plan",
  },
  { title: "Product Name", info: "Name of the product" },
  {
    title: "Department",
    info: "Name of the department this product belongs to",
  },
  {
    title: "Status",
    info: "Current status of the product. Draft, Submitted or Archived",
  },
  { title: "Version", info: "Latest version number of the product" },
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
    cell: ({ row }) => (
      <div className="text-sm font-medium truncate">
        {row.getValue("product_plan_number")}
      </div>
    ),
  },
  {
    accessorKey: "product_name",
    enableHiding: false,
    size: 270,
    minSize: 150,
    header: ({ column }) => (
      <SortableHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium truncate">
        {row.getValue("product_name")}
      </div>
    ),
  },
  {
    accessorKey: "department_name",
    size: 160,
    header: ({ column }) => (
      <SortableHeader column={column} title="Department" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium truncate">
        {row.original?.department[0]?.department_name}
      </div>
    ),
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
          totalTabs={7}
        />
      );
    },
  },
];

const PROJECT_PRODUCT_TABLE_COLUMN_COUNT = 6;

export default function ProjectPageProductsTable({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const listState = useWorkspaceListQuery({
    defaultSort: "product_name",
    allowedSortFields: PROJECT_PRODUCT_SORT_FIELDS,
    filterColumns: PROJECT_PRODUCT_FILTER_COLUMNS,
  });

  const {
    data: productsData,
    isFetching: isProductsFetching,
    isPending: isProductsPending,
    isError: isProductsError,
  } = useGetAllProducts({
    ...listState.query,
    projectId,
  });

  const data = (productsData?.result?.products || []) as Item[];
  const productsPagination = productsData?.result?.pagination;
  const isProductsListBusy = isProductsPending || isProductsFetching;
  const hasProductsToList =
    isProductsListBusy ||
    isProductsError ||
    (productsPagination?.totalCount ?? 0) > 0 ||
    listState.query.filters.length > 0;

  const sorting = useMemo<SortingState>(
    () => [
      { id: listState.query.sort, desc: listState.query.order === "desc" },
    ],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (!productsPagination) return;
    if (productsPagination.totalPages === 0) {
      if (listState.query.page !== 1) listState.setPage(1);
      return;
    }
    if (listState.query.page > productsPagination.totalPages) {
      listState.setPage(1);
    }
  }, [listState.query.page, listState, productsPagination]);

  const table = useReactTable<Item>({
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
        <div className="h-10 flex items-center justify-between border-b border-border bg-muted/60 pl-3 pr-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Products</p>
            <InfoTooltip
              content="All the products that belong to this project."
              className="mt-0.5"
            />
          </div>
          <div className="flex items-center gap-2">
            {isProductsListBusy ? (
              <WorkspaceListToolbarSkeleton />
            ) : isProductsError ? null : (
              <>
                <ShowOrHideTableColumnsDropdown table={table} />
                <WorkspaceListControls
                  filters={listState.query.filters}
                  filterColumns={PROJECT_PRODUCT_FILTER_COLUMNS}
                  onApplyFilters={listState.setFilters}
                  onClearFilters={listState.clearFilters}
                />
              </>
            )}
          </div>
        </div>

        <div className="w-full">
          {isProductsError ? (
            <DashboardErrorState
              variant="panel"
              embedded
              icon={Blockchain03Icon}
              title="Failed to load products"
              className={DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT}
            />
          ) : hasProductsToList ? (
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
                          {headerGroup.headers.map((header) => (
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
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {isProductsListBusy ? (
                        <TableBodySkeleton
                          columnCount={PROJECT_PRODUCT_TABLE_COLUMN_COUNT}
                        />
                      ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              router.push(
                                `/products/${row.original._id}/product-information`,
                              )
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
                                  This project doesn&apos;t have any products
                                  yet.
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
              <div className="flex h-10 w-full items-center">
                {isProductsListBusy ? (
                  <WorkspaceListPaginationSkeleton />
                ) : (
                  <WorkspaceListPagination
                    pagination={productsPagination}
                    onPageChange={listState.setPage}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl bg-muted/10">
                <div className="flex items-center justify-center p-4 border border-dashed border-border bg-muted/50 rounded-full mb-3">
                  <Icon
                    icon={Blockchain03Icon}
                    size={32}
                    strokeWidth={2}
                    className="text-muted-foreground/50"
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No products found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This project doesn&apos;t have any products yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
