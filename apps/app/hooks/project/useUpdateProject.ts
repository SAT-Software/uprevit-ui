import { Project } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import { invalidateBillingSummary } from "@/lib/invalidateBillingSummary";

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (updatedProject: Project) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/projects/`, {
        method: "PUT",
        body: JSON.stringify(updatedProject),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to update project"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: (data, variables) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project", variables._id],
      });
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
      invalidateBillingSummary(queryClient);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update project");
      console.error(message);
      toast.error(message);
    },
  });
}
