import { Department } from "@/types/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (newDepartment: Department) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch("/api/departments", {
        method: "POST",
        body: JSON.stringify(newDepartment),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create department");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Department created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create department");
      toast.error("Failed to create department");
    },
  });
}
