import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ToggleBookmarkSourceFilesFolderRequest {
  folderId: string;
  userId: string;
}

export function useToggleBookmarkSourceFilesFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ToggleBookmarkSourceFilesFolderRequest) => {
      const res = await fetch(
        `/api/bookmarks/sourceFiles/${payload.folderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            user_id: payload.userId,
            workspace_id: "68a1ce212cb63e45ad511684",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Failed to toggle bookmark for source files folder"
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: (_data, variables) => {
      toast.success("Updated folder bookmark");
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-source-files-folders", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["source-files-folders"],
      });
    },
    onError: (error) => {
      console.error(
        error.message || "Failed to toggle bookmark for source files folder"
      );
      toast.error(
        error.message || "Failed to toggle bookmark for source files folder"
      );
    },
  });
}
