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
  PiTextTDuotone,
  PiCheckCircleDuotone,
} from "react-icons/pi";
import EditSymbolsDialog from "./EditSymbolsDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";
import type { DiffItem } from "@/utils/deepDiff";

type Item = {
  id: string;
  componentName: string;
  componentImage: string;
  key?: string;
  symbolsTextPresent: string[];
  textPresent: boolean;
  standard_symbol_id?: string;
  standard_ref_number?: string;
  _redlineStatus?: "added" | "removed" | "modified" | "unchanged";
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
  _redlineBaseImage?: string;
};

type TableMeta = {
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  getFieldDiff?: (row: Item, field: string, value?: unknown) => DiffItem | null;
  getRowStatus?: (row: Item) => "added" | "removed" | "modified" | null;
};

const getPersistentItemId = (item: Item): string =>
  item._redlineId || item.id || item.componentName;

const getRedlineImagePresentation = (row: Item, meta?: TableMeta) => {
  const image =
    typeof row.componentImage === "string" ? row.componentImage.trim() : "";
  const rowStatus = meta?.getRowStatus?.(row);
  const diff = meta?.isRedlineView
    ? (meta.getFieldDiff?.(row, "componentImage", row.componentImage) ??
      row._redlineDiffs?.find((d) => d.path === "image") ??
      null)
    : null;
  const oldImage =
    row._redlineBaseImage ||
    (typeof diff?.old_value === "string" ? diff.old_value.trim() : "");
  const newImage =
    typeof diff?.new_value === "string" ? diff.new_value.trim() : "";

  if (rowStatus === "added") {
    return {
      src: image || newImage,
      badge: "NEW" as const,
      frameClassName: "border-blue-300",
      imageClassName: undefined,
    };
  }

  if (rowStatus === "removed") {
    return {
      src: image || oldImage,
      badge: "DEL" as const,
      frameClassName: "border-red-300",
      imageClassName: "opacity-70",
    };
  }

  if (diff?.status === "added") {
    return {
      src: image || newImage,
      badge: "NEW" as const,
      frameClassName: "border-blue-300",
      imageClassName: undefined,
    };
  }

  if (diff?.status === "removed") {
    return {
      src: oldImage,
      badge: "DEL" as const,
      frameClassName: "border-red-300",
      imageClassName: "opacity-70",
    };
  }

  if (diff?.status === "modified") {
    const modifiedImage = image || newImage || oldImage;
    const imageWasRemoved = !image && !newImage && Boolean(oldImage);
    return {
      src: modifiedImage,
      badge: "MOD" as const,
      frameClassName: "border-amber-300",
      imageClassName: imageWasRemoved ? "opacity-70" : undefined,
    };
  }

  return {
    src: image,
    frameClassName: undefined as string | undefined,
    imageClassName: undefined as string | undefined,
  };
};

// Helper component for displaying redline values (vertical stacking)
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
      {/* Old value - show for modified and removed */}
      {(isModified || isRemoved) && diff.old_value !== null && (
        <div
          className={`line-through text-sm ${
            showBadgeStyle ? "text-red-700" : "text-red-600/70"
          }`}
        >
          {format(diff.old_value, true, false)}
        </div>
      )}
      {/* New value - show for modified and added */}
      {(isModified || isAdded) && !isRemoved && (
        <div
          className={`text-sm ${
            showBadgeStyle ? "text-blue-700" : "text-blue-700"
          }`}
        >
          {format(diff.new_value, false, true)}
        </div>
      )}
    </div>
  );
};

// Helper component for sortable headers
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
          {...{
            className: "size-7 shadow-none text-muted-foreground",
            onClick: row.getToggleExpandedHandler(),
            "aria-expanded": row.getIsExpanded(),
            "aria-label": row.getIsExpanded()
              ? `Collapse details for ${row.original.componentName}`
              : `Expand details for ${row.original.componentName}`,
            size: "icon",
            variant: "ghost",
          }}
        >
          {row.getIsExpanded() ? (
            <PiCaretCircleDownDuotone
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          ) : (
            <PiCaretCircleRightDuotone
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
      ) : undefined;
    },
    size: 30,
  },
  {
    accessorKey: "componentImage",
    header: () => <SortableHeader title="Image" icon={PiImageDuotone} />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const imagePresentation = getRedlineImagePresentation(row.original, meta);

      if (imagePresentation.badge && imagePresentation.src) {
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`text-[9px] font-medium ${
                imagePresentation.badge === "NEW"
                  ? "text-blue-600"
                  : imagePresentation.badge === "DEL"
                    ? "text-red-600"
                    : "text-amber-700"
              }`}
            >
              {imagePresentation.badge}
            </span>
            <ProductImageFrame
              src={imagePresentation.src}
              alt={row.original.componentName}
              frameClassName={imagePresentation.frameClassName}
              imageClassName={imagePresentation.imageClassName}
            />
          </div>
        );
      }

      return imagePresentation.src ? (
        <ProductImageFrame
          src={imagePresentation.src}
          alt={row.original.componentName}
          frameClassName={imagePresentation.frameClassName}
          imageClassName={imagePresentation.imageClassName}
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
        title="Symbol Text"
        icon={PiTextTDuotone}
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
    accessorKey: "textPresent",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Text Present"
        icon={PiCheckCircleDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "text_present",
            row.getValue("textPresent"),
          )
        : null;

      if (diff) {
        return (
          <RedlineCell
            value={row.getValue("textPresent")}
            diff={diff}
            showBadgeStyle={true}
            formatFn={(v, isOld, isNew) => (
              <Badge
                variant={
                  isNew
                    ? "default"
                    : isOld
                      ? "destructive"
                      : v
                        ? "default"
                        : "secondary"
                }
                className={`${
                  isNew
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                    : isOld
                      ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 line-through"
                      : ""
                }`}
              >
                {v ? "Yes" : "No"}
              </Badge>
            )}
          />
        );
      }

      return (
        <Badge variant={row.getValue("textPresent") ? "default" : "secondary"}>
          {row.getValue("textPresent") ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "symbolsTextPresent",
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
      const symbols = row.getValue("symbolsTextPresent") as string[];

      // Check for added and removed label presence values
      let addedLabels: string[] = [];
      let removedLabels: string[] = [];
      if (meta?.isRedlineView) {
        const rowStatus = row.original._redlineStatus;
        const rowDiffs = row.original._redlineDiffs ?? [];
        if (rowStatus === "added") {
          addedLabels = symbols;
        } else if (rowStatus === "removed") {
          removedLabels = symbols;
        } else {
          const labelDiffs = rowDiffs.filter((d) =>
            d.path.startsWith("label_presence"),
          );
          addedLabels = labelDiffs
            .filter(
              (d) =>
                (d.status === "added" || d.status === "modified") &&
                d.new_value,
            )
            .map((d) => d.new_value as string);
          removedLabels = labelDiffs
            .filter(
              (d) =>
                (d.status === "removed" || d.status === "modified") &&
                d.old_value,
            )
            .map((d) => d.old_value as string);
        }
      }

      // Merge current with added and removed for display
      const displayLabels = meta?.isRedlineView
        ? [
            ...symbols,
            ...addedLabels.filter((l) => !symbols.includes(l)),
            ...removedLabels.filter((l) => !symbols.includes(l)),
          ]
        : symbols;

      return (
        <div className="flex flex-wrap gap-1">
          {displayLabels && displayLabels.length > 0 ? (
            displayLabels.map((symbol, index) => {
              const isNewlyAdded = addedLabels.includes(symbol);
              const isRemoved = removedLabels.includes(symbol);
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
                  {symbol}
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

type SymbolsGraphicsPageSymbolsTableProps = {
  data?: Item[];
  isSubmitted?: boolean;
  isRedlineView?: boolean;
};

export default function SymbolsGraphicsPageSymbolsTable({
  data,
  isSubmitted = false,
  isRedlineView = false,
}: SymbolsGraphicsPageSymbolsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "componentName",
      desc: false,
    },
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
    data: data || [],
    columns,
    getRowId: (originalRow) => getPersistentItemId(originalRow),
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
          filterColumns={[
            { name: "componentName", label: "Symbol Text", type: "text" },
            { name: "textPresent", label: "Text Present", type: "boolean" },
            {
              name: "symbolsTextPresent",
              label: "Presence on Labels",
              type: "text",
            },
          ]}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-background">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
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
                  );
                })}
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
                const itemId = getPersistentItemId(row.original);

                return (
                  <Fragment key={itemId}>
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
                            {/* Status badge in expander column */}
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
                              const meta = table.options.meta;
                              const imagePresentation =
                                getRedlineImagePresentation(row.original, meta);
                              return imagePresentation.src ? (
                                <ProductImageFrame
                                  src={imagePresentation.src}
                                  alt={row.original.componentName}
                                  variant="preview"
                                  frameClassName={
                                    imagePresentation.frameClassName
                                  }
                                  imageClassName={
                                    imagePresentation.imageClassName
                                  }
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
      {/* Pagination */}
      <div className="flex shrink-0 items-center justify-end gap-8">
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
  const itemId = getPersistentItemId(item);
  const actionsDisabled = isSubmitted || item._redlineStatus === "removed";

  // Get productId from the current URL using usePathname
  const pathname = usePathname();
  const getProductId = (): string => {
    if (!pathname) return "";
    const match = pathname.match(/\/products\/([^\/]+)/);
    return match ? match[1] : "";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="More actions"
            disabled={actionsDisabled}
          >
            <PiDotsThreeCircleDuotone size={18} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={actionsDisabled}
              onSelect={() => {
                setTimeout(() => setShowEditDialog(true), 100);
              }}
            >
              <PiPencilSimpleDuotone className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={actionsDisabled}
            onSelect={() => {
              setTimeout(() => setShowDeleteDialog(true), 100);
            }}
            className="text-destructive focus:text-destructive"
          >
            <PiTrashDuotone className="text-destructive h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSymbolsDialog
        key={`edit-${itemId}`}
        productId={getProductId()}
        symbol={{ ...item, key: item.key }}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteSymbolsSchematicsDialog
        key={`delete-${itemId}`}
        productId={getProductId()}
        graphics={item}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
