import Projects from "@/features/projects/ProjectsCard";
import CreateProjectDialog from "@/features/projects/CreateProjectDialog";
import { projects } from "./data";



function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Projects</p>
          <CreateProjectDialog />
        </div>
        <Projects projects={projects} />
      </div>
    </div>
  );
}

export default ProjectsPage;
