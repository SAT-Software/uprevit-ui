import { useQuery } from "@tanstack/react-query";
import {
  buildListSearchParams,
  ListQueryParams,
} from "@/lib/workspace-list-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllBookmarkedProducts({
  signal,
  auth,
  query,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  query?: ListQueryParams;
}) {
  const params = buildListSearchParams(
    auth.user?.profile?.workspaceId as string | undefined,
    query,
  );
  const response = await fetch(
    `/api/bookmarks/products/all?${params.toString()}`,
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
    throw new Error(text || "Failed to fetch bookmarked products");
  }
  const data = await response.json();

  return data;
}

export function useGetAllBookmarkedProducts(
  query?: ListQueryParams,
  enabled = true,
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-bookmarked-products", auth.user?.profile?.workspaceId, query],
    queryFn: ({ signal }) => getAllBookmarkedProducts({ signal, auth, query }),
    enabled: auth.isAuthenticated && enabled,
  });
}
