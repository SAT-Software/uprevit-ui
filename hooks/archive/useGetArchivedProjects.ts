import { useQuery } from "@tanstack/react-query";

async function getArchivedProjects() {
  const response = await fetch("/api/projects?isArchive=true");
  const data = await response.json();
  return data;
}

export function useGetArchivedProjects() {
  return useQuery({
    queryKey: ["archived-projects"],
    queryFn: getArchivedProjects,
  });
}
