import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import { invalidateBillingSummary } from "@/lib/invalidateBillingSummary";

type UploadSourceFilesRequest = {
  workspace_id: string;
  name: string;
  type: string;
  url?: string;
  key?: string;
  sizeBytes?: number;
  folderId: string;
  parentId: string;
};

export function useUploadSourceFiles(currentFolderId: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (data: UploadSourceFilesRequest) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/source-files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to upload source files"),
        );
      }

      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Files uploaded successfully");

      queryClient.invalidateQueries({
        queryKey: ["source-files-folder", currentFolderId],
      });
      invalidateBillingSummary(queryClient);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to upload source files");
      console.error(message);
      toast.error(message);
    },
  });
}
