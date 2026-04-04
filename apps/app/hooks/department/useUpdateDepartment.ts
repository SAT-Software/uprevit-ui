import { Department } from "@/types/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

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
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update department");
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
      console.error(error.message || "Failed to update department");
      toast.error("Failed to update department");
    },
  });
}
