import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

interface CreateBookmarkFolderRequest {
  folder_name: string;
}

export function useCreateBookmarkFolder() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (newBookmarkFolder: CreateBookmarkFolderRequest) => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch("/api/bookmarks/products", {
        method: "POST",
        body: JSON.stringify(newBookmarkFolder),
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to create bookmark folder"),
        );
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
      const message = getErrorMessage(error, "Failed to create bookmark folder");
      console.error(message);
      toast.error(message);
    },
  });
}
