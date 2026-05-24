import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

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
        throw new Error(
          await getResponseErrorMessage(res, "Failed to archive department"),
        );
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Department archived successfully");
      queryClient.invalidateQueries({ queryKey: ["all-departments"] });
      queryClient.invalidateQueries({ queryKey: ["archived-departments"] });
      router.push("/archive");
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to archive department");
      console.error(message);
      toast.error(message);
    },
  });
}
