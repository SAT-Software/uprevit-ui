"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";

const columns: ColumnDef<Project>[] = [
  {
    header: "Project Id",
    accessorKey: "_id",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("_id")}</div>
    ),
  },
  {
    header: "Project Name",
    accessorKey: "project_name",
    cell: ({ row }) => {
      return <p className="text-xs">{row.getValue("project_name")}</p>;
    },
  },
  {
    header: "Project Number",
    accessorKey: "project_number",
    cell: ({ row }) => {
      return <p className="text-xs">{row.getValue("project_number")}</p>;
    },
  },
  {
    header: "Description",
    accessorKey: "project_description",
    cell: ({ row }) => {
      return <p className="text-xs">{row.getValue("project_description")}</p>;
    },
  },
  {
    header: "Manager",
    accessorKey: "project_manager",
    cell: ({ row }) => {
      return <p className="text-xs">{row.getValue("project_manager")}</p>;
    },
  },
];

export default function DepartmentPageProjectsTable({
  data,
}: {
  data: Project[];
}) {
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
                onClick={() => router.push(`/projects/${row.original._id}`)}
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
                No products associated with this department yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
