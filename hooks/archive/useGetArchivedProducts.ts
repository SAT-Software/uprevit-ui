import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getArchivedProducts({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const response = await fetch(
    `/api/products?workspaceId=${auth?.user?.profile?.workspaceId}&status=archived`,
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
    throw new Error(text || "Failed to fetch archived products");
  }
  const data = await response.json();

  console.log("archived products", data);
  return data;
}

export function useGetArchivedProducts() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["archived-products"],
    queryFn: ({ signal }) => getArchivedProducts({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
