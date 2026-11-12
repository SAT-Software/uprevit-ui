"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft02Icon,
  Clock01Icon,
  Download04Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { useAuth } from "react-oidc-context";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { AuditScopeType } from "@/types/audit-log";
import { useGetAuditLogs } from "@/hooks/audit-logs/useGetAuditLogs";
import {
  type AuditLogExportJob,
  useAuditLogExportJobs,
  useEnqueueAuditLogExport,
} from "@/hooks/audit-logs/useAuditLogExport";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
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

const entityFilters = [
  { value: "all", label: "All records" },
  { value: "product", label: "Product" },
  { value: "project", label: "Project" },
  { value: "department", label: "Department" },
  { value: "source_file", label: "Source file" },
  { value: "source_folder", label: "Source folder" },
  { value: "workflow", label: "Workflow" },
  { value: "user", label: "Member" },
  { value: "workspace", label: "Workspace" },
];

const exportStatusLabels: Record<AuditLogExportJob["status"], string> = {
  queued: "Queued",
  processing: "Preparing",
  completed: "Ready",
  failed: "Failed",
};

const endOfDay = (value: string) =>
  new Date(`${value}T23:59:59.999Z`).toISOString();

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-36 text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ActorFilterSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { data } = useGetAllUsersByWorkspace({ limit: 100, includeInactive: true });
  const options = [
    { value: "all", label: "All people" },
    ...(data?.result.users ?? [])
      .filter((user) => user.cognitoSub)
      .map((user) => ({ value: user.cognitoSub, label: user.name })),
  ];

  return (
    <FilterSelect value={value} onChange={onChange} options={options} placeholder="Person" />
  );
}

function AuditLogExportJobRow({ job }: { job: AuditLogExportJob }) {
  const download = () => {
    if (!job.downloadUrl) return;
    const link = document.createElement("a");
    link.href = job.downloadUrl;
    link.download = job.fileName || "audit-log.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-xs">
      <div className="flex min-w-0 items-center gap-2">
        <Badge
          variant={
            job.status === "failed"
              ? "destructive"
              : job.status === "completed"
                ? "default"
                : "secondary"
          }
        >
          {exportStatusLabels[job.status]}
        </Badge>
        {job.fileName ? <span className="truncate">{job.fileName}</span> : null}
        {job.status === "failed" && job.errorMessage ? (
          <span className="truncate text-destructive">{job.errorMessage}</span>
        ) : null}
      </div>
      {job.status === "completed" && job.downloadUrl ? (
        <Button type="button" variant="outline" size="sm" onClick={download}>
          Download
        </Button>
      ) : null}
    </div>
  );
}

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
  const [entity, setEntity] = useState("all");
  const [actor, setActor] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const isWorkspaceScope = scopeType === "workspace";
  const { mutate: enqueueExport, isPending: isEnqueuePending } =
    useEnqueueAuditLogExport();
  const { data: exportJobsData } = useAuditLogExportJobs({
    enabled: isWorkspaceScope,
  });
  const exportJob = exportJobsData?.result.jobs[0];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [search]);

  const exportFilters = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      actions: action === "all" ? undefined : [action],
      entityType: entity === "all" ? undefined : entity,
      actorUserId: actor === "all" ? undefined : actor,
      from: from || undefined,
      to: to ? endOfDay(to) : undefined,
    }),
    [action, actor, debouncedSearch, entity, from, to],
  );

  const filters = useMemo(
    () => ({
      workspaceId: workspaceId ?? "",
      scopeType,
      scopeId,
      page,
      limit: 10,
      ...exportFilters,
    }),
    [exportFilters, page, scopeId, scopeType, workspaceId],
  );

  const withPageReset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const handleExport = () =>
    enqueueExport(exportFilters, {
      onSuccess: () =>
        toast.success("Audit log export queued. It appears here when ready."),
      onError: (error) =>
        toast.error(
          error instanceof Error ? error.message : "Failed to queue audit log export",
        ),
    });

  const { data, isLoading, isFetching, isError, refetch } =
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
            {scopeType === "product" && scopeId ? (
              <Link
                href={`/products/${scopeId}/product-information`}
                className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Icon icon={ArrowLeft02Icon} size={14} strokeWidth={2} />
                Go Back
              </Link>
            ) : null}
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon
                icon={Loading03Icon}
                size={14}
                strokeWidth={2}
                className="animate-spin"
              />
              Loading…
            </span>
          ) : null}
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search logs…"
            className="h-8 w-52 text-xs"
          />
          <FilterSelect
            value={action}
            onChange={withPageReset(setAction)}
            options={actionFilters}
            placeholder="Action"
          />
          {isWorkspaceScope ? (
            <>
              <FilterSelect
                value={entity}
                onChange={withPageReset(setEntity)}
                options={entityFilters}
                placeholder="Record type"
              />
              <ActorFilterSelect value={actor} onChange={withPageReset(setActor)} />
              <Input
                type="date"
                aria-label="From date"
                value={from}
                onChange={(event) => withPageReset(setFrom)(event.target.value)}
                className="h-8 w-36 text-xs"
              />
              <Input
                type="date"
                aria-label="To date"
                value={to}
                onChange={(event) => withPageReset(setTo)(event.target.value)}
                className="h-8 w-36 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={
                  isEnqueuePending ||
                  exportJob?.status === "queued" ||
                  exportJob?.status === "processing"
                }
                onClick={handleExport}
              >
                <Icon icon={Download04Icon} size={16} strokeWidth={2} />
                Export CSV
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {isWorkspaceScope ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Exports the 10,000 most recent events that match the current filters.
          </p>
          {exportJob ? <AuditLogExportJobRow job={exportJob} /> : null}
        </div>
      ) : null}

      <div className="flex-1 min-h-0 overflow-y-auto">
        {isError && !data ? (
          <ErrorState
            variant="panel"
            icon={Clock01Icon}
            title="Failed to load logs"
            onRetry={() => refetch()}
            fill
          />
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
