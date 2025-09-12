import { useQuery } from "@tanstack/react-query";

async function getProductTabData(
  productId: string,
  tabName: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(
    `/api/products/productData?id=${productId}&tab=${tabName}`,
    {
      signal,
    }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch product tab data");
  }
  const data = await response.json();
  return data;
}

export function useGetProductTabData(productId: string, tabName: string) {
  return useQuery({
    queryKey: ["product-tab-data", productId, tabName],
    queryFn: ({ signal }) => getProductTabData(productId, tabName, { signal }),
    enabled: Boolean(productId && tabName),
  });
}
