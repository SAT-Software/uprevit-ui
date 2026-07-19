"use client";

import { type UIEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ActivityLogsTimeline } from "@/features/workspace/logs/ActivityLogsTimeline";
import { useGetAuditLogsInfinite } from "@/hooks/audit-logs/useGetAuditLogs";
import { AuditScopeType } from "@/types/audit-log";
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
import { useAuth } from "react-oidc-context";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  FilterVerticalIcon,
  Refresh04Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@uprevit/ui/lib/utils";

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

type ActivityLogsSheetProps = {
  scopeType: AuditScopeType;
  scopeId: string;
  title?: string;
  tooltip?: string;
  trigger?: React.ReactNode;
};

export function ActivityLogsSheet({
  scopeType,
  scopeId,
  title = "Activity Logs",
  tooltip = "All the timeline logs for this scope. When it was created or updated. What was updated/created/deleted. The user/admin who took the action. Date and time",
  trigger,
}: ActivityLogsSheetProps) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [action, setAction] = useState("all");
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
      workspaceId: workspaceId ?? "",
      scopeType,
      scopeId,
      limit: 10,
      search: debouncedSearch.trim() || undefined,
      actions: action === "all" ? undefined : [action],
    }),
    [action, debouncedSearch, scopeId, scopeType, workspaceId],
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
  } = useGetAuditLogsInfinite(filters);

  const logs = data?.pages.flatMap((page) => page.result.logs) ?? [];

  const handleRefreshLogs = () => {
    void queryClient.invalidateQueries({ queryKey: ["audit-logs-infinite"] });
    void queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
            {trigger ?? <Button variant="outline">Open</Button>}
          </TooltipTrigger>
          <TooltipContent>
            Show Activity logs of this {scopeType}
          </TooltipContent>
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
          className="flex min-h-0 flex-1 flex-col pt-10"
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
                className="text-muted-foreground/60 text-xs"
                align="inline-end"
              >
                {search
                  ? `${logs.length} result${logs.length > 1 ? "s" : ""}`
                  : "0 results"}
              </InputGroupAddon>
            </InputGroup>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-auto shrink-0 truncate group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex min-w-0 items-center gap-1">
                      <Icon
                        icon={FilterVerticalIcon}
                        size={14}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-foreground"
                      />
                      <SelectValue placeholder="Action" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Filter logs by action</TooltipContent>
                </Tooltip>
              </SelectTrigger>
              <SelectContent container={portalContainer} className="z-110">
                {actionFilters.map((option) => (
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
                  <Icon
                    icon={Refresh04Icon}
                    size={14}
                    strokeWidth={2}
                    className={cn(
                      "transition-all delay-100 duration-200 ease-in-out",
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh logs</TooltipContent>
            </Tooltip>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            onScroll={handleScroll}
          >
            <ActivityLogsTimeline
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

export default ActivityLogsSheet;
