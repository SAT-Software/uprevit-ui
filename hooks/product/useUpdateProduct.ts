import { Product } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

type UpdateProductProps = Partial<Product> & {
  action?: string;
  data?: any;
  [key: string]: any;
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
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update product");
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
      console.error(error.message || "Failed to update product");
      toast.error("Failed to update product");
    },
  });
}
