import { useQuery } from "@tanstack/react-query";

async function getProductDataTab(
  productId: string,
  productTab: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(
    `/api/products/productData?id=${productId}&tab=${productTab}`,
    {
      signal,
    }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch product data tab");
  }
  const data = await response.json();
  console.log("data in hook", data);
  return data;
}

export function useGetProductDataTab(productId: string, productTab: string) {
  return useQuery({
    queryKey: ["product-data-tab", productId, productTab],
    queryFn: ({ signal }) =>
      getProductDataTab(productId, productTab, { signal }),
    enabled: Boolean(productId && productTab),
  });
}
