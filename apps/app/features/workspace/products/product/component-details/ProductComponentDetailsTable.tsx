"use client";

import { Badge } from "@uprevit/ui/components/ui/badge";
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
import { advancedFilterFn } from "@/lib/table-filters";
import DeleteComponentDialog from "./DeleteComponentDialog";
import EditComponentDialog from "./EditComponentDialog";
import type { DiffItem } from "@/utils/deepDiff";
import { ProductImageFrame } from "../ProductImageFrame";

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

const getPersistentComponentId = (item: ComponentItem): string =>
  item._redlineId ||
  item._id ||
  `${item.component_number}-${item.component_type}`;

const RedlineCell = ({
  value,
  diff,
  formatFn,
}: {
  value: unknown;
  diff: DiffItem | null;
  formatFn?: (v: unknown, state?: "old" | "new" | "current") => React.ReactNode;
}) => {
  const format =
    formatFn ||
    ((v: unknown, state = "current") => (
      <span className={state === "old" ? "line-through" : undefined}>
        {typeof v === "string" ? v : v != null ? String(v) : "-"}
      </span>
    ));

  if (!diff) return <>{format(value, "current")}</>;

  const isAdded = diff.status === "added";
  const isRemoved = diff.status === "removed";
  const isModified = diff.status === "modified";

  return (
    <div className="flex flex-col gap-0.5">
      {/* Old value - show for modified and removed */}
      {(isModified || isRemoved) && diff.old_value !== null && (
        <div className="text-sm text-red-600/70">
          {format(diff.old_value, "old")}
        </div>
      )}
      {/* New value - show for modified and added */}
      {(isModified || isAdded) && !isRemoved && (
        <div className="text-sm text-blue-700">
          {format(diff.new_value, "new")}
        </div>
      )}
    </div>
  );
};

const getUniqueStrings = (values: string[]) => [...new Set(values)];

const getArrayValueChanges = (diffs: DiffItem[], fieldPath: string) => {
  const added: string[] = [];
  const removed: string[] = [];

  diffs.forEach((diff) => {
    if (!diff.path.startsWith(fieldPath)) return;

    if (diff.status === "added" && diff.new_value != null) {
      added.push(String(diff.new_value));
    }

    if (diff.status === "removed" && diff.old_value != null) {
      removed.push(String(diff.old_value));
    }

    if (diff.status === "modified") {
      if (diff.old_value != null) {
        removed.push(String(diff.old_value));
      }
      if (diff.new_value != null) {
        added.push(String(diff.new_value));
      }
    }
  });

  return {
    added: getUniqueStrings(added),
    removed: getUniqueStrings(removed),
  };
};

const getRedlineImagePresentation = (row: ComponentItem, meta?: TableMeta) => {
  const image = typeof row.image === "string" ? row.image.trim() : "";
  const rowStatus = meta?.getRowStatus?.(row);
  const diff = meta?.isRedlineView
    ? meta.getFieldDiff?.(row, "image", row.image)
    : null;
  const oldImage =
    typeof diff?.old_value === "string" ? diff.old_value.trim() : "";
  const newImage =
    typeof diff?.new_value === "string" ? diff.new_value.trim() : "";

  if (rowStatus === "added") {
    const addedImage = image || newImage;
    return {
      src: addedImage,
      badge: "NEW" as const,
      frameClassName: "border-blue-300",
      imageClassName: undefined,
      diff,
    };
  }

  if (rowStatus === "removed") {
    const removedImage = image || oldImage;
    return {
      src: removedImage,
      badge: "DEL" as const,
      frameClassName: "border-red-300",
      imageClassName: "opacity-70",
      diff,
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
      diff,
    };
  }

  if (!image) {
    return {
      src: "",
      badge: null as "NEW" | "DEL" | "MOD" | null,
      frameClassName: undefined as string | undefined,
      imageClassName: undefined as string | undefined,
      diff,
    };
  }

  return {
    src: image,
    badge: null as "NEW" | "DEL" | "MOD" | null,
    frameClassName: undefined,
    imageClassName: undefined,
    diff,
  };
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
              alt={row.original.component_number}
              frameClassName={imagePresentation.frameClassName}
              imageClassName={imagePresentation.imageClassName}
            />
          </div>
        );
      }

      return imagePresentation.src ? (
        <ProductImageFrame
          src={imagePresentation.src}
          alt={row.original.component_number}
        />
      ) : (
        <ProductImageFrame alt={row.original.component_number} />
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
          const changes = getArrayValueChanges(rowDiffs, "label_type");
          addedTypes = changes.added;
          removedTypes = changes.removed;
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
              formatFn={(v, state = "current") => (
                <span
                  className={`inline-flex items-center rounded px-2 py-1 font-mono text-xs ${
                    state === "old"
                      ? "bg-red-50 text-red-700 line-through decoration-1"
                      : state === "new"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-muted"
                  }`}
                >
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
    getRowId: (originalRow) => getPersistentComponentId(originalRow),
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
    <div className="flex flex-1 min-h-0 w-full flex-col gap-2 p-2">
      <div className="shrink-0">
        <TableControls
          table={table}
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
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-background">
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
          <TableBody className="[&_tr:last-child]:border-b">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowStatus = getRowStatus(row.original);
                const isAdded = isRedlineView && rowStatus === "added";
                const isRemoved = isRedlineView && rowStatus === "removed";
                const isModified = isRedlineView && rowStatus === "modified";
                const componentId = getPersistentComponentId(row.original);

                return (
                  <Fragment key={componentId}>
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
                        const imagePresentation = getRedlineImagePresentation(
                          row.original,
                          table.options.meta as TableMeta | undefined,
                        );

                        return (
                          <TableRow>
                            <TableCell colSpan={row.getVisibleCells().length}>
                              <div className="flex flex-col items-center py-2">
                                {imagePresentation.src ? (
                                  <ProductImageFrame
                                    src={imagePresentation.src}
                                    alt={row.original.component_number}
                                    variant="preview"
                                    frameClassName={
                                      imagePresentation.frameClassName
                                    }
                                    imageClassName={
                                      imagePresentation.imageClassName
                                    }
                                    // badge={
                                    //   imagePresentation.badge ? (
                                    //     <span
                                    //       className={`absolute -top-1 -left-1 z-65 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider shadow-sm ${
                                    //         imagePresentation.badge === "NEW"
                                    //           ? "border border-blue-200 bg-blue-100 text-blue-700"
                                    //           : imagePresentation.badge ===
                                    //               "DEL"
                                    //             ? "border border-red-200 bg-red-100 text-red-700"
                                    //             : "border border-amber-200 bg-amber-100 text-amber-700"
                                    //       }`}
                                    //     >
                                    //       {imagePresentation.badge}
                                    //     </span>
                                    //   ) : undefined
                                    // }
                                    priority
                                  />
                                ) : (
                                  <ProductImageFrame
                                    alt={row.original.component_number}
                                    variant="preview"
                                  />
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
      <div className="flex shrink-0 items-center justify-between gap-8">
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
  const componentId = getPersistentComponentId(row.original);
  const actionsDisabled =
    isSubmitted || row.original._redlineStatus === "removed";

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
              <PiPencilSimpleDuotone className=" h-4 w-4" />
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

      <EditComponentDialog
        key={`edit-${componentId}`}
        productId={getProductId()}
        component={row.original}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteComponentDialog
        key={`delete-${componentId}`}
        productId={getProductId()}
        component={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
