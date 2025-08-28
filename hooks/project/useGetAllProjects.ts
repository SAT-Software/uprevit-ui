import { useQuery } from "@tanstack/react-query";

async function getAllProjects() {
  const response = await fetch("/api/projects");
  const data = await response.json();
  return data;
}

export function useGetAllProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });
}
