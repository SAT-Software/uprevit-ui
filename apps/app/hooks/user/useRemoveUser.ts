import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import { invalidateBillingSummary } from "@/lib/invalidateBillingSummary";

async function removeUser(
  userId: string,
  {
    signal,
    accessToken,
  }: {
    signal: AbortSignal;
    accessToken: string;
  },
) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, "Failed to remove user"),
    );
  }

  return response.json();
}

export function useRemoveUser() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;

  return useMutation({
    mutationFn: async (userId: string) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const controller = new AbortController();
      return removeUser(userId, {
        signal: controller.signal,
        accessToken,
      });
    },
    onSuccess: () => {
      toast.success("User removed from workspace");
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ["users", workspaceId] });
        queryClient.invalidateQueries({
          queryKey: ["users-infinite", workspaceId],
        });
      }
      invalidateBillingSummary(queryClient);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to remove user");
      console.error(message);
      toast.error(message);
    },
  });
}
