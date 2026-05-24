"use client";

import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import Image from "next/image";
import Link from "next/link";
import {
  PiArrowCircleUpRightDuotone,
  PiCalendarDuotone,
  PiKanbanDuotone,
} from "react-icons/pi";

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
}

// Loading State Component
function ProjectLoadingCard() {
  return (
    <div className="flex flex-col md:flex-row items-center w-full border border-border bg-card rounded-xl p-3 gap-4">
      <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg bg-muted animate-pulse" />
      <div className="flex flex-col flex-1 gap-2 w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="flex items-center justify-between w-full gap-4 mt-1">
          <div className="h-6 bg-muted rounded w-24 animate-pulse" />
          <div className="h-6 bg-muted rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function ProjectEmptyState() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-border rounded-xl bg-muted/30">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-border">
        <PiKanbanDuotone className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">No projects found</p>
        <p className="text-xs text-muted-foreground">
          Get started by creating a new project
        </p>
      </div>
    </div>
  );
}

// Error State Component
function ProjectErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
        <PiKanbanDuotone className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-destructive">
          Failed to load projects
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
        Try Again
      </Button>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: ProjectProps }) {
  return (
    <div className="group relative flex flex-col md:flex-row items-start md:items-center w-full border border-border bg-card rounded-xl p-3 gap-4">
      <div className="absolute right-3 top-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/projects/${project._id}`}
              aria-label="Open project details"
            >
              <button className="cursor-pointer">
                <PiArrowCircleUpRightDuotone className="h-4 w-4" />
              </button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Open project details</TooltipContent>
        </Tooltip>
      </div>

      <Link
        href={`/projects/${project._id}`}
        className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg overflow-hidden border border-border bg-muted"
      >
        {project.image ? (
          <Image
            src={project.image}
            fill
            alt={project.project_name}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <PiKanbanDuotone className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <Link href={`/projects/${project._id}`} className="flex flex-col gap-0">
          <p className="text-sm font-semibold text-foreground truncate pr-8">
            {project.project_name}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1">
            <span className="truncate">{project.project_description}</span>
          </p>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <Link
            href={`/projects/${project._id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50"
          >
            <PiCalendarDuotone className="w-3.5 h-3.5" />
            <span>
              {project.date ? formatToLocalDate(project.date) : "No due date"}
            </span>
          </Link>

          <div className="flex items-center -space-x-2">
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
                />
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Projects Card Component
function DashboardProjectsCard() {
  const {
    data: projectsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllProjects({ limit: 5, sort: "actionAt", order: "desc" });

  const projects = projectsData?.result?.projects ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Projects</p>
          <Link href="/projects">
            <Button size="sm" variant="secondary">
              <PiArrowCircleUpRightDuotone />
              Show All
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          {[...Array(2)].map((_, index) => (
            <ProjectLoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Projects</p>
          <Link href="/projects">
            <Button size="sm" variant="secondary">
              <PiArrowCircleUpRightDuotone />
              Show All
            </Button>
          </Link>
        </div>

        <ProjectErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  // Filter out the first 2 projects to match department card size/layout
  const filteredProjects = (projects || [])?.slice(0, 2);

  return (
    <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Projects</p>
          <div className="w-1 h-1 bg-border border border-border rounded-full" />
          <p className="text-xs text-muted-foreground font-medium">
            Latest projects of your workspace
          </p>
        </div>
        <Link href="/projects">
          <Button size="sm" variant="secondary">
            <PiArrowCircleUpRightDuotone />
            Show All
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-start gap-2 w-full">
        {filteredProjects.length === 0 ? (
          <ProjectEmptyState />
        ) : (
          filteredProjects.map((project: ProjectProps) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardProjectsCard;
