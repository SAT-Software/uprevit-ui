"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  KanbanIcon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { DashboardErrorState, DASHBOARD_CARDS_ERROR_MIN_HEIGHT } from "./DashboardErrorState";

interface ProjectUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export interface ProjectProps {
  _id: string;
  image?: string;
  project_name: string;
  project_number?: string;
  project_description: string;
  date?: string;
  project_manager?: string;
  users?: ProjectUser[];
  members?: { name: string; src: string }[];
  membersCount?: number;
  auditLogs?: { actionAt: string; action: string }[];
}

function DashboardProjectsCard() {
  const {
    data: projectsData,
    isLoading,
    isError,
  } = useGetAllProjects({ limit: 5, sort: "actionAt", order: "desc" });

  const projects = projectsData?.result?.projects ?? [];

  if (isLoading) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 justify-start px-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1 items-start gap-0 overflow-hidden">
            <div className="flex gap-2 items-center">
              <p className="shrink-0 text-base font-semibold">Projects</p>
              <InfoTooltip
                content="Projects is between departments and products. Each project
                  belongs to one department and holds multiple products"
              />
            </div>
            <p className="truncate text-sm font-normal text-muted-foreground/80">
              Latest projects of your workspace
            </p>
          </div>
          <Link href="/projects" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <Icon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>

        <div className="flex w-full min-w-0 flex-col items-start gap-2">
          {[...Array(2)].map((_, index) => (
            <ProjectLoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 justify-start px-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1 items-start gap-0 overflow-hidden">
            <div className="flex gap-2 items-center">
              <p className="shrink-0 text-base font-semibold">Projects</p>
              <InfoTooltip
                content="Projects is between departments and products. Each project
                  belongs to one department and holds multiple products"
              />
            </div>
            <p className="truncate text-sm font-normal text-muted-foreground/80">
              Latest projects of your workspace
            </p>
          </div>
          <Link href="/projects" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <Icon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>

        <DashboardErrorState
          variant="panel"
          icon={KanbanIcon}
          title="Failed to load projects"
          className={DASHBOARD_CARDS_ERROR_MIN_HEIGHT}
        />
      </div>
    );
  }

  const filteredProjects = (projects || [])?.slice(0, 2);

  if (filteredProjects.length === 0)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-border rounded-xl bg-muted/30">
        <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
          <Icon icon={KanbanIcon} size={16} strokeWidth={2} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            No projects found
          </p>
          <p className="text-xs text-muted-foreground">
            Get started by creating a new project
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 justify-start px-4">
      <div className="flex w-full min-w-0 items-center justify-between gap-2">
        <div className="flex flex-col min-w-0 flex-1 items-start gap-0 overflow-hidden">
          <div className="flex gap-2 items-center">
            <p className="shrink-0 text-base font-semibold">Projects</p>
            <InfoTooltip
              content="Projects is between departments and products. Each project
                  belongs to one department and holds multiple products"
            />
          </div>
          <p className="truncate text-sm font-normal text-muted-foreground/80">
            Latest projects of your workspace
          </p>
        </div>
        <Link href="/projects" className="shrink-0 group">
          <Button size="sm" variant="secondary">
            Show All
            <Icon
              icon={ArrowUpRight01Icon}
              size={16}
              strokeWidth={2}
              className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
            />
          </Button>
        </Link>
      </div>

      <div className="flex w-full min-w-0 flex-col items-start gap-2">
        {filteredProjects.map((project: ProjectProps) => (
          <div key={project._id} className="relative w-full">
            <Link
              key={project._id}
              href={`/projects/${project._id}`}
              className="group relative flex flex-col md:flex-row items-start md:items-center w-full border border-border bg-card rounded-2xl p-3 gap-4 hover:ring-2 hover:ring-border/60 hover:border-border transition-all delay-100 duration-200 ease-in-out"
            >
              <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                {project.image ? (
                  <Image
                    src={project.image}
                    fill
                    alt={project.project_name}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Icon
                      icon={KanbanIcon}
                      size={38}
                      strokeWidth={1.5}
                      className="text-muted-foreground/40"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 gap-1 min-w-0">
                <div className="flex flex-col gap-0">
                  <p className="text-sm font-semibold text-foreground truncate pr-8">
                    {project.project_name}
                  </p>
                  <p className="flex items-center w-2/3 gap-1.5 text-xs text-muted-foreground line-clamp-1">
                    <span className="truncate">
                      {project.project_description}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="large">
                        <Icon
                          icon={Calendar03Icon}
                          size={14}
                          strokeWidth={2}
                        />
                        <span>
                          {project?.auditLogs?.[0]?.actionAt
                            ? formatToLocalDate(
                                project?.auditLogs?.[0].actionAt,
                              )
                            : "No activity"}
                        </span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Project created date or last modified date</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </Link>

            <div className="absolute flex items-center bottom-3 right-3">
              {(() => {
                const usersData = project?.users;
                const users = usersData?.map((user) => ({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  profileAvatar: user.profileAvatar,
                }));
                return (
                  <MembersInlineTrigger
                    users={users || []}
                    titlePrefix={project.project_name}
                    location="Project"
                  />
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectLoadingCard() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center w-full border border-border rounded-2xl p-3 gap-4">
        <Skeleton className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg" />
        <div className="flex flex-col flex-1 gap-1 min-w-0 w-full">
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute flex items-center bottom-3 right-3">
        <div className="flex items-center -space-x-2">
          <Skeleton className="size-7 rounded-full border-2 border-background" />
          <Skeleton className="size-7 rounded-full border-2 border-background" />
          <Skeleton className="size-7 rounded-full border-2 border-background" />
        </div>
      </div>
    </div>
  );
}

export default DashboardProjectsCard;
