import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PiKanbanDuotone } from "react-icons/pi";

// Place this at the top of ProjectsCard.tsx, outside the component

export type Project = {
  id: string;
  image: string;
  projectNumber: string;
  projectName: string;
  department: string;
};

function ProjectsCard({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <p className="text-base font-semibold">Recent Projects</p>
        <Link href="/projects">
          <Button variant="outline">All Projects</Button>
        </Link>
      </div>
      <div className="flex flex-col items-start gap-2 w-full">
        {projects?.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="flex flex-col md:flex-row  items-center border border-input w-full rounded-xl p-2 justify-start gap-4"
          >
            <div className="flex items-center relative h-32 md:h-16 w-full md:w-28 ">
              {project.image ? (
                <Image
                  src={project.image}
                  fill
                  alt="Department"
                  className="object-cover rounded-md border border-input"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
                  <PiKanbanDuotone className="w-8 h-8 text-muted-foreground/60" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-start justify-between w-full px-4 gap-4">
              <div className="flex flex-col items-start gap-1">
                <p className="flex items-start gap-1 text-xs text-muted-foreground">
                  Project Number
                </p>
                <p className="text-sm font-medium">{project.projectNumber}</p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="flex items-start gap-1 text-xs text-muted-foreground">
                  Project Name
                </p>
                <p className="text-sm font-medium">{project.projectName}</p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="flex items-start gap-1 text-xs text-muted-foreground">
                  Department
                </p>
                <p className="text-sm font-medium">{project.department}</p>
              </div>
            </div>
          </Link>
        ))}
        {projects?.length === 0 && (
          <div className="flex items-center justify-center w-full min-h-32">
            <p className="text-xs text-muted-foreground">
              There are no projects to display Create your first project
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProjectsCard;
