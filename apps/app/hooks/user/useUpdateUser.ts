import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import { invalidateBillingSummary } from "@/lib/invalidateBillingSummary";

async function updateUser(
  userData: Partial<User>,
  {
    signal,
    accessToken,
  }: {
    signal: AbortSignal;
    accessToken: string;
  }
) {
  const response = await fetch(`/api/users`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, "Failed to update user")
    );
  }

  const data = await response.json();
  return data;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const userId = auth.user?.profile?.userId as string;

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const controller = new AbortController();
      return updateUser(userData, {
        signal: controller.signal,
        accessToken,
      });
    },
    onSuccess: (data) => {
      toast.success("User updated successfully");
      const workspaceId = auth.user?.profile?.workspaceId;
      queryClient.invalidateQueries({ queryKey: ["user"] });
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ["users", workspaceId] });
        queryClient.invalidateQueries({
          queryKey: ["users-infinite", workspaceId],
        });
      }
      if (data?.user?.id) {
        queryClient.setQueryData(["user", userId], data);
      }
      invalidateBillingSummary(queryClient);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update user profile");
      console.error(message);
      toast.error(message);
    },
  });
}
