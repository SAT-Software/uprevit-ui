import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface EditBookmarkFolderRequest {
  folderId: string;
  folder_name: string;
}

export function useEditBookmarkFolder() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (folderData: EditBookmarkFolderRequest) => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(
        `/api/bookmarks/products/${folderData.folderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            user_id: auth?.user?.profile.userId,
            folder_name: folderData.folder_name,
          }),
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to edit bookmark folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Bookmark folder updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["all-user-bookmark-folders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-in-bookmark-folder"],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to edit bookmark folder");
      toast.error(error.message || "Failed to edit bookmark folder");
    },
  });
}
