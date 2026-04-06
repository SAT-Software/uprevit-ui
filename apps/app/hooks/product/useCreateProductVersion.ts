import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface CreateVersionResponse {
  message: string;
  product: {
    _id: string;
    version: number;
    is_latest: boolean;
    parent_id: string;
    status: string;
  };
}

export function useCreateProductVersion() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (productId: string): Promise<CreateVersionResponse> => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/products/${productId}/version`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create version (${res.status})`
        );
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Version ${data.product.version} created successfully`);
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create product version:", error.message);
      toast.error(error.message || "Failed to create new version");
    },
  });
}
