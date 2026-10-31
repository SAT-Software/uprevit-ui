import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { analyticsSearchParams } from "@/hooks/analytics/useGetAnalytics";
import type {
  AnalyticsFilters,
  AnalyticsProduct,
} from "@/types/analytics";

type AnalyticsProductsQuery = AnalyticsFilters & {
  metric: string;
  value?: string;
};

async function getAnalyticsProducts({
  auth,
  query,
  signal,
}: {
  auth: AuthContextProps;
  query: AnalyticsProductsQuery;
  signal: AbortSignal;
}): Promise<AnalyticsProduct[]> {
  const response = await fetch(
    `/api/analytics/products?${analyticsSearchParams(query)}`,
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
    throw new Error(text || "Failed to fetch analytics products");
  }
  const data = await response.json();
  return data.data;
}

export function useGetAnalyticsProducts(query: AnalyticsProductsQuery) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["analytics-products", auth.user?.profile?.workspaceId, query],
    queryFn: ({ signal }) => getAnalyticsProducts({ auth, query, signal }),
    enabled: auth.isAuthenticated,
  });
}
