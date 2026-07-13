"use client";

import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import { getNextImageSrc } from "@/utils/isNextImageSrc";
import { Calendar03Icon, KanbanIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface ProjectUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export interface ProjectProps {
  _id: string;
  image?: string;
  project_name: string;
  project_description: string;
  date?: string;
  project_manager?: string;
  users?: ProjectUser[];
  members?: { name: string; src: string }[];
  membersCount?: number;
  auditLogs?: { actionAt: string; action: string }[];
}

function ProjectCard({
  project,
  location,
}: {
  project: ProjectProps;
  location?: string;
}) {
  const projectImageSrc = getNextImageSrc(project.image);

  return (
    <div
      key={project._id}
      className={cn(
        "relative w-full",

        "border-b border-border",
        location === "dashboard" && "last:border-b-0",
      )}
    >
      <Link
        href={`/projects/${project._id}`}
        className={cn(
          "group relative flex flex-col md:flex-row items-start md:items-center w-full p-3 gap-4 transition-all delay-100 duration-200 ease-in-out",

          "rounded-none hover:bg-muted",
        )}
      >
        <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
          {projectImageSrc ? (
            <Image
              src={projectImageSrc}
              fill
              alt={project.project_name}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Icon
                icon={KanbanIcon}
                size={36}
                strokeWidth={2}
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
              <span className="truncate">{project.project_description}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="large">
                  <Icon icon={Calendar03Icon} size={14} strokeWidth={2} />
                  <span>
                    {project?.auditLogs?.[0]?.actionAt
                      ? formatToLocalDate(project?.auditLogs?.[0].actionAt)
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
          const users = usersData?.map(
            (user): ProjectUser => ({
              _id: user._id,
              name: user.name,
              email: user.email,
              profileAvatar: user.profileAvatar,
            }),
          );
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
  );
}

export default ProjectCard;
