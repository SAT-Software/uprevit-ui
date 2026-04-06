import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllProductVersions({
  signal,
  auth,
  productId,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  productId: string;
}) {
  console.log("auth", auth);
  const response = await fetch(
    `/api/products/versions?workspaceId=${auth?.user?.profile?.workspaceId}&id=${productId}`,
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
    throw new Error(text || "Failed to fetch products");
  }
  const data = await response.json();

  return data;
}

export function useGetAllProductVersions(productId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-products", auth.user?.profile?.workspaceId, productId],
    queryFn: ({ signal }) => getAllProductVersions({ signal, auth, productId }),
    enabled: auth.isAuthenticated,
  });
}
