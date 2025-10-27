import { useQuery } from "@tanstack/react-query";

async function getUserById(id: string, { signal }: { signal: AbortSignal }) {
  const response = await fetch(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
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
