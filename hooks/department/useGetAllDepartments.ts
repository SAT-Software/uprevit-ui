import { useQuery } from "@tanstack/react-query";

async function getAllDepartments({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/departments", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch departments");
  }
  const data = await response.json();
  return data;
}

export function useGetAllDepartments() {
  return useQuery({
    queryKey: ["all-departments"],
    queryFn: getAllDepartments,
  });
}
