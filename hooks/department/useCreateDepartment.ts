import { Department } from "@/types/department";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDepartment: Department) => {
      const res = await fetch("/api/departments", {
        method: "POST",
        body: JSON.stringify(newDepartment),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create department");
      }
      return res.json().catch(() => null);
    },
    onSuccess: async (data) => {
      console.log("Department created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
    },
  });
}
