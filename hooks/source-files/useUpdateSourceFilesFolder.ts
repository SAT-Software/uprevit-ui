import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface UpdateSourceFilesFolderRequest {
  id: string;
  name?: string;
  product_id?: string | null;
}

export function useUpdateSourceFilesFolder(folderId: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (sourceFilesFolder: UpdateSourceFilesFolderRequest) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const payload: Record<string, unknown> = {};
      if (typeof sourceFilesFolder.name === "string") {
        payload.name = sourceFilesFolder.name;
      }
      if (Object.prototype.hasOwnProperty.call(sourceFilesFolder, "product_id")) {
        payload.product_id = sourceFilesFolder.product_id;
      }

      const res = await fetch(
        `/api/source-files/folder/${sourceFilesFolder.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update source files folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Source files folder updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["current-source-files-folder", folderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["source-files-folders"],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to update source files folder");
      toast.error(error.message || "Failed to update source files folder");
    },
  });
}
