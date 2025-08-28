import { useQuery } from "@tanstack/react-query";

async function getProjectById(id: string) {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch project");
  }
  const data = await response.json();
  return data;
}

export function useGetProjectById(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
  });
}
