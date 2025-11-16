import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { CalendarClock, Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PiKanbanDuotone, PiPlusBold } from "react-icons/pi";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiArrowSquareOutDuotone } from "react-icons/pi";

// Update component to accept projects prop and use ProjectsProps
function ProjectsCard({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col items-start w-full gap-2 h-full">
      {projects?.map((project) => (
        <div
          key={project._id}
          className="relative flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4"
        >
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
          <div className="flex items-center relative w-full h-27 md:w-40 ">
            {project.image ? (
              <Image
                src={project.image}
                fill
                alt="Project" // Update alt text
                className="object-cover rounded-md border border-input"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
                <PiKanbanDuotone className="w-8 h-8 text-muted-foreground/60" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start justify-between w-full gap-4">
            <div className="flex flex-col items-start gap-1">
              <p className="text-base font-semibold">{project.project_name}</p>
              <p className="flex items-start gap-1 text-xs text-muted-foreground">
                <span>
                  <Text className="mr-1 w-4 h-4" />
                </span>
                {project.project_description}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between w-full gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>
                  <CalendarClock className="mr-1 w-4 h-4" />
                </span>
                <p className="text-xs text-muted-foreground">
                  {project.actionAt
                    ? new Date(project.actionAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex items-center -space-x-[0.525rem] mr-3">
                {(() => {
                  const users = (project.users || []).map(
                    (u: string, i: number) => ({
                      _id: String(u ?? i),
                      id: String(u ?? i),
                      name: `User ${i + 1}`,
                      email: `user${i + 1}@example.com`,
                      role: "Member",
                      avatarUrl: u,
                    })
                  );
                  return (
                    <MembersInlineTrigger
                      users={users}
                      titlePrefix={project.project_name}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Add empty state for projects */}
      {projects?.length === 0 && (
        <div className="flex flex-col gap-4 items-center justify-center w-full h-100">
          <p className="text-base md:text-xl font-semibold text-foreground">
            There are no projects to display. Create your first project
          </p>
          <Button variant="default" className="flex items-center gap-2">
            Create new Project <PiPlusBold />
          </Button>
        </div>
      )}
    </div>
  );
}
export default ProjectsCard; // Ensure default export matches component name
