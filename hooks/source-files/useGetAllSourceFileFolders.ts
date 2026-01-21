import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllSourceFileFolders({
  signal,
  auth,
  productId,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  productId?: string;
}) {
  const workspaceId = auth?.user?.profile?.workspaceId;
  const params = new URLSearchParams({
    workspaceId: typeof workspaceId === "string" ? workspaceId : "",
  });

  if (productId) {
    params.set("productId", productId);
  }

  const res = await fetch(
    `/api/source-files?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to fetch source files folders");
  }
  return res.json();
}

export function useGetAllSourceFileFolders(productId?: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["source-files-folders", productId || "all"],
    queryFn: ({ signal }) => getAllSourceFileFolders({ signal, auth, productId }),
    enabled: auth.isAuthenticated,
  });
}
