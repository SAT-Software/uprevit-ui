import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getProductDiffRedline({
  signal,
  auth,
  productId,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  productId: string;
}) {
  const response = await fetch(`/api/products/${productId}/compare`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch products");
  }
  const data = await response.json();

  return data;
}

export function useGetProductDiffRedline(
  productId: string | undefined,
  enabled: boolean = true
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["product-diff-redline", productId],
    queryFn: ({ signal }) =>
      getProductDiffRedline({ signal, auth, productId: productId! }),
    enabled: auth.isAuthenticated && !!productId && enabled,
  });
}
