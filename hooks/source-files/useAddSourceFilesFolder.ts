import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddSourceFilesFolderRequest {
  product_id: string;
  name: string;
}

export function useAddSourceFilesFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceFilesFolder: AddSourceFilesFolderRequest) => {
      const res = await fetch("/api/sourceFiles/folders", {
        method: "POST",
        body: JSON.stringify(sourceFilesFolder),
        headers: {
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
    },
    onError: (error) => {
      console.error(error.message || "Failed to add source files folder");
      toast.error(error.message || "Failed to add source files folder");
    },
  });
}
