"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Column,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Fragment, useState, type ElementType } from "react";
import { usePathname } from "next/navigation";

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
import TableControls from "@/components/table/TableControls";
import { advancedFilterFn } from "@/lib/table-filters";
import { ProductImageFrame } from "../ProductImageFrame";
import {
  PiPencilSimpleDuotone,
  PiTrashDuotone,
  PiImageDuotone,
  PiTextAlignLeftDuotone,
  PiTagDuotone,
  PiCaretDownDuotone,
  PiCaretUpDuotone,
  PiCaretUpDownDuotone,
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleDownDuotone,
  PiDotsThreeCircleDuotone,
  PiBarcodeDuotone,
  PiHashDuotone,
} from "react-icons/pi";
import EditBarcodesDialog from "./EditBarcodesDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";
import type { DiffItem } from "@/utils/deepDiff";

type Item = {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  key?: string;
  note?: string;
  presentOnLabels: string[];
  count?: number;
  _redlineStatus?: "added" | "removed" | "modified" | "unchanged";
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
};

type TableMeta = {
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  getFieldDiff?: (row: Item, field: string, value?: unknown) => DiffItem | null;
  getRowStatus?: (row: Item) => "added" | "removed" | "modified" | null;
};

// Helper component for displaying redline values
const RedlineCell = ({
  value,
  diff,
  formatFn,
  showBadgeStyle = false,
}: {
  value: unknown;
  diff: DiffItem | null;
  formatFn?: (v: unknown, isOld?: boolean, isNew?: boolean) => React.ReactNode;
  showBadgeStyle?: boolean;
}) => {
  const format =
    formatFn ||
    ((v: unknown) => (typeof v === "string" ? v : v != null ? String(v) : "-"));
  if (!diff) return <>{format(value)}</>;

  const isAdded = diff.status === "added";
  const isRemoved = diff.status === "removed";
  const isModified = diff.status === "modified";

  return (
    <div className="flex flex-col gap-1">
      {(isModified || isRemoved) && diff.old_value !== null && (
        <div
          className={`line-through text-sm ${
            showBadgeStyle
              ? "text-red-700 px-1.5 py-0.5"
              : "text-red-600/70 px-1.5 py-0.5"
          }`}
        >
          {format(diff.old_value, true, false)}
        </div>
      )}
      {(isModified || isAdded) && !isRemoved && (
        <div
          className={`text-sm ${
            showBadgeStyle
              ? "text-blue-700 px-1.5 py-0.5"
              : "text-blue-700 px-1.5 py-0.5"
          }`}
        >
          {format(diff.new_value, false, true)}
        </div>
      )}
    </div>
  );
};

const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column?: Column<Item, unknown>;
  title: string;
  icon: ElementType;
}) => {
  if (!column) {
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{title}</span>
      </div>
    );
  }
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
    id: "expander",
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          className="size-7 shadow-none text-muted-foreground"
          onClick={row.getToggleExpandedHandler()}
          aria-expanded={row.getIsExpanded()}
          size="icon"
          variant="ghost"
        >
          {row.getIsExpanded() ? (
            <PiCaretCircleDownDuotone className="opacity-60" size={16} />
          ) : (
            <PiCaretCircleRightDuotone className="opacity-60" size={16} />
          )}
        </Button>
      ) : undefined;
    },
    size: 30,
  },
  {
    accessorKey: "componentImage",
    header: () => <SortableHeader title="Image" icon={PiImageDuotone} />,
    cell: ({ row }) => {
      const image = row.original.componentImage;
      const hasImage = typeof image === "string" && image.trim() !== "";
      return hasImage ? (
        <ProductImageFrame
          src={image}
          alt={row.original.componentName}
        />
      ) : (
        <ProductImageFrame alt={row.original.componentName} />
      );
    },
    size: 80,
  },
  {
    accessorKey: "componentName",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Barcode Type"
        icon={PiBarcodeDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "text",
            row.getValue("componentName"),
          )
        : null;
      return diff ? (
        <RedlineCell
          value={row.getValue("componentName")}
          diff={diff}
          formatFn={(v) => (
            <span className="font-medium">
              {typeof v === "string" ? v : String(v ?? "")}
            </span>
          )}
        />
      ) : (
        <span className="font-medium">{row.getValue("componentName")}</span>
      );
    },
  },
  {
    accessorKey: "componentDescription",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Barcode Data"
        icon={PiTextAlignLeftDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "description",
            row.getValue("componentDescription"),
          )
        : null;
      return diff ? (
        <RedlineCell
          value={row.getValue("componentDescription")}
          diff={diff}
          formatFn={(v) => (
            <div className="max-w-xs whitespace-pre-line text-sm">
              {typeof v === "string" ? v : v != null ? String(v) : "-"}
            </div>
          )}
        />
      ) : (
        <div className="max-w-xs whitespace-pre-line text-sm text-muted-foreground">
          {row.getValue("componentDescription") || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "presentOnLabels",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Presence on Labels"
        icon={PiTagDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const labels = row.getValue("presentOnLabels") as string[];

      // Check for added and removed label presence values
      let addedLabels: string[] = [];
      let removedLabels: string[] = [];
      if (meta?.isRedlineView) {
        const rowStatus = row.original._redlineStatus;
        const rowDiffs = row.original._redlineDiffs ?? [];
        if (rowStatus === "added") {
          addedLabels = labels;
        } else if (rowStatus === "removed") {
          removedLabels = labels;
        } else {
          const labelDiffs = rowDiffs.filter((d) =>
            d.path.startsWith("label_presence"),
          );
          addedLabels = labelDiffs
            .filter((d) => d.status === "added" && d.new_value)
            .map((d) => d.new_value as string);
          removedLabels = labelDiffs
            .filter((d) => d.status === "removed" && d.old_value)
            .map((d) => d.old_value as string);
        }
      }

      // Merge current with added and removed for display
      const displayLabels = meta?.isRedlineView
        ? [
            ...labels,
            ...addedLabels.filter((l) => !labels.includes(l)),
            ...removedLabels.filter((l) => !labels.includes(l)),
          ]
        : labels;

      return (
        <div className="flex flex-wrap gap-1">
          {displayLabels && displayLabels.length > 0 ? (
            displayLabels.map((label, index) => {
              const isNewlyAdded = addedLabels.includes(label);
              const isRemoved = removedLabels.includes(label);
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${
                    isNewlyAdded
                      ? "border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500"
                      : isRemoved
                        ? "border-red-400 text-red-700 bg-red-50 line-through dark:bg-red-900/20 dark:text-red-400 dark:border-red-500"
                        : ""
                  }`}
                >
                  {label}
                </Badge>
              );
            })
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "count",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader column={column} title="Count" icon={PiHashDuotone} />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const count = row.getValue("count") as number;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(row.original, "count", count)
        : null;

      const displayCount = count ?? 1; // Default to 1 if count is not set

      return diff ? (
        <RedlineCell
          value={displayCount}
          diff={diff}
          formatFn={(v) => (
            <span className="font-medium">
              {typeof v === "string" ? v : String(v ?? "")}
            </span>
          )}
        />
      ) : (
        <span className="font-medium">{displayCount}</span>
      );
    },
    size: 80,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => (
      <RowActions
        row={row}
        isSubmitted={
          (table.options.meta as { isSubmitted?: boolean })?.isSubmitted
        }
      />
    ),
    size: 40,
    enableHiding: false,
  },
];

export default function SymbolsGraphicsPageBarcodesTable({
  data: dataProp,
  isSubmitted = false,
  isRedlineView = false,
}: {
  data?: Item[];
  isSubmitted?: boolean;
  isRedlineView?: boolean;
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "componentName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const getRowStatus = (row: Item) => {
    if (!isRedlineView) return null;
    const status = row._redlineStatus;
    if (!status || status === "unchanged") return null;
    return status === "modified" ? "modified" : status;
  };

  const getFieldDiff = (row: Item, field: string, value?: unknown) => {
    if (!isRedlineView) return null;
    const status = row._redlineStatus;
    const rawValue = value ?? (row as Record<string, unknown>)[field];
    if (status === "added") {
      return {
        path: field,
        status: "added",
        old_value: null,
        new_value: rawValue,
      } as DiffItem;
    }
    if (status === "removed") {
      return {
        path: field,
        status: "removed",
        old_value: rawValue,
        new_value: null,
      } as DiffItem;
    }
    return row._redlineDiffs?.find((d) => d.path === field) ?? null;
  };

  const table = useReactTable({
    data: dataProp || [],
    columns,
    getRowCanExpand: (row) => Boolean(row.original.componentName),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    defaultColumn: { filterFn: advancedFilterFn<Item>() },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, pagination, columnFilters, columnVisibility },
    meta: { isSubmitted, isRedlineView, getFieldDiff, getRowStatus },
  });

  return (
    <div className="mt-2 flex flex-1 min-h-0 w-full flex-col gap-2">
      <div className="shrink-0">
        <TableControls
          table={table}
          searchColumnId="componentName"
          searchPlaceholder="Filter barcodes..."
          filterColumns={[
            { name: "componentName", label: "Barcode Name", type: "text" },
            {
              name: "componentDescription",
              label: "Description",
              type: "text",
            },
            {
              name: "presentOnLabels",
              label: "Presence on Labels",
              type: "text",
            },
            { name: "count", label: "Count", type: "number" },
          ]}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-background">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowStatus = getRowStatus(row.original);
                const isAdded = isRedlineView && rowStatus === "added";
                const isRemoved = isRedlineView && rowStatus === "removed";
                const isModified = isRedlineView && rowStatus === "modified";

                return (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={`hover:bg-muted/50 ${
                        isAdded ? "bg-blue-50/30" : ""
                      } ${isRemoved ? "bg-red-50/30" : ""} ${
                        isModified ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {row.getVisibleCells().map((cell, cellIdx) => (
                        <TableCell
                          key={cell.id}
                          className="last:py-0 whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                        >
                          <div className="flex items-center gap-2">
                            {cellIdx === 0 && isRedlineView && rowStatus && (
                              <span
                                className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full border shadow-sm whitespace-nowrap ${
                                  isAdded
                                    ? "text-blue-700 bg-blue-100 border-blue-200"
                                    : isRemoved
                                      ? "text-red-700 bg-red-100 border-red-200"
                                      : "text-amber-700 bg-amber-100 border-amber-200"
                                }`}
                              >
                                {isAdded ? "NEW" : isRemoved ? "DEL" : "MOD"}
                              </span>
                            )}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <div className="flex flex-col items-center py-4">
                            {(() => {
                              const image = row.original.componentImage;
                              const hasImage =
                                typeof image === "string" &&
                                image.trim() !== "";
                              return hasImage ? (
                                <ProductImageFrame
                                  src={image}
                                  alt={row.original.componentName}
                                  variant="preview"
                                  priority
                                />
                              ) : (
                                <ProductImageFrame
                                  alt={row.original.componentName}
                                  variant="preview"
                                />
                              );
                            })()}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
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
      <div className="flex shrink-0 items-center justify-end gap-8">
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <PiCaretCircleDoubleLeftDuotone />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <PiCaretCircleLeftDuotone />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <PiCaretCircleRightDuotone />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <PiCaretCircleDoubleRightDuotone />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({
  row,
  isSubmitted = false,
}: {
  row: Row<Item>;
  isSubmitted?: boolean;
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const item = row.original;
  const pathname = usePathname();
  const getProductId = (): string => {
    if (!pathname) return "";
    const match = pathname.match(/\/products\/([^\/]+)/);
    return match ? match[1] : "";
  };

  const barcodeForItem = {
    id: item.id,
    componentName: item.componentName,
    description: item.componentDescription,
    componentImage: item.componentImage,
    key: item.key,
    labelPresence: item.presentOnLabels,
    count: item.count,
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            disabled={isSubmitted}
          >
            <PiDotsThreeCircleDuotone size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => setTimeout(() => setShowEditDialog(true), 100)}
            >
              <PiPencilSimpleDuotone className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setTimeout(() => setShowDeleteDialog(true), 100)}
            className="text-destructive focus:text-destructive"
          >
            <PiTrashDuotone className="text-destructive h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditBarcodesDialog
        productId={getProductId()}
        barcode={barcodeForItem}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteSymbolsSchematicsDialog
        productId={getProductId()}
        graphics={barcodeForItem}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
