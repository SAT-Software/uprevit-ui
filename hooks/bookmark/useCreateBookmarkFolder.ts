import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateBookmarkFolderRequest {
  folder_name: string;
}

export function useCreateBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBookmarkFolder: CreateBookmarkFolderRequest) => {
      const res = await fetch("/api/bookmarks/products", {
        method: "POST",
        body: JSON.stringify(newBookmarkFolder),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create bookmark folder");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Bookmark folder created successfully");
      queryClient.invalidateQueries({
        queryKey: ["all-user-bookmark-folders"],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create bookmark folder");
      toast.error(error.message || "Failed to create bookmark folder");
    },
  });
}
