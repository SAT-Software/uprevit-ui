import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export function useProvisionInvite() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { email: string; name: string }) => {
      if (!isPlatformOperatorProfile(auth.user?.profile)) {
        throw new Error("Not a platform operator");
      }

      return fetchPlatformAdmin<{ email: string; cognitoSub: string }>(
        "/api/platform-admin/invites/provision",
        { auth, method: "POST", body: input },
      );
    },
    onSuccess: () => {
      toast.success("Organization admin invite sent");
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to send organization admin invite"));
    },
  });
}
