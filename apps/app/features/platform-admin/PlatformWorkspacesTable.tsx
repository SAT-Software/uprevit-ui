"use client";

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  PiBuildingsDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiCreditCardDuotone,
  PiUsersDuotone,
} from "react-icons/pi";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import {
  usePlatformAdminListQuery,
  mapPlatformPagination,
} from "@/lib/platform-admin-list-query";
import { useGetPlatformWorkspaces } from "@/hooks/platform-admin/useGetPlatformWorkspaces";
import type { PlatformWorkspaceListItem } from "@/types/platform-admin";

const WORKSPACE_SORT_FIELDS = ["workspaceName", "companyName", "memberCount"];

const WORKSPACE_FILTER_COLUMNS = [
  { name: "workspaceName", label: "Workspace", type: "text" as const },
  { name: "companyName", label: "Company", type: "text" as const },
];

const TABLE_COLUMN_COUNT = 4;

const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: Column<PlatformWorkspaceListItem, unknown>;
  title: string;
  icon: IconType;
}) => (
  <button
    type="button"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-8 data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
  >
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="whitespace-nowrap">{title}</span>
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

const columns: ColumnDef<PlatformWorkspaceListItem>[] = [
  {
    accessorKey: "workspaceName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Workspace"
        icon={PiBuildingsDuotone}
      />
    ),
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.getValue("workspaceName")}</p>
    ),
    size: 220,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Company"
        icon={PiBuildingsDuotone}
      />
    ),
    cell: ({ row }) => (
      <p className="text-sm">{row.getValue("companyName")}</p>
    ),
    size: 200,
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => (
      <SortableHeader column={column} title="Users" icon={PiUsersDuotone} />
    ),
    cell: ({ row }) => (
      <p className="text-sm tabular-nums">{row.getValue("memberCount")}</p>
    ),
    size: 100,
  },
  {
    id: "billing",
    accessorFn: (row) => row.billing.status,
    enableSorting: false,
    header: () => (
      <div className="flex h-8 items-center gap-2 px-0">
        <PiCreditCardDuotone className="h-4 w-4 text-muted-foreground" />
        <span>Billing</span>
      </div>
    ),
    cell: ({ row }) => {
      const billing = row.original.billing;
      if (billing.status === "not_set") {
        return <span className="text-sm text-muted-foreground">Not set</span>;
      }
      return (
        <span className="text-sm capitalize">
          {billing.status}
          {billing.limitsEnabled ? " · limits" : ""}
        </span>
      );
    },
    size: 120,
  },
];

export function PlatformWorkspacesTable() {
  const router = useRouter();
  const listState = usePlatformAdminListQuery({
    defaultSort: "workspaceName",
    defaultOrder: "asc",
    allowedSortFields: WORKSPACE_SORT_FIELDS,
    filterColumns: WORKSPACE_FILTER_COLUMNS,
  });

  const { data, isLoading, isFetching } = useGetPlatformWorkspaces({
    page: listState.query.page,
    limit: listState.query.limit,
    sort: listState.query.sort,
    order: listState.query.order,
    search: listState.query.search,
  });

  const paginationInfo = mapPlatformPagination(data?.pagination);

  const sorting = useMemo<SortingState>(
    () => [
      { id: listState.query.sort, desc: listState.query.order === "desc" },
    ],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (!paginationInfo) return;
    if (paginationInfo.totalPages === 0) {
      if (listState.query.page !== 1) listState.setPage(1);
      return;
    }
    if (listState.query.page > paginationInfo.totalPages) {
      listState.setPage(1);
    }
  }, [listState.query.page, listState.setPage, paginationInfo]);

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 1,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const next = nextSorting[0];
      if (!next) return;
      listState.setSort(next.id, next.desc ? "desc" : "asc");
    },
    enableSortingRemoval: false,
    state: { sorting },
  });

  return (
    <div className="space-y-2 w-full">
      <Input
        placeholder="Search workspaces…"
        value={listState.searchDraft}
        onChange={(event) => listState.setSearchDraft(event.target.value)}
        className="max-w-sm"
      />

      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="h-11 border-r border-border last:border-r-0"
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
              <TableBodySkeleton columnCount={TABLE_COLUMN_COUNT} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(
                      `/platform-admin/workspaces/${row.original.id}`,
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-3">
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
                  colSpan={TABLE_COLUMN_COUNT}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No workspaces found
                  {isFetching ? " · Updating…" : ""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <WorkspaceListPagination
        pagination={paginationInfo}
        onPageChange={listState.setPage}
      />
    </div>
  );
}
