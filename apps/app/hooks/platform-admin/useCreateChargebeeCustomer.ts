import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";

export function useCreateChargebeeCustomer(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input?: { email?: string }) =>
      fetchPlatformAdmin<{ customerId: string }>(
        `/api/platform-admin/workspaces/${workspaceId}/chargebee/customer`,
        { auth, method: "POST", body: input ?? {} },
      ),
    onSuccess: () => {
      toast.success("Chargebee customer created");
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create Chargebee customer"));
    },
  });
}
