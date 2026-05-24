import { Department } from "@/types/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (updatedDepartment: Department) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/departments/`, {
        method: "PUT",
        body: JSON.stringify(updatedDepartment),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to update department"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: (data, variables) => {
      toast.success("Department updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["department", variables._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-departments"],
      });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update department");
      console.error(message);
      toast.error(message);
    },
  });
}
