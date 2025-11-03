import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteSourceFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: string) => {
      const res = await fetch(`/api/sourceFiles`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileIds }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete source files");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Source files deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["source-files-folder"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to delete source files");
      toast.error(error.message || "Failed to delete source files");
    },
  });
}
