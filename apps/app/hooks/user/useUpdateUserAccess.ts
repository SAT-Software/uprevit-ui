import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";
import { invalidateBillingSummary } from "@/lib/invalidateBillingSummary";
import type { MemberAccess, MemberAccessBlockers } from "@/types/user";

export class MemberAccessBlockedError extends Error {
  constructor(
    message: string,
    public readonly blockers: MemberAccessBlockers,
  ) {
    super(message);
  }
}

export function useUpdateUserAccess() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;

  return useMutation({
    mutationFn: async ({
      userId,
      access,
    }: {
      userId: string;
      access: MemberAccess;
    }) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) throw new Error("User is not authenticated");

      const response = await fetch(`/api/users/${userId}/access`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(access),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof body.message === "string" && body.message
            ? body.message
            : "Failed to change member access";
        if (response.status === 409 && body.blockers) {
          throw new MemberAccessBlockedError(message, body.blockers);
        }
        throw new Error(message);
      }

      return body;
    },
    onSuccess: () => {
      toast.success("Member access updated");
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ["users", workspaceId] });
        queryClient.invalidateQueries({
          queryKey: ["users-infinite", workspaceId],
        });
      }
      invalidateBillingSummary(queryClient);
    },
    onError: (error) => {
      if (error instanceof MemberAccessBlockedError) return;
      toast.error(getErrorMessage(error, "Failed to change member access"));
    },
  });
}
