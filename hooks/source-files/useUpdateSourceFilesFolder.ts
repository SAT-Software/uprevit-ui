import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateSourceFilesFolderRequest {
  name: string;
  id: string;
}

export function useUpdateSourceFilesFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceFilesFolder: UpdateSourceFilesFolderRequest) => {
      const res = await fetch(`/api/source-files/${sourceFilesFolder.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: sourceFilesFolder.name,
        }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update source files folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Source files folder updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["source-files-folders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["source-files-folder-by-id"],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to update source files folder");
      toast.error(error.message || "Failed to update source files folder");
    },
  });
}
