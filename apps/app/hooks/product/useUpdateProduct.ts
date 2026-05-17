import { Product } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

type UpdateProductProps = Partial<Product> & {
  action?: string;
  data?: unknown;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (updatedProduct: UpdateProductProps) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/products/${updatedProduct._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedProduct),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to update product"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      queryClient.invalidateQueries({ queryKey: ["archived-products"] });
      queryClient.invalidateQueries({ queryKey: ["product-tab-data"] });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update product");
      console.error(message);
      toast.error(message);
    },
  });
}
