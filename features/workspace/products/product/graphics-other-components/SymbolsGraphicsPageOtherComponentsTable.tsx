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

import { Badge } from "@/components/ui/badge";
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
import Image from "next/image";
import TableControls from "@/components/table/TableControls";
import { advancedFilterFn } from "@/lib/table-filters";
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
  PiCubeDuotone,
} from "react-icons/pi";
import EditOtherComponentsDialog from "./EditOtherComponentsDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";
import type { DiffItem } from "@/utils/deepDiff";

type Item = {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  note?: string;
  presentOnLabels: string[];
  _isFromDiff?: boolean;
  _isRemovedFromDiff?: boolean;
  _originalIndex?: number;
};

type TableMeta = {
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  diffs?: DiffItem[];
  getDiff?: (path: string) => DiffItem | null;
  getRowStatus?: (
    rowIndex: number,
    originalIndex: number
  ) => "added" | "removed" | "modified" | null;
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
    ((v: unknown) =>
      typeof v === "string" ? v : v != null ? String(v) : "-");
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
        <Image
          src={image}
          alt={row.original.componentName}
          width={48}
          height={48}
          className="object-cover rounded-md border min-h-12"
        />
      ) : (
        <div className="w-12 h-12 bg-muted text-muted-foreground/60 rounded-md">
          <PiImageDuotone className="w-full h-full p-2" />
        </div>
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
        title="Component Name"
        icon={PiCubeDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const originalIndex = row.original._originalIndex ?? row.index;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(`symbols_graphics.data[${originalIndex}].text`)
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
        title="Description"
        icon={PiTextAlignLeftDuotone}
      />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const originalIndex = row.original._originalIndex ?? row.index;
      const diff = meta?.isRedlineView
        ? meta.getDiff?.(`symbols_graphics.data[${originalIndex}].description`)
        : null;
      return diff ? (
        <RedlineCell
          value={row.getValue("componentDescription")}
          diff={diff}
          formatFn={(v) => (
            <div className="max-w-xs whitespace-pre-line text-sm text-muted-foreground">
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
      const originalIndex = row.original._originalIndex ?? row.index;

      // Check for added and removed label presence values
      let addedLabels: string[] = [];
      let removedLabels: string[] = [];
      if (meta?.isRedlineView && meta.diffs) {
        const labelDiffs = (meta.diffs as DiffItem[]).filter((d) =>
          d.path.startsWith(
            `symbols_graphics.data[${originalIndex}].label_presence`,
          ),
        );
        addedLabels = labelDiffs
          .filter((d) => d.status === "added" && d.new_value)
          .map((d) => d.new_value as string);
        removedLabels = labelDiffs
          .filter((d) => d.status === "removed" && d.old_value)
          .map((d) => d.old_value as string);
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

export default function SymbolsGraphicsPageOtherComponentsTable({
  data: dataProp,
  isSubmitted = false,
  isRedlineView = false,
  diffs = [],
}: {
  data?: Item[];
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  diffs?: DiffItem[];
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

  // Helper to find a diff by path
  const getDiff = (path: string): DiffItem | null => {
    return diffs.find((d) => d.path === path) || null;
  };

  // Check if a row has any changes (using original index for correct diff matching)
  const getRowStatus = (rowIndex: number, originalIndex: number) => {
    const isFromDiff = dataProp?.[rowIndex]?._isFromDiff;
    if (isFromDiff) return "added";

    const isRemovedFromDiff = dataProp?.[rowIndex]?._isRemovedFromDiff;
    if (isRemovedFromDiff) return "removed";

    const rowDiff = getDiff(`symbols_graphics.data[${originalIndex}]`);
    if (rowDiff) return rowDiff.status;

    const hasFieldDiff = diffs.some((d) =>
      d.path.startsWith(`symbols_graphics.data[${originalIndex}].`),
    );
    return hasFieldDiff ? "modified" : null;
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
    meta: { isSubmitted, isRedlineView, diffs, getDiff, getRowStatus },
  });

  return (
    <div className="space-y-2 mt-2 w-full">
      <TableControls
        table={table}
        searchColumnId="componentName"
        searchPlaceholder="Filter other components..."
        filterColumns={[
          { name: "componentName", label: "Component Name", type: "text" },
          {
            name: "componentDescription",
            label: "Description",
            type: "text",
          },
          {
            name: "presentOnLabels",
            label: "Presence on Labels",
            type: "array",
          },
        ]}
      />
      <div className="bg-background overflow-hidden rounded-xl border">
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const originalIndex = row.original._originalIndex ?? row.index;
                const rowStatus = getRowStatus(row.index, originalIndex);
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
                                typeof image === "string" && image.trim() !== "";
                              return hasImage ? (
                                <Image
                                  src={image}
                                  alt={row.original.componentName}
                                  width={200}
                                  height={200}
                                  className="rounded mb-3"
                                  style={{
                                    width: "70%",
                                    height: "auto",
                                    maxWidth: 280,
                                  }}
                                  priority
                                />
                              ) : (
                                <div className="w-50 h-50 bg-muted text-muted-foreground/60 rounded-md">
                                  <PiImageDuotone className="w-full h-full p-2" />
                                </div>
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
      <div className="flex items-center justify-end gap-8">
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

  const OtherComponentItem = {
    id: item.id,
    componentName: item.componentName,
    description: item.componentDescription,
    componentImage: item.componentImage,
    labelPresence: item.presentOnLabels,
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
      <EditOtherComponentsDialog
        productId={getProductId()}
        otherComponent={OtherComponentItem}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteSymbolsSchematicsDialog
        productId={getProductId()}
        graphics={OtherComponentItem}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
