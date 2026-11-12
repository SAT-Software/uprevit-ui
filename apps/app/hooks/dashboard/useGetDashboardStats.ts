import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";

async function getDashboardStats({
  auth,
  signal,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
}) {
  const response = await fetch(
    `/api/dashboard?id=${auth?.user?.profile.workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`, // Add your authorization header here
        "Content-Type": "application/json", // Example of another header
      },
      signal,
    }
  );
  if (!response.ok) {
    throw await getResponseError(response, "Failed to fetch dashboard stats");
  }
  const data = await response.json();
  return data;
}

export function useGetDashboardStats() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: ({ signal }) => getDashboardStats({ auth, signal }),
    enabled: auth.isAuthenticated,
  });
}
