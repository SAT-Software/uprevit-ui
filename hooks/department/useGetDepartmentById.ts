import { useQuery } from "@tanstack/react-query";

async function getDepartmentById(
  departmentId: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/departments/${departmentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch department");
  }
  const data = await response.json();
  return data;
}

export function useGetDepartmentById(departmentId: string) {
  return useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ signal }) => getDepartmentById(departmentId, { signal }),
  });
}
