"use client";

import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import DialogArchiveEntity from "@/features/archive/DialogArchiveEntity";
import { Item } from "@/features/products/ProductsPageProductTable";
import DialogUpdateProject from "@/features/projects/DialogUpdateProject";
import DialogShareProject from "@/features/projects/DialogShareProject";
import ProjectPageProductsTable from "@/features/projects/ProjectPageProductsTable";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { AuditLog } from "@/types/audit-log";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import {
  PiCalendarDuotone,
  PiKanbanDuotone,
  PiTextAlignJustifyDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PiArrowLeftDuotone } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";

interface ProjectUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  const { data, isLoading, isError } = useGetProjectById(projectId);
  const { data: productsData } = useGetAllProducts();

  const project = data?.project;

  // Transform products data to match ProjectPageProductsTable format
  const projectProducts = (productsData?.result?.products || []).filter(
    (product: Item) => product.project_id === projectId
  );

  if (isLoading || !project) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6">
          Loading project...
        </div>
      </div>
    );
  }

  if (isError) return notFound();

  const auditLogs = (project.auditLogs as AuditLog[]) || [];
  const creationLog = auditLogs.find((log) => log.action === "create");
  const latestUpdateLog = auditLogs
    .filter((log) => log.action === "update")
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime()
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
    <div className="p-4">
      <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg">
        <div className="relative h-64 w-full rounded-t-lg overflow-hidden mb-6">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.project_name} cover image`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted rounded-t-md">
              <PiKanbanDuotone className="w-24 h-24 text-muted-foreground/60" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex space-x-1 bg-background/80 rounded">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => window.history.back()} variant="ghost">
                  <PiArrowLeftDuotone size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go Back</TooltipContent>
            </Tooltip>
          </div>
          <div className="absolute top-2 right-2 flex space-x-1 bg-background/80 rounded">
            <DialogUpdateProject project={project} />
            <DialogShareProject project={project} />
            <DialogArchiveEntity
              id={projectId}
              entityName={project.project_name}
              entityType="project"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-4 py-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{project.project_name}</h1>

            {/* Manager Name */}
            <div className="flex items-center space-x-2">
              <PiUserDuotone className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-600">
                Manager:{" "}
                <span className="font-medium">{project.project_manager}</span>
              </p>
            </div>

            {/* Description */}
            <p className="flex items-center gap-2 text-muted-foreground">
              <PiTextAlignJustifyDuotone className="w-5 h-5" />
              {project.project_description}
            </p>

            <div className="flex items-center space-x-2">
              {(() => {
                const usersForDialog = project.users.map((u: ProjectUser) => ({
                  _id: u._id,
                  name: u.name,
                  email: u.email,
                  profileAvatar: u.profileAvatar,
                }));
                return (
                  <MembersInlineTrigger
                    users={usersForDialog}
                    titlePrefix={project.project_name}
                  />
                );
              })()}
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex w-full max-w-md flex-col items-end gap-3">
              {creationLog || latestUpdateLog ? (
                <div className="flex w-full flex-col gap-3">
                  {creationLog && (
                    <div className="flex flex-col items-end rounded-xl  bg-background/90 p-4 text-right shadow-sm">
                      <Badge variant="outline">Created</Badge>
                      <div className="mt-3 flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <PiUserDuotone className="h-4 w-4 text-muted-foreground" />
                          <p>
                            <span className="text-muted-foreground">By</span>{" "}
                            <span className="font-medium">
                              {creationLog.actionBy}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <PiCalendarDuotone className="h-4 w-4" />
                          <p>
                            <span className="text-muted-foreground">At</span>{" "}
                            <time dateTime={creationLog.actionAt}>
                              {formatAuditDate(creationLog.actionAt)}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {latestUpdateLog && (
                    <div className="flex flex-col items-end rounded-xl  bg-background/90 p-4 text-right shadow-sm">
                      <Badge variant="secondary">Last Updated</Badge>
                      <div className="mt-3 flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <PiUserDuotone className="h-4 w-4 text-muted-foreground" />
                          <p>
                            <span className="text-muted-foreground">By</span>{" "}
                            <span className="font-medium">
                              {latestUpdateLog.actionBy}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <PiCalendarDuotone className="h-4 w-4" />
                          <p>
                            <span className="text-muted-foreground">At</span>{" "}
                            <time dateTime={latestUpdateLog.actionAt}>
                              {formatAuditDate(latestUpdateLog.actionAt)}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  No audit history available yet.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 mt-6">
          <h2 className="text-xl font-semibold mt-6">Products</h2>
          <ProjectPageProductsTable data={projectProducts} />
        </div>
      </div>
    </div>
  );
}
