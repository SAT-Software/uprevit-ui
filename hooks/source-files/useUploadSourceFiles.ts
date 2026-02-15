import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

type UploadSourceFilesRequest = {
  workspace_id: string;
  name: string;
  type: string;
  url?: string;
  key?: string;
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
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to upload source files");
      }

      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Files uploaded successfully");

      queryClient.invalidateQueries({
        queryKey: ["source-files-folder", currentFolderId],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to upload source files");
      toast.error(error.message || "Failed to upload source files");
    },
  });
}
