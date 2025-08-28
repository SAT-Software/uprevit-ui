import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { CalendarClock, Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PiKanbanDuotone, PiPlusBold } from "react-icons/pi";

// Update component to accept projects prop and use ProjectsProps
function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col items-start w-full gap-2 h-full">
      {projects?.map((project) => (
        <Link
          key={project._id}
          href={`/projects/${project._id}`}
          className="flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4"
        >
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
              <div className="flex items-center -space-x-[0.525rem]">
                {project?.users?.map((user: string) => (
                  <Image
                    key={user}
                    className="ring-background rounded-full ring-2"
                    src={user}
                    width={28}
                    height={28}
                    alt={user}
                  />
                ))}
                <p className="text-xs text-muted-foreground ml-4">
                  {project?.users?.length} Members
                </p>
              </div>
            </div>
          </div>
        </Link>
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
export default Projects; // Ensure default export matches component name
