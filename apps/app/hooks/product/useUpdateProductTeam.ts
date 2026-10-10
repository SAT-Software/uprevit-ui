import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

type UpdateProductTeamProps = {
  productId: string;
  action: "set-owner" | "add-contributor" | "remove-contributor";
  userId: string;
};

const SUCCESS_MESSAGES: Record<UpdateProductTeamProps["action"], string> = {
  "set-owner": "Product Owner changed",
  "add-contributor": "Contributor added",
  "remove-contributor": "Contributor removed",
};

export function useUpdateProductTeam() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async ({ productId, ...body }: UpdateProductTeamProps) => {
      const res = await fetch(`/api/products/${productId}/team`, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to update product team"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: (_data, { action }) => {
      toast.success(SUCCESS_MESSAGES[action]);
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookmarked-products"] });
      queryClient.invalidateQueries({ queryKey: ["product-tab-data"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update product team"));
    },
  });
}
