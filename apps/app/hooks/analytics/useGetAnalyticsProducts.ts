import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { analyticsSearchParams } from "@/hooks/analytics/useGetAnalytics";
import type {
  AnalyticsFilters,
  AnalyticsProduct,
} from "@/types/analytics";
import type { WorkspaceListPagination } from "@/types/user";

const ANALYTICS_PRODUCTS_LIMIT = 50;

type AnalyticsProductsQuery = AnalyticsFilters & {
  metric: string;
  value?: string;
};

type AnalyticsProductsPage = {
  data: AnalyticsProduct[];
  pagination: WorkspaceListPagination;
};

async function getAnalyticsProducts({
  auth,
  query,
  page,
  signal,
}: {
  auth: AuthContextProps;
  query: AnalyticsProductsQuery;
  page: number;
  signal: AbortSignal;
}): Promise<AnalyticsProductsPage> {
  const params = analyticsSearchParams(query);
  params.set("page", String(page));
  params.set("limit", String(ANALYTICS_PRODUCTS_LIMIT));
  const response = await fetch(
    `/api/analytics/products?${params}`,
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
  const { data, pagination } = await response.json();
  return { data, pagination };
}

export function useGetAnalyticsProducts(
  query: AnalyticsProductsQuery,
  page: number,
) {
  const auth = useAuth();

  return useQuery({
    queryKey: [
      "analytics-products",
      auth.user?.profile?.workspaceId,
      query,
      page,
    ],
    queryFn: ({ signal }) =>
      getAnalyticsProducts({ auth, query, page, signal }),
    placeholderData: keepPreviousData,
    enabled: auth.isAuthenticated,
  });
}
