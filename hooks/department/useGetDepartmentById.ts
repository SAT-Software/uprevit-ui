import { useQuery } from "@tanstack/react-query";

async function getDepartmentById(
  id: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/departments/${id}`, { signal });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch department");
  }
  const data = await response.json();
  return data;
}

export function useGetDepartmentById(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: ({ signal }) => getDepartmentById(id, { signal }),
  });
}
