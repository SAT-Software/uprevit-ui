import { Department } from "@/types/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    onSuccess: async (data, variables) => {
      console.log("Department updated successfully", data, variables);
      queryClient.invalidateQueries({
        queryKey: ["department", variables._id],
      });
    },
  });
}
