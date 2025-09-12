import { useQuery } from "@tanstack/react-query";

async function getWorkspaceById(
  id: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/workspace/${id}`, { signal });
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
    queryFn: ({ signal }) => getWorkspaceById(id, { signal }),
  });
}
