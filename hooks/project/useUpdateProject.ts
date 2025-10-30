import { Project } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedProject: Project) => {
      const res = await fetch(`/api/projects/`, {
        method: "PUT",
        body: JSON.stringify(updatedProject),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
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
