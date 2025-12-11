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
import { Fragment, useId, useState } from "react";
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
  PiTextTDuotone,
} from "react-icons/pi";
import EditSchematicsDialog from "./EditSchematicsDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";

type Item = {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  presentOnLabels: string[];
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

const columns: ColumnDef<Item>[] = [
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
    cell: ({ row }) =>
      row.original.componentImage !== "" ? (
        <Image
          src={row.original.componentImage}
          alt={row.original.componentName}
          width={48}
          height={48}
          className="object-cover rounded-md border min-h-12"
        />
      ) : (
        <div className="w-12 h-12 bg-muted text-muted-foreground/60 rounded-md ">
          <PiImageDuotone className="w-full h-full p-2" />
        </div>
      ),
    size: 80,
  },
  {
    accessorKey: "componentName",
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Schematic Name"
        icon={PiTextTDuotone}
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("componentName")}</span>
    ),
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
    cell: ({ row }) => (
      <div className="max-w-xs whitespace-pre-line text-sm text-muted-foreground">
        {row.getValue("componentDescription") || "-"}
      </div>
    ),
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
    cell: ({ row }) => {
      const labels = row.getValue("presentOnLabels") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {labels && labels.length > 0 ? (
            labels.map((label, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))
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

type SymbolsGraphicsPageSchematicsTableProps = {
  data?: Item[];
  isSubmitted?: boolean;
};

export default function SymbolsGraphicsPageSchematicsTable({
  data: dataProp,
  isSubmitted = false,
}: SymbolsGraphicsPageSchematicsTableProps) {
  const id = useId();
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

  const table = useReactTable({
    data: dataProp || [],
    columns,
    getRowCanExpand: (row) => Boolean(row.original.componentName),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, pagination },
    meta: { isSubmitted },
  });

  return (
    <div className="space-y-4 w-full">
      <div className="bg-background overflow-hidden rounded-xl border">
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
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="last:py-0 whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="flex flex-col items-center py-4">
                          {row.original.componentImage !== "" ? (
                            <Image
                              src={row.original.componentImage}
                              alt={row.original.componentName}
                              width={200}
                              height={200}
                              className="rounded mb-3"
                              style={{
                                width: "70%",
                                height: "auto",
                                maxWidth: 280,
                              }}
                              priority={true}
                            />
                          ) : (
                            <div className="w-50 h-50 bg-muted text-muted-foreground/60 rounded-md ">
                              <PiImageDuotone className="w-full h-full p-2" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
      <div className="flex items-center justify-end gap-8">
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

  // Get productId from the current URL using usePathname
  const pathname = usePathname();
  const getProductId = (): string => {
    if (!pathname) return "";
    const match = pathname.match(/\/products\/([^\/]+)/);
    return match ? match[1] : "";
  };

  const schematicItem = {
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
              <PiPencilSimpleDuotone className="h-4 w-4" />
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

      <EditSchematicsDialog
        productId={getProductId()}
        schematic={schematicItem}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteSymbolsSchematicsDialog
        productId={getProductId()}
        graphics={schematicItem}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
