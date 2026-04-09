"use client";

import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import { Avatar, AvatarFallback, AvatarImage } from "@uprevit/ui/components/ui/avatar";
import { DialogUpdateWorkspace } from "./DialogUpdateWorkspace";
import {
  PiIdentificationCardDuotone,
  PiTagDuotone,
  PiCrownDuotone,
  PiUsersDuotone,
  PiTextAlignLeftDuotone,
  PiBriefcaseDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

function WorkspaceTab() {
  const {
    data,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useGetWorkspace();
  const { data: workspaceUserData } = useGetAllUsersByWorkspace();

  const workspaceData = data?.workspace;

  if (workspaceLoading) {
    return (
      <div className="space-y-6">
        {/* Workspace Header Skeleton */}
        <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Workspace Information Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 border rounded-xl bg-background/50 ${
                  i === 4 ? "md:col-span-2" : ""
                }`}
              >
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-4 w-32" />
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
      <div className="flex items-center gap-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
        <div className="p-2.5 bg-destructive/10 rounded-lg shrink-0">
          <PiWarningCircleDuotone className="w-5 h-5 text-destructive" />
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
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={workspaceData?.logo}
              alt={workspaceData?.workspaceName}
            />
            <AvatarFallback className="text-lg bg-background border border-border">
              {workspaceData?.workspaceName
                ?.split(" ")
                .map((word: string) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold">{workspaceData?.workspaceName}</h2>
          </div>
          <p className="text-muted-foreground">
            Manage your workspace settings and organization details.
          </p>
        </div>
        <div>
          <DialogUpdateWorkspace workspaceData={workspaceData} />
        </div>
      </div>

      {/* Workspace Information Read-Only View */}
      <div className="space-y-4">
        <div className="font-medium text-lg">Workspace Information</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiBriefcaseDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Workspace Name
              </div>
              <div className="text-sm font-medium">
                {workspaceData?.workspaceName || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiIdentificationCardDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Company Name
              </div>
              <div className="text-sm font-medium">
                {workspaceData?.companyName || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiTagDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Company ID
              </div>
              <div className="text-sm font-medium">
                {workspaceData?.companyId || "123456"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiCrownDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Plan
              </div>
              <div className="text-sm font-medium">NA</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiUsersDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                User Count
              </div>
              <div className="text-sm font-medium">
                {workspaceUserData?.data?.length || 1}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors md:col-span-2">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiTextAlignLeftDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Workspace Description
              </div>
              <div className="text-sm font-medium whitespace-pre-wrap">
                {workspaceData?.description || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceTab;
