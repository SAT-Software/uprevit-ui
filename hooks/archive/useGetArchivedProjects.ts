import { useQuery } from "@tanstack/react-query";

async function getArchivedProjects({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/projects?isArchive=true", { signal });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch archived projects");
  }
  const data = await response.json();
  return data;
}

export function useGetArchivedProjects() {
  return useQuery({
    queryKey: ["archived-projects"],
    queryFn: ({ signal }) => getArchivedProjects({ signal }),
  });
}
