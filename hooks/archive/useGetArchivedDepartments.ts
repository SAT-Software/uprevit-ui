import { useQuery } from "@tanstack/react-query";

async function getArchivedDepartments({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/departments?isArchive=true", { signal });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch archived departments");
  }
  const data = await response.json();
  return data;
}

export function useGetArchivedDepartments() {
  return useQuery({
    queryKey: ["archived-departments"],
    queryFn: ({ signal }) => getArchivedDepartments({ signal }),
  });
}
