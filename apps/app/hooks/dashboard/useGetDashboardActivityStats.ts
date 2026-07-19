import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

export type DashboardActivityBreakdown = {
  created_only: number;
  updated_only: number;
  both: number;
  total: number;
};

export type DashboardArchiveActivityBreakdown = {
  departments: number;
  projects: number;
  products: number;
  total: number;
};

export type DashboardActivityStats = {
  window_days: number;
  departments: DashboardActivityBreakdown;
  projects: DashboardActivityBreakdown;
  products: DashboardActivityBreakdown;
  source_files: DashboardActivityBreakdown;
  archives: DashboardArchiveActivityBreakdown;
};

async function getDashboardActivityStats({
  auth,
  signal,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
}) {
  const response = await fetch(
    `/api/dashboard/activity?id=${auth?.user?.profile.workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch dashboard activity stats");
  }

  const data = (await response.json());
  return data;
}

export function useGetDashboardActivityStats() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["dashboard-activity-stats"],
    queryFn: ({ signal }) => getDashboardActivityStats({ auth, signal }),
    enabled: auth.isAuthenticated,
  });
}
