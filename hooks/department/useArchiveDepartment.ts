import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

export function useArchiveDepartment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (departmentId: string) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/departments/${departmentId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: true }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to archive department");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Department archived successfully");
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
      router.push("/archive");
    },
    onError: (error) => {
      console.error(error.message || "Failed to archive department");
      toast.error("Failed to archive department");
    },
  });
}
