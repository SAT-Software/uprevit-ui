import { Project } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

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
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update project");
      }
      return res.json().catch(() => null);
    },
    onSuccess: (data, variables) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project", variables._id],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to update project");
      toast.error("Failed to update project");
    },
  });
}
