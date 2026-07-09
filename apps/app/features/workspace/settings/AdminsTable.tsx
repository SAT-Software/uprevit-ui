"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import {
  ADMIN_USER_TYPE_FILTER,
  USER_FILTER_COLUMNS,
  USER_SORT_OPTIONS,
} from "@/lib/user-list-config";
import { useWorkspaceListQuery } from "@/lib/workspace-list-query";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
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
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";

const ADMIN_FILTER_COLUMNS = USER_FILTER_COLUMNS.filter(
  (column) => column.name !== "userType",
);

export function AdminsTable() {
  const listState = useWorkspaceListQuery({
    defaultSort: "name",
    allowedSortFields: USER_SORT_OPTIONS.map((option) => option.value),
    filterColumns: ADMIN_FILTER_COLUMNS,
  });

  const { isAdmin, includeInactive, toggleIncludeInactive } =
    useMemberListIncludeInactive();

  const listQuery = useMemo(
    () => ({
      ...listState.query,
      includeInactive,
      filters: [
        ADMIN_USER_TYPE_FILTER,
        ...(listState.query.filters ?? []).filter(
          (filter) => filter.field !== "userType",
        ),
      ],
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
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex h-10 items-center border-b border-border pl-3 pr-2">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-8">
        <p className="text-sm font-medium text-destructive">
          Failed to load admins.
        </p>
        <Button variant="outline" size="sm" className="h-7" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Admins</p>
          <InfoTooltip content="Workspace administrators with elevated permissions." />
          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
            {totalCount}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <div className="flex items-center gap-2">
            <Switch
              id="show-removed-admins"
              checked={includeInactive}
              onCheckedChange={toggleIncludeInactive}
            />
            <Label
              htmlFor="show-removed-admins"
              className="text-xs text-muted-foreground"
            >
              Show removed
            </Label>
          </div>
          <WorkspaceListControls
            filters={listState.query.filters}
            filterColumns={ADMIN_FILTER_COLUMNS}
            onApplyFilters={listState.setFilters}
            onClearFilters={listState.clearFilters}
          />
          <Select
            value={listState.query.sort}
            onValueChange={(sort) =>
              listState.setSort(sort, listState.query.order)
            }
          >
            <SelectTrigger className="h-7 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USER_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  Sort: {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={() =>
              listState.setSort(
                listState.query.sort ?? "name",
                listState.query.order === "asc" ? "desc" : "asc",
              )
            }
          >
            <Icon
              icon={
                listState.query.order === "asc"
                  ? ArrowUp01Icon
                  : ArrowDown01Icon
              }
              size={14}
              strokeWidth={2}
            />
            {listState.query.order === "asc" ? "A-Z" : "Z-A"}
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden border-b border-border">
        <Table className="table-fixed w-full">
          <colgroup>
            {table.getHeaderGroups()[0]?.headers.map((header) => (
              <col
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
              />
            ))}
          </colgroup>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-10 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0"
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
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3",
                        cell.column.id === "remove" && "px-2",
                      )}
                    >
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
                    <Icon
                      icon={UserSettings01Icon}
                      size={24}
                      strokeWidth={2}
                      className="text-muted-foreground/30"
                    />
                    <p className="text-sm">No admins found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex h-10 w-full items-center">
        <WorkspaceListPagination
          pagination={pagination}
          onPageChange={listState.setPage}
        />
      </div>
    </div>
  );
}
