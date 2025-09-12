import { useQuery } from "@tanstack/react-query";

async function getUserById(id: string, { signal }: { signal: AbortSignal }) {
  const response = await fetch(`/api/users/${id}`, { signal });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch user");
  }
  const data = await response.json();
  return data;
}

export function useGetUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: ({ signal }) => getUserById(id, { signal }),
  });
}
