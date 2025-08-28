import { useQuery } from "@tanstack/react-query";

async function getProjectById(id: string) {
  const response = await fetch(`/api/projects/${id}`);
  const data = await response.json();
  return data;
}

export function useGetProjectById(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
  });
}
