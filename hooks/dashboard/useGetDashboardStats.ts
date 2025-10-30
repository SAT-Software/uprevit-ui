import { useQuery } from "@tanstack/react-query";

async function getDashboardStats({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/dashboard?id=68d2be511ad93c69d6e39e51", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch dashboard stats");
  }
  const data = await response.json();
  return data;
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
}
