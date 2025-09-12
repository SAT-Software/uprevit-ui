import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddProductInBookmarkFolder {
  id: string;
  folder_id: string;
}

export function useAddProductInBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productBookmark: AddProductInBookmarkFolder) => {
      const res = await fetch(
        `/api/bookmarks/products/${productBookmark.folder_id}/${productBookmark.id}`,
        {
          method: "POST",
          body: JSON.stringify(productBookmark),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to add product in bookmark folder");
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
      console.error(
        error.message || "Failed to add product in bookmark folder"
      );
      toast.error(error.message || "Failed to add product in bookmark folder");
    },
  });
}
