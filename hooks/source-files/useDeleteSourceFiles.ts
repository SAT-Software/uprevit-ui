import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteSourceFiles(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: string) => {
      const res = await fetch(`/api/source-files/${fileIds}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete source files");
      }
      return res.json().catch(() => null);
    },
    onSuccess: (data, variables) => {
      toast.success("Source files deleted successfully");
      console.log(data);
      console.log(variables);
      queryClient.invalidateQueries({
        queryKey: ["source-files-folder", slug],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to delete source files");
      toast.error(error.message || "Failed to delete source files");
    },
  });
}
