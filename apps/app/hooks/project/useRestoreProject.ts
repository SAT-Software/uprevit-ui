import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export function useRestoreProject() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: false }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to restore project"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Project restored successfully");
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
      queryClient.invalidateQueries({ queryKey: ["archived-projects"] });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to restore project");
      console.error(message);
      toast.error(message);
    },
  });
}
