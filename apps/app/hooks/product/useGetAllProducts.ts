import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllProducts({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  console.log("auth", auth);
  const response = await fetch(
    `/api/products?workspaceId=${auth?.user?.profile?.workspaceId}`,
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

export function useGetAllProducts() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-products", auth.user?.profile?.workspaceId],
    queryFn: ({ signal }) => getAllProducts({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
