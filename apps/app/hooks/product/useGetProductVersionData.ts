import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getProductVersionData(
  versionId: string,
  tabName: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(
    `/api/products/productData?id=${versionId}&tab=${tabName}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch version data");
  }
  const data = await response.json();
  return data;
}

/**
 * Hook to fetch product data for a specific version
 * Used for fetching older versions when doing redline comparison
 */
export function useGetProductVersionData(
  versionId: string | null | undefined,
  tabName: string
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["product-version-data", versionId, tabName],
    queryFn: ({ signal }) =>
      getProductVersionData(versionId!, tabName, { signal, auth }),
    enabled: Boolean(versionId && tabName) && auth.isAuthenticated,
  });
}

