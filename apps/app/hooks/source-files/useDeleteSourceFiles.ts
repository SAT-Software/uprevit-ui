import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export function useDeleteSourceFiles(slug: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (fileIds: string) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/source-files/${fileIds}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to delete source files"),
        );
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
      const message = getErrorMessage(error, "Failed to delete source files");
      console.error(message);
      toast.error(message);
    },
  });
}
