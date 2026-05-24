import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

interface ProductBookmark {
  user_id: string;
  product_id: string;
  folder_id: string;
}

export function useBookmarkProduct() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (productBookmark: ProductBookmark) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(
        `/api/bookmarks/products/add/${productBookmark.folder_id}`,
        {
          method: "PATCH",
          body: JSON.stringify(productBookmark),
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to create bookmark product"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Bookmark product created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-bookmark-folders"] });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to create bookmark product");
      console.error(message);
      toast.error(message);
    },
  });
}
