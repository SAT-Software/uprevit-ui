import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteSourceFilesFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const res = await fetch(`/api/sourceFiles/folders/${folderId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete source files folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Source files folder deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["source-files-folders"] });
      // Also invalidate any bookmarked source-file folders queries regardless of user id
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "bookmarked-source-files-folders",
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to delete source files folder");
      toast.error(error.message || "Failed to delete source files folder");
    },
  });
}
