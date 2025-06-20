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
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EllipsisIcon,
} from "lucide-react";
import { Fragment, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";

type ComponentItem = {
  id: string;
  componentName: string;
  componentDescription: string;
  componentNumber: string;
  componentImage: string;
  note?: string;
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
              ? `Collapse details for ${row.original.componentName}`
              : `Expand details for ${row.original.componentName}`,
            size: "icon",
            variant: "ghost",
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUpIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
      ) : undefined;
    },
  },
  {
    header: "Image",
    accessorKey: "componentImage",
    cell: ({ row }) => (
      <Image
        src={row.original.componentImage}
        alt={row.original.componentName}
        width={50}
        height={50}
        className="object-cover rounded border"
      />
    ),
  },
  {
    header: "Component Name",
    accessorKey: "componentName",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("componentName")}</div>
    ),
  },
  {
    header: "Component #",
    accessorKey: "componentNumber",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
        {row.getValue("componentNumber")}
      </span>
    ),
  },
  {
    header: "Description",
    accessorKey: "componentDescription",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="max-w-xs whitespace-pre-line text-sm text-muted-foreground">
        {row.getValue("componentDescription")}
      </div>
    ),
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 80,
    enableHiding: false,
  },
];

export default function ProductComponentDetailsTable() {
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
  const [data] = useState<ComponentItem[]>([
    {
      id: "1",
      componentName: "Hydraulic Pump",
      componentDescription:
        "High-pressure hydraulic pump for industrial machinery.",
      componentNumber: "HP-1001",
      componentImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
      note: "This pump is suitable for continuous operation in harsh environments.",
    },
    {
      id: "2",
      componentName: "Control Valve",
      componentDescription: "Precision control valve for fluid regulation.",
      componentNumber: "CV-2020",
      componentImage:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      note: "Ensure regular maintenance for optimal performance.",
    },
    {
      id: "3",
      componentName: "Pressure Sensor",
      componentDescription: "Digital sensor for accurate pressure measurement.",
      componentNumber: "PS-3303",
      componentImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80",
      note: "Calibrate annually for best results.",
    },
    {
      id: "4",
      componentName: "Gearbox",
      componentDescription: "Heavy-duty gearbox for torque transmission.",
      componentNumber: "GB-4404",
      componentImage:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=200&q=80",
      note: "Lubricate every 6 months.",
    },
    {
      id: "5",
      componentName: "Cooling Fan",
      componentDescription: "Efficient cooling fan with low noise.",
      componentNumber: "CF-5505",
      componentImage:
        "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=200&q=80",
      note: "Replace blades if vibration detected.",
    },
    {
      id: "6",
      componentName: "Relay Switch",
      componentDescription: "High-current relay switch for safety circuits.",
      componentNumber: "RS-6606",
      componentImage:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
      note: "Test before each production cycle.",
    },
    {
      id: "7",
      componentName: "Display Module",
      componentDescription: "LCD display module for real-time data.",
      componentNumber: "DM-7707",
      componentImage:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=200&q=80",
      note: "Protect from direct sunlight.",
    },
    {
      id: "8",
      componentName: "Power Supply",
      componentDescription: "Stable power supply for sensitive electronics.",
      componentNumber: "PS-8808",
      componentImage:
        "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=200&q=80",
      note: "Check voltage before connecting devices.",
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: (row) => Boolean(row.original.note),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  });

  return (
    <div className="space-y-4">
      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-muted/60" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : undefined
                      }
                      aria-sort={
                        header.column.getIsSorted() === false
                          ? undefined
                          : header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : "descending"
                      }
                      onClick={header.column.getToggleSortingHandler?.()}
                      onKeyDown={
                        header.column.getCanSort()
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                header.column.toggleSorting();
                              }
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUpIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDownIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ) : (
                                <ChevronUpIcon
                                  className="shrink-0 opacity-10"
                                  size={16}
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          )}
                        </span>
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
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
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
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
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
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: Row<ComponentItem> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2" asChild>
        <div className="flex justify-end ">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit - {row.original.id}</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archive</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Move to project</DropdownMenuItem>
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced options</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Add to favorites</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
