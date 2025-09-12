import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UploadSourceFile = {
  file_name: string;
  url: string;
};

type UploadSourceFilesRequest = {
  folderId: string;
  files: UploadSourceFile[];
};

export function useUploadSourceFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folderId, files }: UploadSourceFilesRequest) => {
      const res = await fetch(`/api/sourceFiles/folders/${folderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to upload source files");
      }

      return res.json().catch(() => null);
    },
    onSuccess: (_data, variables) => {
      toast.success("Files uploaded successfully");
      // Invalidate folder details so UI can refresh
      queryClient.invalidateQueries({
        queryKey: ["source-files-folder", variables.folderId],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to upload source files");
      toast.error(error.message || "Failed to upload source files");
    },
  });
}
