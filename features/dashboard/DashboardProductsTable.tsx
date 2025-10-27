"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

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

const columns: ColumnDef<Item>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
  {
    header: "Product Id",
    accessorKey: "productId",
    cell: ({ row }) => (
      <div className="text-xs  font-medium">{row.getValue("productId")}</div>
    ),
  },
  {
    header: "Created by - on",
    accessorKey: "createdOn",
    cell: ({ row }) => {
      const createdBy = row.original.action_by;
      const createdOn = row.original.action_at;
      return (
        <div className="">
          <p className="text-xs  font-medium">{createdBy}</p>
          <p className="text-xs text-muted-foreground">{createdOn}</p>
        </div>
      );
    },
  },
  {
    header: "Modified by - on",
    accessorKey: "modifiedOn",
    cell: ({ row }) => {
      const modifiedBy = row.original.action_by;
      const modifiedOn = row.original.action_at;
      return (
        <div className="">
          <p className="text-xs  font-medium">{modifiedBy}</p>
          <p className="text-xs text-muted-foreground">{modifiedOn}</p>
        </div>
      );
    },
  },
  {
    header: "Product Name",
    accessorKey: "productName",
    cell: ({ row }) => {
      return <p className="text-xs ">{row.getValue("productName")}</p>;
    },
  },
  {
    header: "Project Id",
    accessorKey: "projectId",
    cell: ({ row }) => (
      <div className="text-xs  font-medium">{row.getValue("projectId")}</div>
    ),
  },
  {
    header: "Department Id",
    accessorKey: "departmentId",
    cell: ({ row }) => (
      <div className="text-xs  font-medium">{row.getValue("departmentId")}</div>
    ),
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ row }) => (
      <div className="text-xs  font-medium">{row.getValue("version")}</div>
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

export default function DashboardProductsTable({ data }: { data: Item[] }) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-input rounded-2xl">
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                There are no products to display Create your first product
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
