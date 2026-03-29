"use client";

import DialogArchiveEntity from "@/features/workspace/archive/DialogArchiveEntity";
import { useGetDepartmentById } from "@/hooks/department/useGetDepartmentById";
import Image from "next/image";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PiCalendarDuotone,
  PiKanbanDuotone,
  PiBuildingsDuotone,
  PiUserCircleGearDuotone,
  PiClockCounterClockwiseDuotone,
} from "react-icons/pi";
import DepartmentPageProjectsTable from "@/features/workspace/departments/DepartmentPageProjectsTable";
import ShareDepartmentDialog from "@/features/workspace/departments/ShareDepartmentDialog";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import { Project } from "@/types/project";
import { AuditLog } from "@/types/audit-log";
import UpdateDepartmentDialog from "@/features/workspace/departments/UpdateDepartmentDialog";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { ActivityLogsPanel } from "@/features/workspace/logs/ActivityLogsPanel";

interface DepartmentUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export default function DepartmentDetailPage() {
  const params = useParams<{ departmentId: string }>();
  const departmentId = params?.departmentId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const activeTab = searchParams.get("tab") === "logs" && isAdmin ? "logs" : "overview";
  const isLogsView = activeTab === "logs";

  const { data, isLoading, isError } = useGetDepartmentById(departmentId);
  const { data: projectsData } = useGetAllProjects();

  const department = data?.department;
  const projects =
    projectsData?.result?.projects?.filter(
      (p: Project) => p.department_id === departmentId,
    ) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b p-6 border-border">
            <div className="flex flex-col md:flex-row gap-6 items-start w-full">
              {/* Image Skeleton */}
              <div className="h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-xl bg-muted animate-pulse" />

              {/* Info Skeleton */}
              <div className="flex flex-col gap-3 w-full min-w-0">
                <div className="flex flex-col gap-1">
                  <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-12 w-full max-w-2xl bg-muted rounded animate-pulse" />
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse -ml-2" />
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse -ml-2" />
                </div>
              </div>
            </div>

            {/* Actions & Meta Skeleton */}
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 w-full">
                <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
                <div className="h-7 w-52 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Projects Section Skeleton */}
          <div className="flex flex-col gap-2 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                <div className="w-1 h-1 bg-muted rounded-full" />
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="w-full">
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="h-12 bg-muted/50 border-b border-border" />
                <div className="flex flex-col divide-y divide-border">
                  <div className="h-14 bg-background animate-pulse" />
                  <div className="h-14 bg-background animate-pulse" />
                  <div className="h-14 bg-background animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !department) return notFound();

  const auditLogs = (department.auditLogs as AuditLog[]) || [];
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

  const handleLogsToggle = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (isLogsView) {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", "logs");
    }

    const query = nextParams.toString();
    router.replace(query ? `/departments/${departmentId}?${query}` : `/departments/${departmentId}`);
  };

  if (isLogsView) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">Department Logs</h1>
              <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                {department.department_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleLogsToggle}
                      aria-label="Show department overview"
                    >
                      <PiClockCounterClockwiseDuotone className="h-4 w-4" />
                      Logs
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show Overview</TooltipContent>
                </Tooltip>
              ) : null}
              <UpdateDepartmentDialog department={department} />
              <ShareDepartmentDialog department={department} />
              <DialogArchiveEntity
                id={departmentId ?? ""}
                entityName={department.department_name}
                entityType="department"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4">
            <ActivityLogsPanel
              scopeType="department"
              scopeId={departmentId}
              title="Department Logs"
              description={`Showing activity for ${department.department_name}.`}
              showHeader={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b p-6 border-border">
          <div className="flex flex-col md:flex-row gap-6 items-start w-full">
            {/* Image */}
            <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-xl overflow-hidden border border-border bg-muted shadow-sm">
              {department?.image ? (
                <Image
                  src={department.image}
                  alt={`${department.department_name} cover image`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted/50">
                  <PiKanbanDuotone className="w-12 h-12 text-muted-foreground/40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 w-full min-w-0">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {department.department_name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PiUserCircleGearDuotone className="w-4 h-4" />
                  <span className="text-sm">
                    Manager:{" "}
                    <span className="text-foreground font-medium">
                      {department.manager || "N/A"}
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                {department.department_description}
              </p>

              <div className="flex items-center gap-4 mt-1">
                {(() => {
                  const usersForDialog = (
                    (department.users as DepartmentUser[]) || []
                  ).map((u: DepartmentUser) => ({
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    profileAvatar: u.profileAvatar,
                  }));
                  return (
                    <MembersInlineTrigger
                      users={usersForDialog}
                      titlePrefix={department.department_name}
                    />
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Actions & Meta */}
          <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              {isAdmin ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLogsToggle}
                      aria-label="Show department logs"
                    >
                      <PiClockCounterClockwiseDuotone className="h-4 w-4" />
                      Logs
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show Logs</TooltipContent>
                </Tooltip>
              ) : null}
              <UpdateDepartmentDialog department={department} />
              <ShareDepartmentDialog department={department} />
              <DialogArchiveEntity
                id={departmentId ?? ""}
                entityName={department.department_name}
                entityType="department"
              />
            </div>

            {/* Audit Badges */}
            <div className="flex flex-col items-start md:items-end gap-2 text-xs text-muted-foreground w-full">
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
        </div>

        <div className="flex flex-col gap-2 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Projects</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Latest projects in this department
              </p>
            </div>
          </div>

          <div className="w-full">
            {projects.length > 0 ? (
              <DepartmentPageProjectsTable data={projects} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl bg-muted/10">
                <div className="flex items-center justify-center p-2 bg-muted/50 rounded-full mb-3">
                  <PiBuildingsDuotone className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No projects found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This department doesn&apos;t have any projects yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
