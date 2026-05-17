import { Product } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (newProduct: Product) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to create product"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to create product");
      console.error(message);
      toast.error(message);
    },
  });
}
