import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

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
        const text = await response.text().catch(() => "");
        throw new Error(text || "Failed to send invitations");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Invitations sent successfully");
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-users", workspaceId],
      });
    },
    onError: (error) => {
      console.error(error.message || "Failed to send invitations");
      toast.error("Failed to send invitations");
    },
  });
}
