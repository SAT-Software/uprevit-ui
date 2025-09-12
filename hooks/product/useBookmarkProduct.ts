import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductBookmark {
  id: string;
  folder_id: string;
}

export function useBookmarkProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productBookmark: ProductBookmark) => {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify(productBookmark),
        headers: {
          "Content-Type": "application/json",
        },
      });
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
