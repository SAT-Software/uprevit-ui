import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "../user/useGetUser";
import { useGetWorkspace } from "../workspace/useGetWorkspace";
import { toast } from "sonner";

interface ToggleBookmarkSourceFilesFolderRequest {
  folderId: string;
  userId: string;
}

export function useToggleBookmarkSourceFilesFolder() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { data: userData } = useGetUser();
  const { data: workspaceData } = useGetWorkspace();

  return useMutation({
    mutationFn: async (payload: ToggleBookmarkSourceFilesFolderRequest) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/bookmarks/source-files`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userData?.user?._id,
          workspace_id: workspaceData?.workspace?._id,
          folder_id: payload.folderId,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
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
