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
    workbooks = true,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
    workbooks?: boolean;
  }
) {
  const response = await fetch(
    `/api/products/productData?id=${productId}&tab=all-tabs${workbooks ? "" : "&workbooks=false"}`,
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
  if (!data.result?.data) throw new Error("This product version is unavailable");
  return data.result.data;
}

const imageTabs = ["symbols_graphics", "label_components", "label_tags"] as const;

async function resolveImageRowParents(
  current: AllTabsData,
  base: AllTabsData,
  compareVersionId: string,
  signal: AbortSignal,
  auth: AuthContextProps,
): Promise<AllTabsData> {
  const parents = new Map<string, string>();
  const rememberParents = (version: AllTabsData) => {
    for (const tab of imageTabs) {
      for (const row of version[tab].data) {
        const parentId = (row as { parent_id?: string }).parent_id;
        if (row._id && parentId) parents.set(row._id, parentId);
      }
    }
  };
  rememberParents(current);

  let parentId = current.product_information.product_data.data.parent_id;
  const visited = new Set<string>();
  while (parentId && parentId !== compareVersionId && !visited.has(parentId)) {
    visited.add(parentId);
    const version = await fetchProductData(parentId, { signal, auth, workbooks: false });
    rememberParents(version);
    parentId = version.product_information.product_data.data.parent_id;
  }
  if (parentId !== compareVersionId) return current;

  const result = { ...current };
  for (const tab of imageTabs) {
    const baseIds = new Set(base[tab].data.map((row) => row._id));
    const data = current[tab].data.map((row) => {
      let ancestor = row._id;
      const seen = new Set<string>();
      while (ancestor && !baseIds.has(ancestor) && !seen.has(ancestor)) {
        seen.add(ancestor);
        ancestor = parents.get(ancestor);
      }
      return ancestor && baseIds.has(ancestor) ? { ...row, parent_id: ancestor } : row;
    });
    // Each tab retains its own row shape; only comparison ancestry changes.
    Object.assign(result, { [tab]: { ...current[tab], data } });
  }
  return result;
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
  const nextData = await resolveImageRowParents(currentData, compareData, compareVersionId, signal, auth);
  const diffs = deepDiff(compareData, nextData);

  return {
    result: {
      base_version: compareData,
      next_version: nextData,
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
    retry: false,
  });
}
