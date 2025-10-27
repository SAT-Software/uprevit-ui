import { useQuery } from "@tanstack/react-query";

async function getAllProjects({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/projects", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch projects");
  }
  const data = await response.json();
  return data;
}

export function useGetAllProjects() {
  return useQuery({
    queryKey: ["all-projects"],
    queryFn: ({ signal }) => getAllProjects({ signal }),
  });
}
