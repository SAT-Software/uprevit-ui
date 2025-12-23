import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface UpdateLabelTaggedImageParams {
  productId: string;
  labelTagId: string;
  taggedImage: string;
}

export function useUpdateLabelTaggedImage() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (params: UpdateLabelTaggedImageParams) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const requestBody = {
        id: params.productId,
        tab: "label-tags",
        action: "update_label_tag_tagged_image",
        data: {
          id: params.labelTagId,
          tagged_image: params.taggedImage,
        },
      };

      const res = await fetch("/api/products/productData", {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update tagged image");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Tagged image saved successfully");
      queryClient.invalidateQueries({ queryKey: ["product-tab-data"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to save tagged image");
      toast.error("Failed to save tagged image");
    },
  });
}
