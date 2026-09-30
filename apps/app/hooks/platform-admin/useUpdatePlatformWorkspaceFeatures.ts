import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";

export function useUpdatePlatformWorkspaceFeatures(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { approvalWorkflowsEnabled: boolean }) =>
      fetchPlatformAdmin(
        `/api/platform-admin/workspaces/${workspaceId}/features`,
        { auth, method: "POST", body: input },
      ),
    onSuccess: () => {
      toast.success("Workspace features updated");
      return queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update workspace features"));
    },
  });
}
