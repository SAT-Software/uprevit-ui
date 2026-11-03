"use client";

import { WorkspaceListPaginationSkeleton } from "@/components/table/WorkspaceListPaginationSkeleton";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import {
  ErrorState,
  TABLE_BODY_STATE_MIN_HEIGHT,
} from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
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
  SortingAZ01Icon,
  SortingAZ02Icon,
  SortingZA01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";

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
    isPending: isLoading,
    isError: isQueryError,
    refetch,
  } = useGetAllUsersByWorkspace(listQuery);

  const data = useMemo(
    () => responseData?.result?.users ?? [],
    [responseData],
  );
  const isError = isQueryError && !responseData;
  const pagination = responseData?.result?.pagination;
  const totalCount = pagination?.totalCount ?? 0;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Users</p>
          <InfoTooltip content="Manage workspace members, roles, and access." />
          {isLoading ? (
            <Skeleton className="h-5 w-6 rounded-md" />
          ) : (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {totalCount}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Switch
                id="show-removed-members"
                checked={includeInactive}
                onCheckedChange={toggleIncludeInactive}
              />
              <Label
                htmlFor="show-removed-members"
                className="text-xs text-muted-foreground"
              >
                Show removed
              </Label>
            </div>
          ) : null}
          <WorkspaceListControls
            filters={listState.query.filters}
            filterColumns={USER_FILTER_COLUMNS}
            onApplyFilters={listState.setFilters}
            onClearFilters={listState.clearFilters}
          />
          <Select
            value={listState.query.sort}
            onValueChange={(sort) =>
              listState.setSort(sort, listState.query.order)
            }
          >
            <SelectTrigger className="group w-auto truncate">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={SortingAZ01Icon}
                      size={16}
                      strokeWidth={2}
                      className="text-muted-foreground/60 transition-colors duration-150 ease-out group-hover:text-foreground"
                    />
                    <SelectValue />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Sort by different fields</TooltipContent>
              </Tooltip>
            </SelectTrigger>
            <SelectContent>
              {USER_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="text-muted-foreground/60">Sort by:</span>{" "}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={listState.query.order === "asc" ? "Sort order: ascending" : "Sort order: descending"}
                variant="outline"
                size="icon-xs"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() =>
                  listState.setSort(
                    listState.query.sort ?? "name",
                    listState.query.order === "asc" ? "desc" : "asc",
                  )
                }
              >
                {listState.query.order === "asc" ? (
                  <Icon icon={SortingAZ02Icon} size={16} strokeWidth={2} />
                ) : (
                  <Icon icon={SortingZA01Icon} size={16} strokeWidth={2} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle sort order</TooltipContent>
          </Tooltip>
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
            {isLoading ? (
              <TableBodySkeleton columnCount={columns.length} />
            ) : isError ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <ErrorState
                    variant="panel"
                    embedded
                    icon={UserMultipleIcon}
                    title="Failed to load members"
                    onRetry={() => refetch()}
                    className={TABLE_BODY_STATE_MIN_HEIGHT}
                  />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
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
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    embedded
                    icon={UserMultipleIcon}
                    title="No members found"
                    description={
                      listState.query.filters.length > 0
                        ? "Try changing your filters"
                        : "Invite users to get started"
                    }
                    action={
                      listState.query.filters.length > 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={listState.clearFilters}
                        >
                          Clear filters
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex h-10 w-full items-center">
        {isLoading ? (
          <WorkspaceListPaginationSkeleton />
        ) : (
          <WorkspaceListPagination
            pagination={pagination}
            onPageChange={listState.setPage}
          />
        )}
      </div>
    </div>
  );
}
