import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditBookmarkFolderRequest {
  folderId: string;
  folder_name: string;
}

export function useEditBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderData: EditBookmarkFolderRequest) => {
      const res = await fetch(
        `/api/bookmarks/products/${folderData.folderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ folder_name: folderData.folder_name }),
          headers: {
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
