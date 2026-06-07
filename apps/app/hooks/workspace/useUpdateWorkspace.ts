import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Workspace } from "@/types/workspace";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import { invalidateBillingSummary } from "@/lib/invalidateBillingSummary";

async function updateWorkspace(
  workspaceData: Workspace,
  {
    signal,
    accessToken,
  }: {
    signal: AbortSignal;
    accessToken: string;
  }
) {
  const response = await fetch(`/api/workspace`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workspaceData),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, "Failed to update workspace")
    );
  }

  const data = await response.json();
  return data;
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const workspaceId = auth.user?.profile.workspaceId;

  return useMutation({
    mutationFn: async (workspaceData: Workspace) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const controller = new AbortController();
      return updateWorkspace(
        { ...workspaceData, _id: workspaceId as string },
        {
          signal: controller.signal,
          accessToken,
        }
      );
    },
    onSuccess: () => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      invalidateBillingSummary(queryClient);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update workspace");
      console.error(message);
      toast.error(message);
    },
  });
}
