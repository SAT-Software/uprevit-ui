import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "../user/useGetUser";
import { useGetWorkspace } from "../workspace/useGetWorkspace";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

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
        throw new Error(
          await getResponseErrorMessage(
            res,
            "Failed to toggle bookmark for source files folder",
          ),
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
      const message = getErrorMessage(
        error,
        "Failed to toggle bookmark for source files folder",
      );
      console.error(message);
      toast.error(message);
    },
  });
}
