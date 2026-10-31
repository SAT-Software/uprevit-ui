import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";

export function analyticsSearchParams(filters: AnalyticsFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  return params;
}

async function getAnalytics({
  auth,
  filters,
  signal,
}: {
  auth: AuthContextProps;
  filters: AnalyticsFilters;
  signal: AbortSignal;
}): Promise<AnalyticsData> {
  const response = await fetch(
    `/api/analytics?${analyticsSearchParams(filters)}`,
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
    throw new Error(text || "Failed to fetch analytics");
  }
  const data = await response.json();
  return data.data;
}

export function useGetAnalytics(filters: AnalyticsFilters) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["analytics", auth.user?.profile?.workspaceId, filters],
    queryFn: ({ signal }) => getAnalytics({ auth, filters, signal }),
    enabled: auth.isAuthenticated,
  });
}
