import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RemoveProductBookmark {
  user_id: string;
  product_id: string;
  folder_id: string;
}

export function useRemoveProductBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkData: RemoveProductBookmark) => {
      const res = await fetch(
        `/api/bookmarks/products/delete/${bookmarkData.folder_id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            user_id: bookmarkData.user_id,
            product_id: bookmarkData.product_id,
          }),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
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
