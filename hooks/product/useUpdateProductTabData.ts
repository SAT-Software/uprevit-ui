import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface UpdateProductTabDataParams {
  id: string;
  action: string;
  tab: string;
  data: object | object[];
}

export function useUpdateProductTabData() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (params: UpdateProductTabDataParams) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch("/api/products/productData", {
        method: "PATCH",
        body: JSON.stringify(params),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update product tab data");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Changes were saved successfully");
      queryClient.invalidateQueries({ queryKey: ["product-tab-data"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to make changes");
      toast.error("Failed to make changes");
    },
  });
}
