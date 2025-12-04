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
import {
  PiBuildingsDuotone,
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiChartPieSliceDuotone,
  PiColumnsDuotone,
  PiGitBranchDuotone,
  PiHashDuotone,
  PiInfoDuotone,
  PiKanbanDuotone,
  PiPackageDuotone,
} from "react-icons/pi";
import { Progress } from "@/components/ui/progress";

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

// Helper component for sortable headers
const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: any;
  title: string;
  icon: any;
}) => {
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
    accessorKey: "product_plan_number",
    header: ({ column }) => (
      <SortableHeader column={column} title="PPN" icon={PiHashDuotone} />
    ),
    cell: ({ row }) => {
      const ppn = row.getValue("product_plan_number");
      return <div className="text-xs font-medium">{ppn as string}</div>;
    },
    size: 120,
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Product Name"
        icon={PiPackageDuotone}
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-xs font-medium">{row.getValue("product_name")}</p>
      );
    },
    size: 200,
  },
  {
    accessorKey: "project_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Project Name"
        icon={PiKanbanDuotone}
      />
    ),
    cell: ({ row }) => {
      const project_name = row.original?.project?.[0]?.project_name;
      return <div className="text-xs font-medium">{project_name}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "department_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Department Name"
        icon={PiBuildingsDuotone}
      />
    ),
    cell: ({ row }) => {
      const departmentName = row.original?.department?.[0]?.department_name;
      return <div className="text-xs font-medium">{departmentName}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column} title="Status" icon={PiInfoDuotone} />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        <div
          className={cn("w-2 h-2 rounded-full mr-1", {
            "bg-green-500": row.original?.status === "submitted",
            "bg-blue-500": row.original?.status === "draft",
            "bg-gray-500": row.original?.status === "archived",
          })}
        />
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: "master_version",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Version"
        icon={PiGitBranchDuotone}
      />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        v{row.getValue("master_version")}
      </Badge>
    ),
    size: 80,
  },
  {
    accessorKey: "complete_count",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Progress"
        icon={PiChartPieSliceDuotone}
      />
    ),
    cell: ({ row }) => {
      const progress = (row.getValue("complete_count") as number) || 0;
      return (
        <div className="flex items-center gap-3 min-w-[120px]">
          <Progress value={progress} className="h-2 w-full" />
          <span className="text-xs font-medium text-muted-foreground w-9 text-right">
            {progress}%
          </span>
        </div>
      );
    },
    size: 120,
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <PiColumnsDuotone />
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
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
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
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
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
              <PiPencilCircleDuotone className=" h-4 w-4" />
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
              <PiArchiveDuotone className=" h-4 w-4" />
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
              <PiShareDuotone className=" h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              onSelect={() => {
                // Add small delay to allow dropdown to close first
                setTimeout(() => setShowBookmarkDialog(true), 100);
              }}
            >
              <PiBookmarkDuotone className=" h-4 w-4" />
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
