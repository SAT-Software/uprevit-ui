"use client";

import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DialogUpdateWorkspace } from "./DialogUpdateWorkspace";
import {
  PiBuildingsDuotone,
  PiIdentificationCardDuotone,
  PiTagDuotone,
  PiCrownDuotone,
  PiUsersDuotone,
  PiTextAlignLeftDuotone,
  PiPlanetDuotone,
  PiBriefcaseDuotone,
} from "react-icons/pi";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";

function WorkspaceTab() {
  const { data, isLoading, error } = useGetAllUsersByWorkspace();
  const workspaceData = data?.workspace;

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message}</div>;

  if (!workspaceData) return <div>No workspace data found.</div>;

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
            <AvatarFallback className="text-lg bg-white border border-border">
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
            <h2 className="text-xl font-semibold">
              {workspaceData?.workspaceName}
            </h2>
            <Badge variant="default">
              {workspaceData?.planName || "Enterprise"}
            </Badge>
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
              <div className="text-sm font-medium">
                {workspaceData?.plan || "Pro"}
              </div>
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
                {workspaceData?.userIds?.length || 1}
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
