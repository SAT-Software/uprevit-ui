"use client";

import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import { DialogUpdateWorkspace } from "./DialogUpdateWorkspace";
import {
  AlertCircleIcon,
  DashboardSquareSettingIcon,
  Copy01Icon,
  CrownIcon,
  IdentityCardIcon,
  IdCardLanyardIcon,
  TextAlignLeftIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Button } from "@uprevit/ui/components/ui/button";
import { toast } from "sonner";
import { cn } from "@uprevit/ui/lib/utils";

const WORKSPACE_FIELDS = [
  {
    id: "workspaceName",
    label: "Workspace Name",
    icon: DashboardSquareSettingIcon,
    key: "workspaceName" as const,
    span: 1,
  },
  {
    id: "companyName",
    label: "Company Name",
    icon: IdentityCardIcon,
    key: "companyName" as const,
    span: 1,
  },
  {
    id: "plan",
    label: "Plan",
    icon: CrownIcon,
    key: "plan" as const,
    span: 1,
    getValue: () => "NA",
  },
  {
    id: "userCount",
    label: "User Count",
    icon: UserGroupIcon,
    key: "userCount" as const,
    span: 1,
  },
  {
    id: "description",
    label: "Workspace Description",
    icon: TextAlignLeftIcon,
    key: "description" as const,
    span: 1,
  },
] as const;

const workspaceFieldCellClassName = (index: number, span: number) =>
  cn(
    "group flex items-start gap-4 p-4",
    "border-b border-border md:[&:nth-last-child(-n+2)]:border-b-0 [&:last-child]:border-b-0",
    index % 2 === 0 && span === 1 && "md:border-r",
    span === 2 && "md:col-span-2",
  );

function WorkspaceTab() {
  const {
    data,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useGetWorkspace();
  const { data: workspaceUserData } = useGetAllUsersByWorkspace({
    page: 1,
    limit: 1,
  });

  const workspaceData = data?.workspace;
  const workspaceId = workspaceData?._id ?? "";
  const displayWorkspaceId =
    workspaceId.length > 12
      ? `${workspaceId.slice(0, 6)}...${workspaceId.slice(-4)}`
      : workspaceId;
  const userCount = workspaceUserData?.result?.pagination?.totalCount ?? 0;

  const copyWorkspaceId = async () => {
    if (!workspaceId) return;

    try {
      await navigator.clipboard.writeText(workspaceId);
      toast.success("Workspace ID copied");
    } catch (error) {
      console.error("Failed to copy workspace ID:", error);
      toast.error("Failed to copy workspace ID");
    }
  };

  const getFieldValue = (field: (typeof WORKSPACE_FIELDS)[number]) => {
    if ("getValue" in field && field.getValue) {
      return field.getValue();
    }
    if (field.key === "userCount") {
      return String(userCount);
    }
    const value = workspaceData?.[field.key as keyof typeof workspaceData];
    return typeof value === "string" ? value : "-";
  };

  if (workspaceLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-7 w-32 rounded-md" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex h-10 items-center border-b border-border pl-3">
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {WORKSPACE_FIELDS.map((field, index) => (
              <div
                key={field.id}
                className={workspaceFieldCellClassName(index, field.span)}
              >
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (workspaceError) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
          <Icon icon={AlertCircleIcon} size={18} strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
          <div className="text-sm font-medium">Failed to load workspace</div>
          <div className="text-sm text-muted-foreground">
            {workspaceError?.message || "An unexpected error occurred"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-background p-4">
        <Avatar className="size-16">
          <AvatarImage
            src={workspaceData?.logo}
            alt={workspaceData?.workspaceName}
          />
          <AvatarFallback className="border border-border bg-accent text-base">
            {workspaceData?.workspaceName
              ?.split(" ")
              .map((word: string) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold">
            {workspaceData?.workspaceName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your workspace settings and organization details.
          </p>
        </div>
        <DialogUpdateWorkspace workspaceData={workspaceData} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border pl-3 pr-2">
          <p className="text-sm font-medium">Workspace Information</p>
          <InfoTooltip content="Organization details and identifiers for your workspace." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className={workspaceFieldCellClassName(0, 1)}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
              <Icon icon={IdCardLanyardIcon} size={18} strokeWidth={2} />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-normal text-muted-foreground/60">
                Workspace ID
              </p>
              <div className="flex items-center gap-1.5">
                <p className="truncate font-mono text-sm font-medium">
                  {displayWorkspaceId || "-"}
                </p>
                {workspaceId ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    onClick={copyWorkspaceId}
                    aria-label="Copy workspace ID"
                  >
                    <Icon icon={Copy01Icon} size={14} strokeWidth={2} />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {WORKSPACE_FIELDS.map((field, index) => (
            <div
              key={field.id}
              className={workspaceFieldCellClassName(index + 1, field.span)}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground">
                <Icon icon={field.icon} size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-normal text-muted-foreground/60">
                  {field.label}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    field.id === "description" && "whitespace-pre-wrap",
                    field.id !== "description" && "truncate",
                  )}
                >
                  {getFieldValue(field) || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceTab;
