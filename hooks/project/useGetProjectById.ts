import { useQuery } from "@tanstack/react-query";

async function getProjectById(id: string, { signal }: { signal: AbortSignal }) {
  const response = await fetch(`/api/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch project");
  }
  const data = await response.json();
  return data;
}

export function useGetProjectById(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: ({ signal }) => getProjectById(id, { signal }),
  });
}
