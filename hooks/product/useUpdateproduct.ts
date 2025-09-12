import { Product } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedProduct: Product) => {
      const res = await fetch("/api/products", {
        method: "PUT",
        body: JSON.stringify(updatedProduct),
        headers: {
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
    },
    onError: (error) => {
      console.error(error.message || "Failed to update product");
      toast.error("Failed to update product");
    },
  });
}
