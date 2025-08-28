import { Department } from "@/types/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedDepartment: Department) => {
      const res = await fetch(`/api/departments/`, {
        method: "PUT",
        body: JSON.stringify(updatedDepartment),
        headers: {
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
    },
    onError: (error) => {
      console.error(error.message || "Failed to update department");
      toast.error("Failed to update department");
    },
  });
}
