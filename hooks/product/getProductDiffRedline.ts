import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { deepDiff, DiffItem } from "@/utils/deepDiff";
import type { AllTabsData } from "@/types/product";

interface ProductDiffResult {
  result: {
    base_version: AllTabsData | null;
    next_version: AllTabsData | null;
    total_changes: number;
    diffs: DiffItem[];
  };
}

async function fetchProductData(
  productId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(
    `/api/products/productData?id=${productId}&tab=all-tabs`,
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
    throw new Error(text || "Failed to fetch product data");
  }
  const data = (await response.json()) as { result?: { data?: AllTabsData } };
  return data?.result?.data ?? null;
}

async function getProductDiffRedline({
  signal,
  auth,
  currentProductId,
  compareVersionId,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  currentProductId: string;
  compareVersionId: string;
}): Promise<ProductDiffResult> {
  // Fetch both versions in parallel
  const [currentData, compareData] = await Promise.all([
    fetchProductData(currentProductId, { signal, auth }),
    fetchProductData(compareVersionId, { signal, auth }),
  ]);

  // Compute diffs on the frontend
  // base_version = older version (compareVersion)
  // next_version = current/newer version
  const diffs = deepDiff(compareData, currentData);

  return {
    result: {
      base_version: compareData,
      next_version: currentData,
      total_changes: diffs.length,
      diffs,
    },
  };
}

/**
 * Hook to fetch product diff redline data with frontend diff computation
 * 
 * @param currentProductId - The ID of the current/latest product version being viewed
 * @param compareVersionId - The ID of the older version to compare against (from dropdown selection)
 */
export function useGetProductDiffRedline(
  currentProductId: string | undefined,
  compareVersionId: string | null | undefined
) {
  const auth = useAuth();

  // Enable only when we have both IDs and compareVersionId is set (user selected a version to compare)
  const isEnabled =
    auth.isAuthenticated &&
    !!currentProductId &&
    !!compareVersionId;

  return useQuery({
    queryKey: ["product-diff-redline", currentProductId, compareVersionId],
    queryFn: ({ signal }) =>
      getProductDiffRedline({
        signal,
        auth,
        currentProductId: currentProductId!,
        compareVersionId: compareVersionId!,
      }),
    enabled: isEnabled,
  });
}
