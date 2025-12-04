"use client";

import ProjectsCard from "@/features/workspace/projects/ProjectsCard";
import CreateProjectDialog from "@/features/workspace/projects/CreateProjectDialog";

function ProjectsPage() {
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">All Projects</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Manage and view all projects in your workspace
            </p>
          </div>
          <CreateProjectDialog />
        </div>
        <ProjectsCard />
      </div>
    </div>
  );
}

export default ProjectsPage;
