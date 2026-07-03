"use client";

import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import DialogArchiveEntity from "@/features/workspace/archive/DialogArchiveEntity";
import ActivityLogsSheet from "@/features/workspace/common/ActivityLogsSheet";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import ProjectPageProductsTable from "@/features/workspace/projects/ProjectPageProductsTable";
import ShareProjectDialog from "@/features/workspace/projects/ShareProjectDialog";
import UpdateProjectDialog from "@/features/workspace/projects/UpdateProjectDialog";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { AuditLog } from "@/types/audit-log";
import { isAdminProfile } from "@/utils/isAdmin";
import { getNextImageSrc } from "@/utils/isNextImageSrc";
import {
  KanbanIcon,
  ManagerIcon,
  ProfileIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import {
  PiCalendarDuotone,
  PiKanbanDuotone,
  PiUserCircleGearDuotone,
} from "react-icons/pi";
import { useAuth } from "react-oidc-context";

interface ProjectUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const { data, isLoading, isError } = useGetProjectById(projectId);
  const project = data?.project;

  if (!projectId) return notFound();

  const projectImageSrc = project ? getNextImageSrc(project.image) : undefined;
  const auditLogs = project ? (project.auditLogs as AuditLog[]) || [] : [];
  const creationLog = auditLogs.find((log) => log.action === "create");
  const latestUpdateLog = auditLogs
    .filter((log) => log.action === "update")
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime(),
    )[0];

  const formatAuditDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2 w-full h-full">
        {isLoading ? (
          <ProjectDetailHeaderSkeleton />
        ) : isError || !project ? (
          <DashboardErrorState
            variant="panel"
            icon={KanbanIcon}
            title="Failed to load project"
            className="min-h-48"
          />
        ) : (
          <div className="flex flex-col items-start justify-between border-b border-border">
            <div className="flex flex-col md:flex-row gap-6 items-start w-full border-b p-2">
              <div className="relative h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl overflow-hidden border border-border bg-muted">
                {projectImageSrc ? (
                  <Image
                    src={projectImageSrc}
                    alt={`${project.project_name} cover image`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted/50">
                    <PiKanbanDuotone className="h-8 w-8 md:w-12 md:h-12 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 w-full min-w-0">
                <div className="flex flex-col gap-1">
                  <h1 className="text-base md:text-2xl font-bold text-foreground tracking-tight">
                    {project.project_name}
                  </h1>
                  <p className="text-base text-muted-foreground max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                    {project.project_description}
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col items-start md:items-end gap-2 text-xs text-muted-foreground">
                {creationLog && (
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                    <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      Created {formatAuditDate(creationLog.actionAt)} -{" "}
                      <span className="font-semibold">
                        {creationLog.actionBy}
                      </span>
                    </span>
                  </div>
                )}
                {latestUpdateLog && (
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                    <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      Updated {formatAuditDate(latestUpdateLog.actionAt)} -{" "}
                      <span className="font-semibold">
                        {latestUpdateLog.actionBy}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 w-full p-2">
                {isAdmin && (
                  <ActivityLogsSheet
                    scopeType="project"
                    scopeId={projectId}
                    title="Project Logs"
                    tooltip="All the timeline logs for this project. When it was created or updated. What was updated/created/deleted. The user/admin who took the action. Date and time"
                    trigger={
                      <Button type="button" variant="outline" size="sm">
                        <Icon
                          className="transition-colors delay-100 duration-200 ease-in-out"
                          icon={ProfileIcon}
                          size={16}
                          strokeWidth={2}
                        />
                        Logs
                      </Button>
                    }
                  />
                )}
                <UpdateProjectDialog project={project} />
                <ShareProjectDialog project={project} />
                <DialogArchiveEntity
                  id={projectId}
                  entityName={project.project_name}
                  entityType="project"
                />
              </div>

              <div className="w-full flex items-center justify-end gap-2 p-2">
                <HoverCard>
                  <HoverCardTrigger>
                    <Button
                      variant="outline"
                      className="text-muted-foreground/60 hover:text-muted-foreground"
                    >
                      <Icon
                        icon={ManagerIcon}
                        size={16}
                        strokeWidth={2}
                        className="transition-colors delay-100 duration-200 ease-in-out"
                      />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <PiUserCircleGearDuotone className="w-4 h-4" />
                      <span className="text-sm">
                        Manager:{" "}
                        <span className="text-foreground font-medium">
                          {project.project_manager || "N/A"}
                        </span>
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <div className="flex items-center gap-4">
                  {(() => {
                    const usersForDialog = (
                      (project.users as ProjectUser[]) || []
                    ).map((u: ProjectUser) => ({
                      _id: u._id,
                      name: u.name,
                      email: u.email,
                      profileAvatar: u.profileAvatar,
                    }));
                    return (
                      <MembersInlineTrigger
                        users={usersForDialog}
                        titlePrefix={project.project_name}
                        location="project"
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        <ProjectPageProductsTable projectId={projectId} />
      </div>
    </div>
  );
}

function ProjectDetailHeaderSkeleton() {
  return (
    <div className="flex flex-col items-start justify-between border-b border-border">
      <div className="flex flex-col md:flex-row gap-6 items-start w-full border-b p-2">
        <Skeleton className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl" />
        <div className="flex flex-col gap-4 w-full min-w-0">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-1/3 max-w-xs" />
            <Skeleton className="h-4 w-2/3 max-w-lg" />
          </div>
        </div>
        <div className="w-full flex flex-col items-start md:items-end gap-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-7 w-52 rounded-lg" />
        </div>
      </div>
      <div className="w-full flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 w-full p-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="w-full flex items-center justify-end gap-2 p-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex items-center -space-x-2">
            <Skeleton className="size-7 rounded-full border-2 border-background" />
            <Skeleton className="size-7 rounded-full border-2 border-background" />
            <Skeleton className="size-7 rounded-full border-2 border-background" />
          </div>
        </div>
      </div>
    </div>
  );
}
