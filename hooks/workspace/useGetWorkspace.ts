import { useQuery } from "@tanstack/react-query";

async function getWorkspaceById(id: string) {
  const response = await fetch(`/api/workspace/${id}`);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch workspace");
  }
  const data = await response.json();
  return data;
}

export function useGetWorkspace(id: string) {
  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => getWorkspaceById(id),
  });
}
