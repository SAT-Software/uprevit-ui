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
import {
  PiTrashDuotone,
  PiCrownDuotone,
  PiUserDuotone,
  PiCaretDownDuotone,
  PiCaretUpDuotone,
  PiCaretUpDownDuotone,
  PiIdentificationCardDuotone,
  PiBriefcaseDuotone,
  PiMapPinDuotone,
  PiInfoDuotone,
} from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { SortingState, getSortedRowModel } from "@tanstack/react-table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";
import DialogRemoveUser from "./DialogRemoveUser";

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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="ID"
        icon={PiIdentificationCardDuotone}
      />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {String(row.getValue("_id") ?? "").slice(0, 8)}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} title="User" icon={PiUserDuotone} />
    ),
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
    header: ({ column }) => (
      <SortableHeader column={column} title="User Type" icon={PiCrownDuotone} />
    ),
    cell: ({ row }) => {
      const userType = row.getValue("userType") as string;
      if (userType === "admin") {
        return (
          <Badge
            variant="default"
            className="gap-1 bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 border-indigo-200"
          >
            <PiCrownDuotone className="w-3 h-3" />
            Admin
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <PiUserDuotone className="w-3 h-3" />
          Member
        </Badge>
      );
    },
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Designation"
        icon={PiBriefcaseDuotone}
      />
    ),
    cell: ({ row }) => {
      const designation = row.getValue("designation") as string;
      if (designation) return <p>{designation}</p>;

      return <p className="text-muted-foreground">N/A</p>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <SortableHeader column={column} title="Location" icon={PiMapPinDuotone} />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      if (location) return <p>{location}</p>;

      return <p className="text-muted-foreground">N/A</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column} title="Status" icon={PiInfoDuotone} />
    ),
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
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
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

  const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
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
    <div className="border rounded-xl bg-background overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="h-11 border-r border-border last:border-r-0 text-xs uppercase font-medium text-muted-foreground"
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/30"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <PiUserDuotone className="w-8 h-8 opacity-20" />
                  <p>No admins found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
