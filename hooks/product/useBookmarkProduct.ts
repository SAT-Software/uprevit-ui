import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductBookmark {
  user_id: string;
  product_id: string;
  folder_id: string;
}

export function useBookmarkProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productBookmark: ProductBookmark) => {
      const res = await fetch(
        `/api/bookmarks/products/add/${productBookmark.folder_id}`,
        {
          method: "PATCH",
          body: JSON.stringify(productBookmark),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create bookmark product");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Bookmark product created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-bookmark-folders"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create bookmark product");
      toast.error(error.message || "Failed to create bookmark product");
    },
  });
}
