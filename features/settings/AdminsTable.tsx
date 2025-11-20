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
import DialogRemoveUser from "./DialogRemoveUser";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {String(row.getValue("_id") ?? "").slice(0, 8)}
      </div>
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
    accessorKey: "userType",
    header: "User Type",
    cell: ({ row }) => {
      const userType = row.getValue("userType") as string;
      if (userType)
        return (
          <Badge variant={userType === "admin" ? "secondary" : "outline"}>
            {userType}
          </Badge>
        );

      return <p className="text-muted-foreground">N/A</p>;
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
      const status = row.getValue("status") as "active" | "invited";
      const statusClasses = {
        active: "bg-green-50/90 text-green-600 border border-green-500",
        invited: "bg-yellow-50/90 text-yellow-600 border border-yellow-500",
      };
      const displayText = status === "active" ? "Active" : "Invited";
      return <Badge className={cn(statusClasses[status])}>{displayText}</Badge>;
    },
  },
  {
    id: "remove",
    cell: ({ row }) => {
      const { _id, name } = row.original;
      // Only show remove button if user has an ID and is not the current user
      if (!_id) {
        return (
          <div className="text-right">
            <Button variant="ghost" size="icon" disabled>
              <PiTrashDuotone className="h-4 w-4" />
              <span className="sr-only">Cannot remove user without ID</span>
            </Button>
          </div>
        );
      }

      return (
        <div className="text-right">
          <DialogRemoveUser
            userId={_id}
            userName={name}
            trigger={
              <Button variant="ghost" size="icon">
                <PiTrashDuotone className="h-4 w-4" />
                <span className="sr-only">Remove user</span>
              </Button>
            }
          />
        </div>
      );
    },
  },
];

export function AdminsTable() {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetAllUsersByWorkspace();

  const data = useMemo(() => {
    const users = responseData?.data ?? [];
    return users.filter((user: User) => user.userType === "admin");
  }, [responseData]);

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
        <p className="text-muted-foreground">Failed to load admins.</p>
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
                No admins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
