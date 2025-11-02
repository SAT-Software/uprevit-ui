import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const res = await fetch(
        `/api/bookmarks/products/${folderId}?user_id=68d2b37127794dcb43a32425`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete bookmark folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: (data, folderId) => {
      toast.success("Bookmark folder deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["all-user-bookmark-folders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-in-bookmark-folder", folderId],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to delete bookmark folder");
      toast.error(error.message || "Failed to delete bookmark folder");
    },
  });
}
