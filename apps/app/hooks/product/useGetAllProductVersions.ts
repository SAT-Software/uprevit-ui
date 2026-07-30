import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getProductVersions } from "@/hooks/product/getProductVersions";

export function useGetAllProductVersions(productId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-products", auth.user?.profile?.workspaceId, productId],
    queryFn: ({ signal }) => getProductVersions({ signal, auth, productId }),
    enabled: auth.isAuthenticated,
  });
}
