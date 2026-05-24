import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

interface AddProductInBookmarkFolder {
  user_id: string;
  product_id: string;
  folder_id: string;
}

export function useAddProductInBookmarkFolder() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (productBookmark: AddProductInBookmarkFolder) => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(
        `/api/bookmarks/products/add/${productBookmark.folder_id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            user_id: productBookmark.user_id,
            product_id: productBookmark.product_id,
          }),
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(
            res,
            "Failed to add product in bookmark folder",
          ),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Product added in bookmark folder successfully");
      queryClient.invalidateQueries({
        queryKey: ["products-in-bookmark-folder"],
      });
    },
    onError: (error) => {
      const message = getErrorMessage(
        error,
        "Failed to add product in bookmark folder",
      );
      console.error(message);
      toast.error(message);
    },
  });
}
