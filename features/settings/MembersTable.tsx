"use client";

import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PiTrashDuotone } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("_id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const { name, email, profileAvatar } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profileAvatar} alt={name} />
            <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => {
      const designation = row.getValue("designation") as string;
      if (designation) return <p>{designation}</p>;

      return <p className="text-muted-foreground">N/A</p>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      if (location) return <p>{location}</p>;

      return <p className="text-muted-foreground">N/A</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusClasses = {
        Active:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Invited:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
      return (
        <Badge
          className={cn(statusClasses[status as keyof typeof statusClasses])}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "remove",
    cell: () => {
      return (
        <div className="text-right">
          <Button variant="ghost" size="icon">
            <PiTrashDuotone className="h-4 w-4" />
            <span className="sr-only">Remove user</span>
          </Button>
        </div>
      );
    },
  },
];

export function MembersTable() {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetAllUsersByWorkspace();

  const data = useMemo(() => responseData?.data ?? [], [responseData]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-24 border rounded-lg">
        <p className="text-muted-foreground">Failed to load members.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                No members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
