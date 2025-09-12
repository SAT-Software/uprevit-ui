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
  ArchiveIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Columns3Icon,
  EllipsisIcon,
  ExternalLinkIcon,
  Share2Icon,
  StarIcon,
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
import DialogDuplicateProduct from "./DialogDuplicateProduct";
import DialogShareProduct from "./DialogShareProduct";
import FilterBuilder from "./tableFilter";
import UpdateProductDialog from "./UpdateProductDialog";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";

// Define the type for the table data
export type Item = {
  _id: string;
  productId?: string;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  master_version: string;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: string;
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
    header: "ID",
    accessorKey: "_id",
    cell: ({ row }) => {
      const id = row.getValue("_id") as string;
      const truncatedId = id?.length > 7 ? `${id.slice(0, 7)}...` : id;
      return (
        <div className="text-xs font-medium" title={id}>
          {truncatedId}
        </div>
      );
    },
    size: 120,
    maxSize: 150,
  },
  {
    header: "Action By-At",
    accessorKey: "action_by",
    cell: ({ row }) => {
      const actionBy = row.original.action_by;
      const actionAt = row.original.action_at;
      const truncatedActionBy =
        actionBy?.length > 6 ? `${actionBy.slice(0, 6)}...` : actionBy;
      return (
        <div className="">
          <p className="text-xs font-medium" title={actionBy}>
            {truncatedActionBy}
          </p>
          <p className="text-xs text-muted-foreground">
            {actionAt?.slice(0, 10)}
          </p>
        </div>
      );
    },
    size: 120,
  },
  {
    header: "Product Name",
    accessorKey: "product_name",
    cell: ({ row }) => {
      return <p className="text-xs">{row.getValue("product_name")}</p>;
    },
    size: 200,
  },
  {
    header: "Plan Number",
    accessorKey: "product_plan_number",
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        {row.getValue("product_plan_number")}
      </div>
    ),
    size: 120,
  },
  {
    header: "Project ID",
    accessorKey: "project_id",
    cell: ({ row }) => {
      const projectId = row.getValue("project_id") as string;
      const truncatedProjectId =
        projectId?.length > 6 ? `${projectId.slice(0, 6)}...` : projectId;
      return (
        <div className="text-xs font-medium" title={projectId}>
          {truncatedProjectId}
        </div>
      );
    },
    size: 120,
  },
  {
    header: "Department ID",
    accessorKey: "department_id",
    cell: ({ row }) => {
      const departmentId = row.getValue("department_id") as string;
      const truncatedDepartmentId =
        departmentId?.length > 6
          ? `${departmentId.slice(0, 6)}...`
          : departmentId;
      return (
        <div className="text-xs font-medium" title={departmentId}>
          {truncatedDepartmentId}
        </div>
      );
    },
    size: 120,
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
    id: "edit",
    header: () => <span className="sr-only">Edit</span>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <UpdateProductDialog product={row.original} />
      </div>
    ),
    size: 30,
    enableHiding: false,
  },
  {
    id: "duplicate",
    header: () => <span className="sr-only">Duplicate</span>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DialogDuplicateProduct product={row.original} />
      </div>
    ),
    size: 30,
    enableHiding: false,
  },
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
  // const router = useRouter();
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

  console.log(data?.result.products);

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
                  // onClick={() => {
                  //   router.push(
                  //     `/products/${row.original._id}/product-information`
                  //   );
                  // }}
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

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${row.original._id}/product-information`);
  };

  return (
    <div className="flex items-center justify-end gap-2">
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
            <DropdownMenuItem onClick={handleOpen}>
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              <span>Open</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowArchiveDialog(true), 100);
              }}
            >
              <ArchiveIcon className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowShareDialog(true), 100);
              }}
            >
              <Share2Icon className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowBookmarkDialog(true), 100);
              }}
            >
              <StarIcon className="mr-2 h-4 w-4" />
              <span>Add to Bookmarks</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs outside dropdown */}
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
