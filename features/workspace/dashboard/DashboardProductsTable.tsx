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
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { AuditLog } from "@/types/product";
import { useMemo } from "react";

export type Item = {
  _id: string;
  productId?: string;
  auditLogs?: Array<AuditLog>;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  master_version: string;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: string;
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

const columns: ColumnDef<Item>[] = [
  {
    header: "PPN",
    accessorKey: "product_plan_number",
    cell: ({ row }) => {
      const ppn = row.getValue("product_plan_number");
      return <div className="text-sm font-medium">{ppn as string}</div>;
    },
  },
  {
    header: "Product Name",
    accessorKey: "product_name",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium">{row.getValue("product_name")}</p>
      );
    },
  },
  {
    header: "Project Name",
    accessorKey: "project_name",
    cell: ({ row }) => {
      const project_name = row.original?.project[0]?.project_name;

      return <div className="text-sm font-medium">{project_name}</div>;
    },
  },
  {
    header: "Department Name",
    accessorKey: "department_name",
    cell: ({ row }) => {
      const departmentName = row.original?.department[0]?.department_name;

      return <div className="text-sm font-medium">{departmentName}</div>;
    },
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
  {
    header: "Version",
    accessorKey: "master_version",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.getValue("master_version")}
      </div>
    ),
  },
  {
    header: "Progress",
    accessorKey: "complete_count",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.getValue("complete_count")} %
      </div>
    ),
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
  //         <p className="text-xs  font-medium">{createdBy}</p>
  //         <p className="text-xs text-muted-foreground">
  //           {createdAt ? createdAt.toLocaleString().slice(0, 10) : "N/A"}
  //         </p>
  //       </div>
  //     );
  //   },
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
  //         <p className="text-xs  font-medium">{modifiedBy}</p>
  //         <p className="text-xs text-muted-foreground">
  //           {modifiedAt ? modifiedAt.toLocaleString().slice(0, 10) : "N/A"}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
];

export default function DashboardProductsTable() {
  const { data, isLoading, error } = useGetAllProducts();
  const recentProductsData = useMemo(
    () =>
      Array.isArray(data?.result?.products)
        ? data.result.products.slice(0, 3)
        : [],
    [data]
  );

  console.log("Recent Products Data:", recentProductsData);
  const router = useRouter();
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: recentProductsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="border border-input rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  if (error) return <div>Error loading products: {error.message}</div>;

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
                  row.original._id &&
                  router.push(
                    `/products/${row.original._id}/product-information`
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
