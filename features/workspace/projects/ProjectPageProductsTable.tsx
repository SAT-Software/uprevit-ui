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
import { AuditLog } from "@/types/product";

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
      // Assuming project data is available through the data prop
      const project_name = row.original?.project?.[0]?.project_name || "N/A";
      return <div className="text-sm font-medium">{project_name}</div>;
    },
  },
  {
    header: "Department Name",
    accessorKey: "department_name",
    cell: ({ row }) => {
      // Assuming department data is available through the data prop
      const departmentName =
        row.original?.department?.[0]?.department_name || "N/A";
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
        {row.getValue("complete_count") || 0} %
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

export default function ProjectPageProductsTable({ data }: { data: Item[] }) {
  console.log("Products Table Data:", data);
  const router = useRouter();
  // eslint-disable-next-line react-hooks/incompatible-library
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
                There are no products in this project.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
