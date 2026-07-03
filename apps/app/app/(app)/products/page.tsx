"use client";

import {
  type Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  PiArchiveDuotone,
  PiBookmarkDuotone,
  PiFilePdfDuotone,
  PiGitMergeDuotone,
  PiPackageDuotone,
  PiPencilCircleDuotone,
  PiShareDuotone,
} from "react-icons/pi";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ProductProcessDropdown } from "@/components/common/ProductProgressDropdown";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { WorkspaceListPaginationSkeleton } from "@/components/table/WorkspaceListPaginationSkeleton";
import { WorkspaceListToolbarSkeleton } from "@/components/table/WorkspaceListToolbarSkeleton";
import ShowOrHideTableColumnsDropdown from "@/features/workspace/common/ShowOrHideTableColumnsDropdown";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import CreateProductDialog from "@/features/workspace/products/CreateProductDialog";
import DialogArchiveProduct from "@/features/workspace/products/DialogArchiveProduct";
import DialogBookmarkProduct from "@/features/workspace/products/DialogBookmarkProduct";
import DialogCreateVersion from "@/features/workspace/products/DialogCreateVersion";
import DialogExportProductPDF from "@/features/workspace/products/DialogExportProductPDF";
import DialogShareProduct from "@/features/workspace/products/DialogShareProduct";
import { ProductListItem } from "@/features/workspace/products/productListItem";
import UpdateProductDialog from "@/features/workspace/products/UpdateProductDialog";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import ProductExportsSheet from "@/features/workspace/products/ProductExportsSheet";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";
import { AuditLog } from "@/types/product";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import {
  ArchiveIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Blockchain03Icon,
  BookmarkAdd01Icon,
  MoreVerticalSquare01Icon,
  Pdf01Icon,
  PropertyAddIcon,
  PropertyEditIcon,
  Share08Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
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

const PRODUCT_LIST_CONTENT_MIN_HEIGHT = "min-h-[55rem] md:min-h-[42rem]";

const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  createdOn: false,
  modifiedOn: false,
};

const getAuditActionBy = (
  auditLogs: Array<AuditLog> | undefined,
  action: string,
) =>
  auditLogs
    ?.filter((log) => log.action === action)
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime(),
    )[0]?.actionBy ?? "";

const getAuditActionAt = (
  auditLogs: Array<AuditLog> | undefined,
  action: string,
) => {
  const actionAt = auditLogs
    ?.filter((log) => log.action === action)
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime(),
    )[0]?.actionAt;

  if (!actionAt) return "";

  return typeof actionAt === "string" ? actionAt : actionAt.toISOString();
};

function AuditMetaCell({ name, date }: { name: string; date?: string | null }) {
  const formattedDate = formatToLocalDateTime(date);

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{name || "—"}</span>
      {formattedDate ? (
        <span className="truncate text-xs text-muted-foreground/60">
          {formattedDate}
        </span>
      ) : null}
    </div>
  );
}

const PRODUCT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "product_name", label: "Product Name", type: "text" },
  { name: "product_plan_number", label: "Product Plan Number", type: "text" },
  { name: "project_name", label: "Project", type: "text" },
  { name: "department_name", label: "Department", type: "text" },
  { name: "status", label: "Status", type: "text" },
  { name: "version", label: "Version", type: "number" },
  { name: "complete_count", label: "Progress", type: "number" },
  { name: "createdBy", label: "Created By", type: "text" },
  { name: "createdOn", label: "Created On", type: "date" },
  { name: "modifiedBy", label: "Modified By", type: "text" },
  { name: "modifiedOn", label: "Modified On", type: "date" },
];

const PRODUCT_SORT_FIELDS = PRODUCT_FILTER_COLUMNS.map((column) => column.name);

const PRODUCT_TABLE_COLUMN_COUNT = 8;

const columnHeaderMap = [
  {
    title: "PPN",
    info: "Product Plan Number - Unique identifier for the product plan",
  },
  { title: "Product Name", info: "Name of the product" },
  { title: "Project", info: "Name of the project this product belongs to" },
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
  {
    title: "Created",
    info: "User who created the product and when it was created",
  },
  {
    title: "Modified",
    info: "User who last modified the product and when it was last modified",
  },
];

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<ProductListItem, unknown>;
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

const columns: ColumnDef<ProductListItem>[] = [
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
    size: 220,
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
    id: "project_name",
    accessorFn: (row) => row?.project?.[0]?.project_name ?? "",
    size: 150,
    header: ({ column }) => <SortableHeader column={column} title="Project" />,
    cell: ({ row }) => (
      <div className="text-sm font-medium truncate">
        {row.original?.project?.[0]?.project_name}
      </div>
    ),
  },
  {
    id: "department_name",
    accessorFn: (row) => row?.department?.[0]?.department_name ?? "",
    size: 150,
    header: ({ column }) => (
      <SortableHeader column={column} title="Department" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium truncate">
        {row.original?.department?.[0]?.department_name}
      </div>
    ),
  },
  {
    accessorKey: "status",
    size: 90,
    minSize: 80,
    maxSize: 100,
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
        {row.getValue("status")}
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
            totalTabs={7}
          />
        </div>
      );
    },
  },
  {
    id: "createdOn",
    accessorFn: (row) =>
      row.createdOn ?? getAuditActionAt(row.auditLogs, "create"),
    size: 160,
    enableHiding: true,
    meta: { label: "Created" },
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <AuditMetaCell
        name={
          row.original.createdBy ??
          getAuditActionBy(row.original.auditLogs, "create")
        }
        date={
          row.original.createdOn ??
          getAuditActionAt(row.original.auditLogs, "create")
        }
      />
    ),
  },
  {
    id: "modifiedOn",
    accessorFn: (row) =>
      row.modifiedOn ?? getAuditActionAt(row.auditLogs, "update"),
    size: 160,
    enableHiding: true,
    meta: { label: "Modified" },
    header: ({ column }) => <SortableHeader column={column} title="Modified" />,
    cell: ({ row }) => (
      <AuditMetaCell
        name={
          row.original.modifiedBy ??
          getAuditActionBy(row.original.auditLogs, "update")
        }
        date={
          row.original.modifiedOn ??
          getAuditActionAt(row.original.auditLogs, "update")
        }
      />
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 40,
    enableHiding: false,
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const listState = useWorkspaceListQuery({
    defaultSort: "product_name",
    allowedSortFields: PRODUCT_SORT_FIELDS,
    filterColumns: PRODUCT_FILTER_COLUMNS,
  });
  const { data, isFetching, isPending, isError } = useGetAllProducts(
    listState.query,
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_COLUMN_VISIBILITY,
  );

  const paginationInfo = data?.result?.pagination;
  const isListBusy = isPending || isFetching;
  const hasProductsToList =
    isListBusy ||
    isError ||
    (paginationInfo?.totalCount ?? 0) > 0 ||
    listState.query.filters.length > 0;

  const sorting = useMemo<SortingState>(
    () => [
      { id: listState.query.sort, desc: listState.query.order === "desc" },
    ],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (!paginationInfo) return;
    if (paginationInfo.totalPages === 0) {
      if (listState.query.page !== 1) listState.setPage(1);
      return;
    }
    if (listState.query.page > paginationInfo.totalPages) {
      listState.setPage(1);
    }
  }, [listState.query.page, listState, paginationInfo]);

  const table = useReactTable({
    data: data?.result.products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 1,
    initialState: {
      columnVisibility: DEFAULT_COLUMN_VISIBILITY,
    },
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

  const showAuditColumns =
    columnVisibility.createdOn !== false ||
    columnVisibility.modifiedOn !== false;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">All Products</p>
          <InfoTooltip content="Manage and view all products in your workspace. Products are labeling documentation records with metadata, seven structured tabs, versions, and redlines." />
        </div>
        <div className="flex items-center gap-2">
          {isListBusy ? (
            <WorkspaceListToolbarSkeleton />
          ) : !isError ? (
            <>
              <ShowOrHideTableColumnsDropdown table={table} />
              <WorkspaceListControls
                filters={listState.query.filters}
                filterColumns={PRODUCT_FILTER_COLUMNS}
                onApplyFilters={listState.setFilters}
                onClearFilters={listState.clearFilters}
              />
            </>
          ) : null}
          <ProductExportsSheet />
          <CreateProductDialog />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isError ? (
          <DashboardErrorState
            variant="panel"
            icon={Blockchain03Icon}
            title="Failed to load products"
            className={PRODUCT_LIST_CONTENT_MIN_HEIGHT}
          />
        ) : hasProductsToList ? (
          <div className="flex flex-col items-end">
            <div className="w-full">
              <div className="w-full border-b border-border overflow-hidden">
                <Table
                  className={cn(
                    showAuditColumns
                      ? "table-auto w-max min-w-full"
                      : "table-fixed",
                  )}
                >
                  {!showAuditColumns ? (
                    <colgroup>
                      {table.getHeaderGroups()[0]?.headers.map((header) => (
                        <col
                          key={header.id}
                          style={{ width: `${header.getSize()}px` }}
                        />
                      ))}
                    </colgroup>
                  ) : null}
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
                            style={
                              showAuditColumns
                                ? {
                                    width: `${header.getSize()}px`,
                                    ...(typeof header.column.columnDef
                                      .minSize === "number"
                                      ? {
                                          minWidth: `${header.column.columnDef.minSize}px`,
                                        }
                                      : {}),
                                  }
                                : undefined
                            }
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
                    {isListBusy ? (
                      <TableBodySkeleton
                        columnCount={PRODUCT_TABLE_COLUMN_COUNT}
                      />
                    ) : table.getRowModel().rows?.length ? (
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
                            <TableCell
                              key={cell.id}
                              className={cn(
                                cell.column.id === "actions" && "last:py-0",
                              )}
                            >
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
                          <ProductsEmptyState />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex h-10 w-full items-center border-b">
              {isListBusy ? (
                <WorkspaceListPaginationSkeleton />
              ) : (
                <WorkspaceListPagination
                  pagination={paginationInfo}
                  onPageChange={listState.setPage}
                />
              )}
            </div>
          </div>
        ) : (
          <ProductsEmptyState className="m-4" />
        )}
      </div>
    </div>
  );
}

function ProductsEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-border rounded-xl bg-muted/30",
        className,
      )}
    >
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
        <PiPackageDuotone className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">No products found</p>
        <p className="text-xs text-muted-foreground">
          Get started by creating a new product
        </p>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: { original: ProductListItem } }) {
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
            className="shadow-none text-muted-foreground/60 hover:text-foreground"
            aria-label="More actions"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon icon={MoreVerticalSquare01Icon} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowUpdateDialog(true), 100);
              }}
            >
              <Icon icon={PropertyEditIcon} />
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
              <Icon icon={PropertyAddIcon} />
              New version
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowExportPDFDialog(true), 100);
              }}
            >
              <Icon icon={Pdf01Icon} />
              <span>Export to PDF</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowArchiveDialog(true), 100);
              }}
            >
              <Icon icon={ArchiveIcon} />
              <span>Archive</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowShareDialog(true), 100);
              }}
            >
              <Icon icon={Share08Icon} />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                setTimeout(() => setShowBookmarkDialog(true), 100);
              }}
            >
              <Icon icon={BookmarkAdd01Icon} />
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
