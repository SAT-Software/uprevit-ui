import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeleteSourceFilesFolder(folderId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const res = await fetch(`/api/source-files/${folderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete source files folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      router.push("/source-files");
      toast.success("Source files folder deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["source-files-folders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["source-files-folder", folderId],
      });

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
