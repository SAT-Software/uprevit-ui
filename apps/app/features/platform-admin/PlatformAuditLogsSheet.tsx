"use client";

import { type UIEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { PlatformAuditLogsTimeline } from "@/features/platform-admin/PlatformAuditLogsTimeline";
import { useGetPlatformAuditLogsInfinite } from "@/hooks/platform-admin/useGetPlatformAuditLogsInfinite";
import {
  FilterVerticalIcon,
  ProfileIcon,
  Refresh04Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@uprevit/ui/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";

const statusFilters = [
  { value: "all", label: "All statuses" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

type PlatformAuditLogsSheetProps = {
  workspaceId?: string;
  title?: string;
  tooltip?: string;
  trigger?: React.ReactNode;
};

export function PlatformAuditLogsSheet({
  workspaceId,
  title = "Audit logs",
  tooltip = "Track admin actions, access checks, and changes across the platform.",
  trigger,
}: PlatformAuditLogsSheetProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [search]);

  const filters = useMemo(
    () => ({
      workspaceId,
      limit: 10,
      sort: "occurredAt",
      order: "desc" as const,
      search: debouncedSearch.trim() || undefined,
      status:
        status === "all" ? undefined : (status as "success" | "failed"),
    }),
    [debouncedSearch, status, workspaceId],
  );

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useGetPlatformAuditLogsInfinite(filters);

  const logs = data?.pages.flatMap((page) => page.items) ?? [];

  const handleRefreshLogs = () => {
    void queryClient.invalidateQueries({
      queryKey: ["platform-admin", "audit-logs-infinite"],
    });
    void queryClient.invalidateQueries({
      queryKey: ["platform-admin", "audit-logs"],
    });
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            {trigger ?? (
              <Button type="button" variant="outline" size="sm">
                <Icon icon={ProfileIcon} size={16} strokeWidth={2} />
                Logs
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>Show platform audit logs</TooltipContent>
        </Tooltip>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <InfoTooltip
            className="mt-0.5"
            ContentClassName="z-105"
            content={tooltip}
          />
        </SheetHeader>
        <div
          ref={setPortalContainer}
          className="flex min-h-0 flex-1 flex-col overflow-hidden pt-10"
        >
          <div className="flex h-10 shrink-0 items-center justify-start gap-2 border-b bg-background px-2">
            <InputGroup className="w-full">
              <InputGroupInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search logs..."
                className="w-full text-sm"
              />
              <InputGroupAddon>
                <Icon icon={Search02Icon} size={14} strokeWidth={2} />
              </InputGroupAddon>
              <InputGroupAddon
                className="text-xs text-muted-foreground/60"
                align="inline-end"
              >
                {search
                  ? `${logs.length} result${logs.length === 1 ? "" : "s"}`
                  : "0 results"}
              </InputGroupAddon>
            </InputGroup>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="group w-auto shrink-0 truncate">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex min-w-0 items-center gap-1">
                      <Icon
                        icon={FilterVerticalIcon}
                        size={14}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-foreground"
                      />
                      <SelectValue placeholder="Status" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Filter logs by status</TooltipContent>
                </Tooltip>
              </SelectTrigger>
              <SelectContent container={portalContainer} className="z-110">
                {statusFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={handleRefreshLogs}
                  disabled={isFetching}
                  aria-label="Refresh logs"
                >
                  <Icon icon={Refresh04Icon} size={14} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh logs</TooltipContent>
            </Tooltip>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            onScroll={handleScroll}
          >
            <PlatformAuditLogsTimeline
              logs={logs}
              className="w-auto py-3 pl-4 pr-2"
              isInitialLoading={isLoading}
              isRefreshing={isFetching && !isLoading && !isFetchingNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isError={isError}
              errorMessage={error?.message}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
