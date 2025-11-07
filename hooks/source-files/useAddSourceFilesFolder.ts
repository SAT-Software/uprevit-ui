import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddSourceFilesFolderRequest {
  workspace_id: string;
  name: string;
  type: string;
  parentId?: string;
}

export function useAddSourceFilesFolder(folderId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceFilesFolder: AddSourceFilesFolderRequest) => {
      const res = await fetch("/api/source-files", {
        method: "POST",
        body: JSON.stringify(sourceFilesFolder),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to add source files folder");
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
      console.error(error.message || "Failed to add source files folder");
      toast.error(error.message || "Failed to add source files folder");
    },
  });
}
