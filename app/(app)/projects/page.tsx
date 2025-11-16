"use client";

import ProjectsCard from "@/features/projects/ProjectsCard";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import DialogCreateProject from "@/features/projects/DialogCreateProject";

function ProjectsPage() {
  const { data, isLoading } = useGetAllProjects();

  const allProjects = data?.result?.projects ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Projects</p>
          <DialogCreateProject />
        </div>
        <ProjectsCard projects={allProjects} />
      </div>
    </div>
  );
}

export default ProjectsPage;
