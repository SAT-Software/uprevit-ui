"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
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
  PiLayoutDuotone,
  PiPencilSimpleDuotone,
  PiRulerDuotone,
  PiTagDuotone,
  PiTextAlignLeftDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Fragment, useId, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import EditComponentDialog from "./EditComponentDialog";
import DeleteComponentDialog from "./DeleteComponentDialog";

type ComponentItem = {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
  _isFromDiff?: boolean;
};

// Type for diff data
type DiffItem = {
  path: string;
  status: "added" | "removed" | "modified";
  old_value: any;
  new_value: any;
};

// Helper component for displaying redline values (vertical stacking)
const RedlineCell = ({
  value,
  diff,
  formatFn,
}: {
  value: any;
  diff: DiffItem | null;
  formatFn?: (v: any) => React.ReactNode;
}) => {
  const format = formatFn || ((v: any) => v?.toString() || "-");

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
  column?: any;
  title: string;
  icon: any;
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
      const meta = table.options.meta as any;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(`label_components.data[${row.index}].image`)
        : null;

      // For image, show both old and new if changed
      if (diff && diff.status === "added" && diff.new_value) {
        return (
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-blue-600 font-medium">NEW</span>
            <Image
              src={diff.new_value}
              alt={row.original.component_number}
              width={48}
              height={48}
              className="object-cover rounded-md border border-blue-300 min-h-12"
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
      const meta = table.options.meta as any;
      const currentTypes = row.getValue("label_type") as string[];

      // Find all label_type diffs
      let addedTypes: string[] = [];

      if (meta?.isRedlineView && meta.diffs) {
        // Find diffs for label_type additions for THIS row (data[row.index])
        const rowLabelTypeDiffs = (meta.diffs as DiffItem[]).filter((d) =>
          d.path.startsWith(`label_components.data[${row.index}].label_type`)
        );

        // Get all newly added label type values for this row
        addedTypes = rowLabelTypeDiffs
          .filter((d) => d.status === "added" && d.new_value)
          .map((d) => d.new_value as string);
      }

      // Merge current types with added types (for redline view)
      // Added types might not exist in current V1 data
      const displayTypes = meta?.isRedlineView
        ? [
            ...currentTypes,
            ...addedTypes.filter((t) => !currentTypes.includes(t)),
          ]
        : currentTypes;

      return (
        <div className="flex flex-wrap gap-1">
          {displayTypes && displayTypes.length > 0 ? (
            displayTypes.map((type, index) => {
              // Check if this specific type value was added
              const isNewlyAdded = addedTypes.includes(type);
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${
                    isNewlyAdded
                      ? "border-blue-400 text-blue-700 bg-blue-50"
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
      const meta = table.options.meta as any;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(`label_components.data[${row.index}].component_number`)
        : null;

      return (
        <div>
          {diff ? (
            <RedlineCell
              value={row.getValue("component_number")}
              diff={diff}
              formatFn={(v) => (
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {v}
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
      const meta = table.options.meta as any;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(
            `label_components.data[${row.index}].component_description`
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
      const meta = table.options.meta as any;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(`label_components.data[${row.index}].dimensions`)
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
      const meta = table.options.meta as any;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(`label_components.data[${row.index}].component_type`)
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
  diffs = [],
}: {
  data: ComponentItem[];
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  diffs?: DiffItem[];
}) {
  const id = useId();
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

  // Helper to find a diff by path
  const getDiff = (path: string): DiffItem | null => {
    return diffs.find((d) => d.path === path) || null;
  };

  // Check if a row has any changes
  const getRowStatus = (rowIndex: number) => {
    const isFromDiff = data[rowIndex]?._isFromDiff;
    if (isFromDiff) return "added";

    // Check for whole-row addition/removal
    const rowDiff = getDiff(`label_components.data[${rowIndex}]`);
    if (rowDiff) return rowDiff.status;

    // Check for any field-level changes
    const hasFieldDiff = diffs.some((d) =>
      d.path.startsWith(`label_components.data[${rowIndex}].`)
    );
    return hasFieldDiff ? "modified" : null;
  };

  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: (row) => Boolean(row.original.component_description),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, pagination },
    meta: { isSubmitted, isRedlineView, diffs, getDiff, getRowStatus },
  });

  return (
    <div className="space-y-2 w-full p-2">
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
              table.getRowModel().rows.map((row) => {
                const rowStatus = getRowStatus(row.index);
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
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    {row.getIsExpanded() &&
                      (() => {
                        // Check if image was added in redline view
                        const imageDiff = isRedlineView
                          ? getDiff(`label_components.data[${row.index}].image`)
                          : null;
                        const addedImageUrl =
                          imageDiff?.status === "added"
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
                  0
                ),
                table.getRowCount()
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
