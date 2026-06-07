import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import type { EnforcementMode } from "@/types/billing";

export function useUpdateBillingPreferences() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { enforcementMode: EnforcementMode }) => {
      const token = auth.user?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("/api/billing/preferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to update billing preferences"),
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Billing preferences updated");
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update billing preferences"));
    },
  });
}
