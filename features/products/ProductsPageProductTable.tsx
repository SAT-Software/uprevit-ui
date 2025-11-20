"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Columns3Icon,
  EllipsisIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { cn } from "@/lib/utils";
import DialogArchiveProduct from "./DialogArchiveProduct";
import DialogBookmarkProduct from "./DialogBookmarkProduct";
// import DialogDuplicateProduct from "./DialogDuplicateProduct";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import {
  PiArchiveDuotone,
  PiBookmarkDuotone,
  PiPencilCircleDuotone,
  PiShareDuotone,
} from "react-icons/pi";
import DialogShareProduct from "./DialogShareProduct";
import FilterBuilder from "./tableFilter";
import UpdateProductDialog from "./UpdateProductDialog";
import { AuditLog } from "@/types/product";

// Define the type for the table data
export type Item = {
  _id: string;
  productId?: string;
  description: string;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  master_version: string;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: string;
  product_information?: object;
  compliance_information?: object;
  label_components?: object;
  symbols_graphics?: object;
  product_data?: object;
  operational_parameters?: object;
  label_tags?: object;
  auditLogs?: Array<AuditLog>;
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

interface AdvancedFilter {
  operator: string;
  value: string | number | boolean;
}

// Advanced operator-based filter function
const advancedFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
  const { operator, value } = filterValue as AdvancedFilter;
  const rowValue = row.getValue(columnId);
  switch (operator) {
    case "eq":
      return rowValue == value;
    case "neq":
      return rowValue != value;
    case "contains":
      return String(rowValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "not_contains":
      return !String(rowValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "starts_with":
      return String(rowValue)
        .toLowerCase()
        .startsWith(String(value).toLowerCase());
    case "ends_with":
      return String(rowValue)
        .toLowerCase()
        .endsWith(String(value).toLowerCase());
    case "gt":
      return Number(rowValue) > Number(value);
    case "gte":
      return Number(rowValue) >= Number(value);
    case "lt":
      return Number(rowValue) < Number(value);
    case "lte":
      return Number(rowValue) <= Number(value);
    case "is_null":
      return rowValue == null || rowValue === "";
    case "is_not_null":
      return rowValue != null && rowValue !== "";
    default:
      return true;
  }
};

const columns: ColumnDef<Item>[] = [
  {
    header: "PPN",
    accessorKey: "product_plan_number",
    cell: ({ row }) => {
      const ppn = row.getValue("product_plan_number");
      return <div className="text-xs font-medium">{ppn as string}</div>;
    },
    size: 120,
  },
  {
    header: "Product Name",
    accessorKey: "product_name",
    cell: ({ row }) => {
      return (
        <p className="text-xs font-medium">{row.getValue("product_name")}</p>
      );
    },
    size: 200,
  },
  {
    header: "Project Name",
    accessorKey: "project_name",
    cell: ({ row }) => {
      const project_name = row.original?.project?.[0]?.project_name;
      return <div className="text-xs font-medium">{project_name}</div>;
    },
    size: 150,
  },
  {
    header: "Department Name",
    accessorKey: "department_name",
    cell: ({ row }) => {
      const departmentName = row.original?.department?.[0]?.department_name;
      return <div className="text-xs font-medium">{departmentName}</div>;
    },
    size: 150,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "Archived" &&
            "bg-muted-foreground/60 text-primary-foreground",
          row.getValue("status") === "Submitted" &&
            "bg-secondary text-primary-foreground",
          row.getValue("status") === "Draft" &&
            "bg-primary text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
  },
  {
    header: "Version",
    accessorKey: "master_version",
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        {row.getValue("master_version")}
      </div>
    ),
    size: 80,
  },
  {
    header: "Progress",
    accessorKey: "complete_count",
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        {row.getValue("complete_count")} %
      </div>
    ),
    size: 80,
  },
  // {
  //   header: "Created by - on",
  //   accessorKey: "createdOn",
  //   cell: ({ row }) => {
  //     const createdBy = row.original.auditLogs?.filter(
  //       (log) => log.action === "create"
  //     )[0]?.actionBy;
  //     const createdAt = row.original.auditLogs?.filter(
  //       (log) => log.action === "create"
  //     )[0]?.actionAt;
  //     return (
  //       <div className="">
  //         <p className="text-xs font-medium">{createdBy}</p>
  //         <p className="text-xs text-muted-foreground">
  //           {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
  //         </p>
  //       </div>
  //     );
  //   },
  //   size: 150,
  // },
  // {
  //   header: "Modified by - on",
  //   accessorKey: "modifiedOn",
  //   cell: ({ row }) => {
  //     const modifiedBy = row.original.auditLogs?.filter(
  //       (log) => log.action === "update"
  //     )[0]?.actionBy;
  //     const modifiedAt = row.original.auditLogs?.filter(
  //       (log) => log.action === "update"
  //     )[0]?.actionAt;
  //     return (
  //       <div className="">
  //         <p className="text-xs font-medium">{modifiedBy}</p>
  //         <p className="text-xs text-muted-foreground">
  //           {modifiedAt ? new Date(modifiedAt).toLocaleDateString() : "N/A"}
  //         </p>
  //       </div>
  //     );
  //   },
  //   size: 150,
  // },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 40,
    enableHiding: false,
  },
];

export default function ProductsPageProductTable() {
  const id = useId();
  const router = useRouter();
  const { data } = useGetAllProducts();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "_id",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: data?.result.products ?? [],
    columns,
    defaultColumn: { filterFn: advancedFilterFn },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center justify-start w-full gap-3">
          <FilterBuilder table={table} />

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Columns3Icon
                  className="-ms-1 text-muted-foreground"
                  size={14}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11 "
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex text-xs h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/products/${row.original._id}/product-information`
                    );
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
    // </div>
  );
}

function RowActions({ row }: { row: { original: Item } }) {
  const router = useRouter();
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${row.original._id}/product-information`);
  };

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* <UpdateProductDialog product={row.original} /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="More actions"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowUpdateDialog(true), 100);
              }}
            >
              <PiPencilCircleDuotone className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowArchiveDialog(true), 100);
              }}
            >
              <PiArchiveDuotone className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowShareDialog(true), 100);
              }}
            >
              <PiShareDuotone className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowBookmarkDialog(true), 100);
              }}
            >
              <PiBookmarkDuotone className="mr-2 h-4 w-4" />
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
    </div>
  );
}
