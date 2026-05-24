import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

interface AddSourceFilesFolderRequest {
  workspace_id: string;
  name: string;
  type: string;
  parentId?: string;
  product_id?: string | null;
}

export function useAddSourceFilesFolder(folderId?: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (sourceFilesFolder: AddSourceFilesFolderRequest) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch("/api/source-files", {
        method: "POST",
        body: JSON.stringify(sourceFilesFolder),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to add source files folder"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Source files folder added successfully");

      queryClient.invalidateQueries({
        queryKey: ["source-files-folders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["source-files-folder", folderId],
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to add source files folder");
      console.error(message);
      toast.error(message);
    },
  });
}
