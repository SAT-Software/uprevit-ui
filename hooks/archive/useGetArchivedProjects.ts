import { useQuery } from "@tanstack/react-query";

async function getArchivedProjects({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/projects?isArchive=true", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
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
