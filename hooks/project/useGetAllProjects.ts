import { useQuery } from "@tanstack/react-query";

async function getAllProjects() {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch projects");
  }
  const data = await response.json();
  return data;
}

export function useGetAllProjects() {
  return useQuery({
    queryKey: ["all-projects"],
    queryFn: getAllProjects,
  });
}
