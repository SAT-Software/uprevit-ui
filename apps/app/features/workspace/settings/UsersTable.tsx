"use client";

import { useMemo, type ElementType } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@uprevit/ui/components/ui/avatar";
import {
  PiTrashDuotone,
  PiUserDuotone,
  PiUsersDuotone,
  PiIdentificationCardDuotone,
  PiBriefcaseDuotone,
  PiMapPinDuotone,
  PiInfoDuotone,
  PiUserCircleGearDuotone,
} from "react-icons/pi";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import {
  USER_FILTER_COLUMNS,
  USER_SORT_OPTIONS,
} from "@/lib/user-list-config";
import { useWorkspaceListQuery } from "@/lib/workspace-list-query";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { User } from "@/types/user";
import DialogRemoveUser from "./DialogRemoveUser";
import { InviteMembersDialog } from "./InviteMembersDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { PiCaretUpDownDuotone } from "react-icons/pi";

const StaticHeader = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: ElementType;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span>{title}</span>
  </div>
);

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "_id",
    header: () => (
      <StaticHeader title="ID" icon={PiIdentificationCardDuotone} />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {String(row.getValue("_id") ?? "").slice(0, 8)}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <StaticHeader title="User" icon={PiUserDuotone} />,
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
    header: () => (
      <StaticHeader title="User Type" icon={PiUserCircleGearDuotone} />
    ),
    cell: ({ row }) => {
      const userType = row.getValue("userType") as string;
      if (userType === "admin") {
        return (
          <Badge variant="secondary">
            <PiUserCircleGearDuotone className="w-4 h-4" />
            Admin
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <PiUserDuotone className="w-4 h-4" />
          Member
        </Badge>
      );
    },
  },
  {
    accessorKey: "designation",
    header: () => (
      <StaticHeader title="Designation" icon={PiBriefcaseDuotone} />
    ),
    cell: ({ row }) => {
      const designation = row.getValue("designation") as string;
      if (designation) return <p>{designation}</p>;

      return <p className="text-muted-foreground">N/A</p>;
    },
  },
  {
    accessorKey: "location",
    header: () => <StaticHeader title="Location" icon={PiMapPinDuotone} />,
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      if (location) return <p>{location}</p>;

      return <p className="text-muted-foreground">N/A</p>;
    },
  },
  {
    accessorKey: "status",
    header: () => <StaticHeader title="Status" icon={PiInfoDuotone} />,
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "invited";
      const statusClasses = {
        active:
          "bg-green-50/90 dark:bg-green-900/60 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-700",
        invited:
          "bg-yellow-50/90 dark:bg-yellow-900/60 text-yellow-600 dark:text-yellow-400 border border-yellow-500 dark:border-yellow-700",
      };
      const displayText = status === "active" ? "Active" : "Invited";
      return <Badge className={cn(statusClasses[status])}>{displayText}</Badge>;
    },
  },
  {
    id: "remove",
    enableHiding: false,
    cell: ({ row }) => {
      const { _id, name } = row.original;
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

export function UsersTable() {
  const listState = useWorkspaceListQuery({
    defaultSort: "name",
    allowedSortFields: USER_SORT_OPTIONS.map((option) => option.value),
    filterColumns: USER_FILTER_COLUMNS,
  });

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersByWorkspace(listState.query);

  const data = useMemo(
    () => responseData?.result?.users ?? [],
    [responseData],
  );
  const pagination = responseData?.result?.pagination;
  const totalCount = pagination?.totalCount ?? 0;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6 px-6 py-4 bg-accent rounded-lg border">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
        <p className="text-sm font-medium text-destructive">
          Failed to load members.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 px-6 py-4 bg-accent rounded-lg border">
        <p className="text-2xl border border-border font-bold bg-background rounded-full w-20 h-20 flex items-center justify-center">
          {totalCount}
        </p>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {totalCount === 1 ? "User" : "Users"}
          </h2>
          <p className="text-muted-foreground">Manage your workspace users</p>
        </div>
        <InviteMembersDialog />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <WorkspaceListControls
            filters={listState.query.filters}
            filterColumns={USER_FILTER_COLUMNS}
            onApplyFilters={listState.setFilters}
            onClearFilters={listState.clearFilters}
          />
          <div className="flex items-center gap-2">
            <Select
              value={listState.query.sort}
              onValueChange={(sort) =>
                listState.setSort(sort, listState.query.order)
              }
            >
              <SelectTrigger className="h-8 w-[200px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              onClick={() =>
                listState.setSort(
                  listState.query.sort ?? "name",
                  listState.query.order === "asc" ? "desc" : "asc",
                )
              }
            >
              <PiCaretUpDownDuotone />
              {listState.query.order === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>
        </div>

        <div className="border rounded-xl bg-background overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-11 border-r border-border last:border-r-0 text-xs uppercase font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
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
                      <PiUsersDuotone className="w-8 h-8 opacity-20" />
                      <p>No members found. Invite users to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <WorkspaceListPagination
          pagination={pagination}
          onPageChange={listState.setPage}
        />
      </div>
    </div>
  );
}
