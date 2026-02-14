"use client";

import { Badge } from "@/components/ui/badge";
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
import { usePathname } from "next/navigation";
import { Fragment, useState, type ElementType } from "react";
import {
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleDownDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiCirclesFourDuotone,
  PiDotsThreeCircleDuotone,
  PiHashDuotone,
  PiImageDuotone,
  PiPencilSimpleDuotone,
  PiRulerDuotone,
  PiTagDuotone,
  PiTextAlignLeftDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

import TableControls from "@/components/table/TableControls";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { advancedFilterFn } from "@/lib/table-filters";
import Image from "next/image";
import DeleteComponentDialog from "./DeleteComponentDialog";
import EditComponentDialog from "./EditComponentDialog";
import type { DiffItem } from "@/utils/deepDiff";

type ComponentItem = {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  key?: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
  _redlineStatus?: "added" | "removed" | "modified" | "unchanged";
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
};

type TableMeta = {
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  getFieldDiff?: (
    row: ComponentItem,
    field: string,
    value?: unknown,
  ) => DiffItem | null;
  getRowStatus?: (
    row: ComponentItem,
  ) => "added" | "removed" | "modified" | null;
};

const RedlineCell = ({
  value,
  diff,
  formatFn,
}: {
  value: unknown;
  diff: DiffItem | null;
  formatFn?: (v: unknown) => React.ReactNode;
}) => {
  const format =
    formatFn ||
    ((v: unknown) => (typeof v === "string" ? v : v != null ? String(v) : "-"));

  if (!diff) return <>{format(value)}</>;

  const isAdded = diff.status === "added";
  const isRemoved = diff.status === "removed";
  const isModified = diff.status === "modified";

  return (
    <div className="flex flex-col gap-0.5">
      {/* Old value - show for modified and removed */}
      {(isModified || isRemoved) && diff.old_value !== null && (
        <div className="line-through text-sm text-red-600/70">
          {format(diff.old_value)}
        </div>
      )}
      {/* New value - show for modified and added */}
      {(isModified || isAdded) && !isRemoved && (
        <div className="text-sm text-blue-700">{format(diff.new_value)}</div>
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
  column?: Column<ComponentItem, unknown>;
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

const columns: ColumnDef<ComponentItem>[] = [
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
              ? `Collapse details for ${row.original.component_number}`
              : `Expand details for ${row.original.component_number}`,
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
    accessorKey: "image",
    header: ({ column }) => (
      <SortableHeader title="Image" icon={PiImageDuotone} />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(row.original, "image", row.original.image)
        : null;
      const newImageUrl =
        diff?.status === "added" && typeof diff.new_value === "string"
          ? diff.new_value
          : "";
      const removedImageUrl =
        diff?.status === "removed" && typeof diff.old_value === "string"
          ? diff.old_value
          : "";

      // For image, show both old and new if changed
      if (diff && diff.status === "added" && newImageUrl) {
        return (
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-blue-600 font-medium">NEW</span>
            <Image
              src={newImageUrl}
              alt={row.original.component_number}
              width={48}
              height={48}
              className="object-cover rounded-md border border-blue-300 min-h-12"
            />
          </div>
        );
      }

      if (diff && diff.status === "removed" && removedImageUrl) {
        return (
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-red-600 font-medium">REMOVED</span>
            <Image
              src={removedImageUrl}
              alt={row.original.component_number}
              width={48}
              height={48}
              className="object-cover rounded-md border border-red-300 min-h-12 opacity-70"
            />
          </div>
        );
      }

      return row.original.image !== "" ? (
        <Image
          src={row.original.image}
          alt={row.original.component_number}
          width={48}
          height={48}
          className="object-cover rounded-md border min-h-12"
        />
      ) : (
        <div className="w-12 h-12 bg-muted text-muted-foreground/60 rounded-md ">
          <PiImageDuotone className="w-full h-full p-2" />
        </div>
      );
    },
    size: 80,
  },
  {
    accessorKey: "label_type",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader column={column} title="Label Type" icon={PiTagDuotone} />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const currentTypes = row.getValue("label_type") as string[];

      // Find all label_type diffs
      let addedTypes: string[] = [];
      let removedTypes: string[] = [];
      const rowStatus = row.original._redlineStatus;
      const rowDiffs = row.original._redlineDiffs ?? [];

      if (meta?.isRedlineView) {
        if (rowStatus === "added") {
          addedTypes = currentTypes;
        } else if (rowStatus === "removed") {
          removedTypes = currentTypes;
        } else if (rowDiffs.length > 0) {
          const rowLabelTypeDiffs = rowDiffs.filter((d) =>
            d.path.startsWith("label_type"),
          );

          addedTypes = rowLabelTypeDiffs
            .filter((d) => d.status === "added" && d.new_value)
            .map((d) => d.new_value as string);
          removedTypes = rowLabelTypeDiffs
            .filter((d) => d.status === "removed" && d.old_value)
            .map((d) => d.old_value as string);
        }
      }

      // Merge current types with added types (for redline view)
      // Added types might not exist in current V1 data
      const displayTypes = meta?.isRedlineView
        ? [
            ...currentTypes,
            ...addedTypes.filter((t) => !currentTypes.includes(t)),
            ...removedTypes.filter((t) => !currentTypes.includes(t)),
          ]
        : currentTypes;

      return (
        <div className="flex flex-wrap gap-1">
          {displayTypes && displayTypes.length > 0 ? (
            displayTypes.map((type, index) => {
              // Check if this specific type value was added
              const isNewlyAdded = addedTypes.includes(type);
              const isRemoved = removedTypes.includes(type);
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
                  {type}
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
    accessorKey: "component_number",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Component #"
        icon={PiHashDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "component_number",
            row.getValue("component_number"),
          )
        : null;

      return (
        <div>
          {diff ? (
            <RedlineCell
              value={row.getValue("component_number")}
              diff={diff}
              formatFn={(v) => (
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {typeof v === "string" ? v : String(v ?? "")}
                </span>
              )}
            />
          ) : (
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {row.getValue("component_number")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "component_description",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Description"
        icon={PiTextAlignLeftDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "component_description",
            row.getValue("component_description"),
          )
        : null;

      return (
        <div className="max-w-xs text-sm text-muted-foreground">
          {diff ? (
            <RedlineCell
              value={row.getValue("component_description")}
              diff={diff}
            />
          ) : (
            <span className="whitespace-pre-line">
              {row.getValue("component_description")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dimensions",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Dimensions"
        icon={PiRulerDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "dimensions",
            row.getValue("dimensions"),
          )
        : null;

      return (
        <div className="text-sm">
          {diff ? (
            <RedlineCell value={row.getValue("dimensions")} diff={diff} />
          ) : (
            row.getValue("dimensions") || "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "component_type",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Component Type"
        icon={PiCirclesFourDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const diff = meta?.isRedlineView
        ? meta.getFieldDiff?.(
            row.original,
            "component_type",
            row.getValue("component_type"),
          )
        : null;

      return (
        <div className="text-sm">
          {diff ? (
            <RedlineCell value={row.getValue("component_type")} diff={diff} />
          ) : (
            row.getValue("component_type") || "-"
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

export default function ProductComponentDetailsTable({
  data,
  isSubmitted = false,
  isRedlineView = false,
}: {
  data: ComponentItem[];
  isSubmitted?: boolean;
  isRedlineView?: boolean;
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "component_number",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const getRowStatus = (row: ComponentItem) => {
    if (!isRedlineView) return null;
    const status = row._redlineStatus;
    if (!status || status === "unchanged") return null;
    return status === "modified" ? "modified" : status;
  };

  const getFieldDiff = (
    row: ComponentItem,
    field: string,
    value?: unknown,
  ): DiffItem | null => {
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
    data,
    columns,
    getRowCanExpand: (row) => Boolean(row.original.component_description),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    defaultColumn: { filterFn: advancedFilterFn<ComponentItem>() },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, pagination, columnFilters, columnVisibility },
    meta: { isSubmitted, isRedlineView, getFieldDiff, getRowStatus },
  });

  return (
    <div className="space-y-2 w-full p-2">
      <TableControls
        table={table}
        searchColumnId="component_number"
        searchPlaceholder="Filter components..."
        filterColumns={[
          { name: "component_number", label: "Component #", type: "text" },
          {
            name: "component_description",
            label: "Description",
            type: "text",
          },
          { name: "label_type", label: "Label Type", type: "text" },
          { name: "dimensions", label: "Dimensions", type: "text" },
          { name: "component_type", label: "Component Type", type: "text" },
        ]}
      />
      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="">
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
          <TableBody>
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
                        isAdded ? "bg-blue-50/30 " : ""
                      } ${isRemoved ? "bg-red-50/30" : ""} ${
                        isModified ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {row.getVisibleCells().map((cell, cellIdx) => (
                        <TableCell
                          key={cell.id}
                          className="last:py-0 [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
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

                    {row.getIsExpanded() &&
                      (() => {
                        // Check if image was added in redline view
                        const imageDiff = isRedlineView
                          ? getFieldDiff(
                              row.original,
                              "image",
                              row.original.image,
                            )
                          : null;
                        const addedImageUrl =
                          imageDiff?.status === "added" &&
                          typeof imageDiff.new_value === "string"
                            ? imageDiff.new_value
                            : null;

                        // Use current image or added image
                        const displayImage =
                          row.original.image || addedImageUrl;

                        return (
                          <TableRow>
                            <TableCell colSpan={row.getVisibleCells().length}>
                              <div className="flex flex-col items-center py-2">
                                {displayImage ? (
                                  <div className="relative">
                                    <Image
                                      src={displayImage}
                                      alt={row.original.component_number}
                                      width={200}
                                      height={200}
                                      className={`rounded mb-3 ${
                                        addedImageUrl && !row.original.image
                                          ? "border-2 border-blue-400"
                                          : ""
                                      }`}
                                      style={{
                                        width: "70%",
                                        height: "auto",
                                        maxWidth: 280,
                                      }}
                                      priority={true}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-50 h-50 bg-muted text-muted-foreground/60 rounded-md ">
                                    <PiImageDuotone className="w-full h-full p-2" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })()}
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
  );
}

function RowActions({
  row,
  isSubmitted = false,
}: {
  row: Row<ComponentItem>;
  isSubmitted?: boolean;
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
            disabled={isSubmitted}
          >
            <PiDotsThreeCircleDuotone size={18} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                setTimeout(() => setShowEditDialog(true), 100);
              }}
            >
              <PiPencilSimpleDuotone className=" h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
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

      <EditComponentDialog
        productId={getProductId()}
        component={row.original}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteComponentDialog
        productId={getProductId()}
        component={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
