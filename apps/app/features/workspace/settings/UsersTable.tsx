"use client";

import { useMemo } from "react";
import {
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
import { PiUsersDuotone, PiCaretUpDownDuotone } from "react-icons/pi";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import {
  USER_FILTER_COLUMNS,
  USER_SORT_OPTIONS,
} from "@/lib/user-list-config";
import { useWorkspaceListQuery } from "@/lib/workspace-list-query";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { InviteMembersDialog } from "./InviteMembersDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Switch } from "@uprevit/ui/components/ui/switch";
import { Label } from "@uprevit/ui/components/ui/label";
import { getUserTableColumns } from "./userTableColumns";
import { useMemberListIncludeInactive } from "./useMemberListIncludeInactive";

export function UsersTable() {
  const listState = useWorkspaceListQuery({
    defaultSort: "name",
    allowedSortFields: USER_SORT_OPTIONS.map((option) => option.value),
    filterColumns: USER_FILTER_COLUMNS,
  });

  const { isAdmin, includeInactive, toggleIncludeInactive } =
    useMemberListIncludeInactive();

  const listQuery = useMemo(
    () => ({
      ...listState.query,
      includeInactive,
    }),
    [includeInactive, listState.query],
  );

  const columns = useMemo(() => getUserTableColumns(isAdmin), [isAdmin]);

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersByWorkspace(listQuery);

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
          {isAdmin ? (
            <div className="ml-auto flex items-center gap-2">
              <Switch
                id="show-removed-members"
                checked={includeInactive}
                onCheckedChange={toggleIncludeInactive}
              />
              <Label htmlFor="show-removed-members" className="text-sm">
                Show removed members
              </Label>
            </div>
          ) : null}
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
