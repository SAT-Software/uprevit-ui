"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import Image from "next/image";
import Link from "next/link";
import { PiArrowSquareOutDuotone, PiKanbanDuotone } from "react-icons/pi";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";

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
    <div className="flex flex-col md:flex-row items-center border border-input w-full rounded-xl p-2 justify-start gap-4">
      <div className="flex items-center relative h-32 md:h-16 w-full md:w-28">
        <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
          <PiKanbanDuotone className="w-8 h-8 text-muted-foreground pulse-animation" />
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between w-full px-4 gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-18 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function ProjectEmptyState() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full min-h-[200px] py-8">
      <div className="flex items-center justify-center">
        <PiKanbanDuotone className="w-32 h-32 text-accent" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xs md:text-sm font-medium text-muted-foreground/70">
          No projects available
        </p>
      </div>
    </div>
  );
}

// Error State Component
function ProjectErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8">
      <div className="flex items-center justify-center">
        <PiKanbanDuotone className="w-12 h-12 text-destructive/60" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-base font-semibold text-foreground">
          Failed to load projects
        </p>
        <p className="text-sm text-muted-foreground">
          Please try again or contact support if the problem persists
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: ProjectProps }) {
  return (
    <div className="relative flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4">
      <div className="absolute right-2 top-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/projects/${project._id}`}
              aria-label="Open project details"
            >
              <Button variant="ghost" size="icon">
                <PiArrowSquareOutDuotone className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Open project details</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center relative h-32 md:h-16 w-full md:w-28">
        {project.image ? (
          <Image
            src={project.image}
            fill
            alt="Project"
            className="object-cover rounded-md border border-input"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
            <PiKanbanDuotone className="w-8 h-8 text-muted-foreground/60" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between w-full  gap-4">
        <div className="flex flex-col items-start gap-0.5">
          <p className="text-xs text-muted-foreground">
            {project.project_number}
          </p>
          <p className="text-sm md:text-base font-medium text-foreground">
            {project.project_name}
          </p>
        </div>

        <div className="absolute bottom-2 right-3 items-center -space-x-[0.525rem]">
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
  );
}

// Main Dashboard Projects Card Component
function DashboardProjectsCard() {
  const {
    data: projectsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllProjects();

  const projects = projectsData?.result?.projects ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Recent Projects</p>
          <Link href="/projects">
            <Button variant="outline" disabled>
              All Projects
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          {[...Array(3)].map((_, index) => (
            <ProjectLoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Recent Projects</p>
          <Link href="/projects">
            <Button variant="outline">All Projects</Button>
          </Link>
        </div>

        <ProjectErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  // Filter out the first 3 projects as requested
  const filteredProjects = (projects || [])?.slice(0, 3);

  return (
    <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <p className="text-base font-semibold">Recent Projects</p>
        <Link href="/projects">
          <Button variant="outline">All Projects</Button>
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
