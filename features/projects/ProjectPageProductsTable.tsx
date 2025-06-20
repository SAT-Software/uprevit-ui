"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

// Re-using the Item type definition (ensure it matches product structure)
export type Item = {
  productId: string;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
  productName: string;
  projectId: string; // Needed for filtering, but not displayed
  departmentId: string; // Needed for context, but not displayed
  version: string;
  status: "Submitted" | "Draft" | "Archived";
  targetDate: number;
  completionDate: number | null;
  delayReason: string | null;
};

const columns: ColumnDef<Item>[] = [
  {
    header: "Product Id",
    accessorKey: "productId",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("productId")}</div>
    ),
  },
  {
    header: "Created by - on",
    accessorKey: "createdOn",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      const createdOn = row.original.createdOn;
      return (
        <div className="">
          <p className="text-xs font-medium">{createdBy}</p>
          <p className="text-xs text-muted-foreground">{createdOn}</p>
        </div>
      );
    },
  },
  {
    header: "Modified by - on",
    accessorKey: "modifiedOn",
    cell: ({ row }) => {
      const modifiedBy = row.original.modifiedBy;
      const modifiedOn = row.original.modifiedOn;
      return (
        <div className="">
          <p className="text-xs font-medium">{modifiedBy}</p>
          <p className="text-xs text-muted-foreground">{modifiedOn}</p>
        </div>
      );
    },
  },
  {
    header: "Product Name",
    accessorKey: "productName",
    cell: ({ row }) => {
      return <p className="text-xs">{row.getValue("productName")}</p>;
    },
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("version")}</div>
    ),
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
  },
];

export default function ProjectPageProductsTable({ data }: { data: Item[] }) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-input rounded-lg mt-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  router.push(
                    `/products/${row.original.productId}/product-information`
                  )
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No products associated with this project yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
