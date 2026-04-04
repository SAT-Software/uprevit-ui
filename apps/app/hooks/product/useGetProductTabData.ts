import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getProductTabData(
  productId: string,
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
    `/api/products/productData?id=${productId}&tab=${tabName}`,
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
    throw new Error(text || "Failed to fetch product tab data");
  }
  const data = await response.json();
  return data;
}

export function useGetProductTabData(productId: string, tabName: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["product-tab-data", productId, tabName],
    queryFn: ({ signal }) =>
      getProductTabData(productId, tabName, { signal, auth }),
    enabled: Boolean(productId && tabName) && auth.isAuthenticated,
  });
}
