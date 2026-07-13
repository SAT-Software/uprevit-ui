"use client";

import type { ReactNode } from "react";
import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  NewOfficeIcon,
  Search02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
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
import type {
  PlatformWorkspaceListItem,
  WorkspaceBillingPreview,
} from "@/types/platform-admin";
import {
  billingAccountStatusVariant,
  getBillingStatusLabel,
} from "@/utils/billingStatusDisplay";

const WORKSPACE_SORT_FIELDS = ["workspaceName", "companyName", "memberCount"];

const WORKSPACE_FILTER_COLUMNS = [
  { name: "workspaceName", label: "Workspace", type: "text" as const },
  { name: "companyName", label: "Company", type: "text" as const },
];

const TABLE_COLUMN_COUNT = 4;

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<PlatformWorkspaceListItem, unknown>;
  title: string;
}) => (
  <button
    type="button"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="group flex h-8 w-full cursor-pointer items-center justify-between hover:bg-muted/50 data-[state=open]:bg-accent"
  >
    <div className="flex w-full items-center justify-between gap-2">
      <span className="whitespace-nowrap text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground">
        {title}
      </span>
      <div className="opacity-50 transition-all delay-100 duration-200 ease-in-out group-hover:opacity-100">
        {column.getIsSorted() === "desc" ? (
          <Icon icon={ArrowDown01Icon} className="ml-1 h-3 w-3" />
        ) : column.getIsSorted() === "asc" ? (
          <Icon icon={ArrowUp01Icon} className="ml-1 h-3 w-3" />
        ) : (
          <Icon icon={UnfoldMoreIcon} className="ml-1 h-3 w-3" />
        )}
      </div>
    </div>
  </button>
);

function BillingCell({ billing }: { billing: WorkspaceBillingPreview }) {
  const statusLabel = getBillingStatusLabel(billing.status, billing.pastDue);
  const statusVariant = billingAccountStatusVariant(
    billing.status,
    billing.pastDue,
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant={statusVariant} className="capitalize">
        {statusLabel}
      </Badge>
      {billing.status !== "not_set" ? (
        <Badge variant={billing.limitsEnabled ? "orange" : "gray"}>
          {billing.limitsEnabled ? "Limits on" : "Limits off"}
        </Badge>
      ) : null}
    </div>
  );
}

const columns: ColumnDef<PlatformWorkspaceListItem>[] = [
  {
    accessorKey: "workspaceName",
    header: ({ column }) => (
      <SortableHeader column={column} title="Workspace" />
    ),
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.getValue("workspaceName")}</p>
    ),
    size: 220,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => <SortableHeader column={column} title="Company" />,
    cell: ({ row }) => <p className="text-sm">{row.getValue("companyName")}</p>,
    size: 200,
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => <SortableHeader column={column} title="Users" />,
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
      <div className="flex h-8 items-center px-0">
        <span className="text-muted-foreground/60">Billing</span>
      </div>
    ),
    cell: ({ row }) => <BillingCell billing={row.original.billing} />,
    size: 180,
  },
];

type PlatformWorkspacesTableProps = {
  embedded?: boolean;
  headerActions?: ReactNode;
};

export function PlatformWorkspacesTable({
  embedded = false,
  headerActions,
}: PlatformWorkspacesTableProps) {
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
  }, [listState.query.page, listState, paginationInfo]);

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

  const content = (
    <>
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="shrink-0 text-sm font-medium">Workspaces</p>
          <InfoTooltip content="Search, inspect, and open any organization workspace." />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <InputGroup className="h-7 w-48">
            <InputGroupInput
              value={listState.searchDraft}
              onChange={(event) => listState.setSearchDraft(event.target.value)}
              placeholder="Search workspaces…"
              className="h-7 text-sm"
            />
            <InputGroupAddon>
              <Icon icon={Search02Icon} size={14} strokeWidth={2} />
            </InputGroupAddon>
          </InputGroup>
          {headerActions}
        </div>
      </div>

      <div className="w-full overflow-hidden border-b border-border">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="h-10 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
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
              <TableBodySkeleton columnCount={TABLE_COLUMN_COUNT} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(`/platform-admin/workspaces/${row.original.id}`)
                  }
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
                  colSpan={TABLE_COLUMN_COUNT}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icon
                      icon={NewOfficeIcon}
                      size={24}
                      strokeWidth={2}
                      className="text-muted-foreground/30"
                    />
                    <p className="text-sm">
                      No workspaces found
                      {isFetching ? " · Updating…" : ""}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex h-10 w-full items-center">
        <WorkspaceListPagination
          pagination={paginationInfo}
          onPageChange={listState.setPage}
        />
      </div>
    </>
  );

  if (embedded) {
    return <div className="flex flex-col">{content}</div>;
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      {content}
    </div>
  );
}
