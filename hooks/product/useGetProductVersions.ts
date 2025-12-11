import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

interface ProductVersion {
  _id: string;
  version: number;
  is_latest: boolean;
  parent_id: string | null;
  status: "draft" | "submitted" | "archived";
  product_name?: string;
  version_created_at?: string;
}

interface GetVersionsResponse {
  message: string;
  versions: ProductVersion[];
}

/**
 * Fetches all versions of a product.
 * The backend should return all products with the same product_plan_number/workspace_id
 * or use parent_id chain to find related versions.
 */
export function useGetProductVersions(productId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["product-versions", productId],
    queryFn: async ({ signal }): Promise<GetVersionsResponse> => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`/api/products/${productId}/versions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch versions (${response.status})`
        );
      }

      return response.json();
    },
    enabled: Boolean(productId) && auth.isAuthenticated,
  });
}
