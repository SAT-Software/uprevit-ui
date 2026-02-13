"use client";

import { useEffect, useMemo, useState } from "react";
import { PiCircleNotchDuotone } from "react-icons/pi";
import { useAuth } from "react-oidc-context";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditScopeType } from "@/types/audit-log";
import { useGetAuditLogs } from "@/hooks/audit-logs/useGetAuditLogs";
import { ActivityLogTable } from "./ActivityLogTable";

type ActivityLogsPanelProps = {
  scopeType: AuditScopeType;
  scopeId?: string;
  title: string;
  description: string;
  showHeader?: boolean;
};

const actionFilters = [
  { value: "all", label: "All actions" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "move", label: "Move" },
  { value: "archive", label: "Archive" },
  { value: "restore", label: "Restore" },
  { value: "submit", label: "Submit" },
  { value: "link", label: "Link" },
  { value: "unlink", label: "Unlink" },
];

export function ActivityLogsPanel({
  scopeType,
  scopeId,
  title,
  description,
  showHeader = true,
}: ActivityLogsPanelProps) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [action, setAction] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [search]);

  const filters = useMemo(
    () => ({
      workspaceId: workspaceId ?? "",
      scopeType,
      scopeId,
      page,
      limit: 10,
      search: debouncedSearch.trim() || undefined,
      actions: action === "all" ? undefined : [action],
    }),
    [action, debouncedSearch, page, scopeId, scopeType, workspaceId],
  );

  const { data, isLoading, isFetching, isError, error } =
    useGetAuditLogs(filters);

  const logs = data?.result?.logs ?? [];
  const pagination = data?.result?.pagination;
  const currentPage = pagination?.page ?? page;

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <div
        className={`flex items-center gap-3 ${showHeader ? "justify-between" : "justify-end"}`}
      >
        {showHeader ? (
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <PiCircleNotchDuotone className="h-3.5 w-3.5 animate-spin" />
              Loading...
            </span>
          ) : null}
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search logs..."
            className="h-8 w-52 text-xs"
          />
          <Select
            value={action}
            onValueChange={(nextValue) => {
              setAction(nextValue);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              {actionFilters.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {isError ? (
          <div className="h-28 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-center text-sm text-destructive">
            {error?.message || "Failed to load logs"}
          </div>
        ) : (
          <ActivityLogTable
            logs={logs}
            page={currentPage}
            totalPages={pagination?.totalPages ?? 1}
            totalCount={pagination?.totalCount ?? 0}
            hasPrevPage={pagination?.hasPrevPage}
            hasNextPage={pagination?.hasNextPage}
            isInitialLoading={isLoading}
            isRefreshing={isFetching && !isLoading}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
