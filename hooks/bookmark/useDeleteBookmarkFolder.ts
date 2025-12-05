import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

export function useDeleteBookmarkFolder() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId as string;

  return useMutation({
    mutationFn: async (folderId: string) => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(
        `/api/bookmarks/products/${folderId}?user_id=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
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
