import { useQuery } from "@tanstack/react-query";

async function getDepartmentById(
  id: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/departments/${id}`, {
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

export function useGetDepartmentById(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: ({ signal }) => getDepartmentById(id, { signal }),
  });
}
