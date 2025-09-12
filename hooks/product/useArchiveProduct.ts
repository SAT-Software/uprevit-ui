import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toast } from "sonner";

export function useArchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: true }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to archive product");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Product archived successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Need to review this in products integration time
      queryClient.invalidateQueries({ queryKey: ["product-list"] }); // Need to review this in products integration time
    },
    onError: (error) => {
      console.error(error.message || "Failed to archive product");
      toast.error("Failed to archive product");
    },
  });
}
