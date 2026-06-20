import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export function useInviteWorkspaceMembers() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const workspaceId = auth.user?.profile.workspaceId;

  return useMutation({
    mutationFn: async (users: { name: string; email: string }[]) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) throw new Error("User is not authenticated");

      if (!workspaceId) throw new Error("Workspace ID not found");

      const response = await fetch(`/api/invites/workspace/${workspaceId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
      });

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to send invitations")
        );
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      const results = data?.data as Array<{ status?: string }> | undefined;
      const reactivatedCount = results?.filter(
        (result) => result.status === "Reactivated",
      ).length ?? 0;
      const invitedCount = results?.filter(
        (result) => result.status === "Success",
      ).length ?? 0;

      if (reactivatedCount > 0 && invitedCount === 0) {
        toast.success(
          reactivatedCount === 1
            ? "Member reactivated successfully"
            : `${reactivatedCount} members reactivated successfully`,
        );
      } else if (reactivatedCount > 0) {
        toast.success("Invitations sent and members reactivated");
      } else {
        toast.success("Invitations sent successfully");
      }

      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["users-infinite", workspaceId],
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to send invitations");
      console.error(message);
      toast.error(message);
    },
  });
}
