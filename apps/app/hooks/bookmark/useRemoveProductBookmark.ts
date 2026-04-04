import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface RemoveProductBookmark {
  user_id: string;
  product_id: string;
  folder_id: string;
}

export function useRemoveProductBookmark() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (bookmarkData: RemoveProductBookmark) => {
      if (!auth.user?.access_token) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(
        `/api/bookmarks/products/delete/${bookmarkData.folder_id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            user_id: bookmarkData.user_id,
            product_id: bookmarkData.product_id,
          }),
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Failed to remove product from bookmark folder"
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Product removed from bookmark folder successfully");
      queryClient.invalidateQueries({
        queryKey: ["products-in-bookmark-folder"],
      });
    },
    onError: (error) => {
      console.error(
        error.message || "Failed to remove product from bookmark folder"
      );
      toast.error(
        error.message || "Failed to remove product from bookmark folder"
      );
    },
  });
}
