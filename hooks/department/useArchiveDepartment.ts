import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useArchiveDepartment() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (departmentId: string) => {
      const res = await fetch(`/api/departments/${departmentId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: true }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to archive department");
      }
      return res.json().catch(() => null);
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
      console.log("Department archived successfully", data);
      router.push("/archive");
    },
  });
}
